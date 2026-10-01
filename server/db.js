import mongoose from 'mongoose';
import { Content } from './models/Content.js';
import { DEFAULT_SITE_DATA } from './data/defaultData.js';

let isConnected = false;
let inMemoryLive = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
let inMemoryDraft = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
let statusCache = {
  lastPublishedAt: new Date().toISOString(),
  lastDraftUpdatedAt: new Date().toISOString()
};

/**
 * Connect to MongoDB and seed initial data if collections are empty.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ [MongoDB] MONGODB_URI is not set in server/.env');
    console.warn('⚠️ [MongoDB] Using in-memory default content. Set MONGODB_URI to persist changes permanently.');
    return false;
  }

  try {
    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      return true;
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log('✅ [MongoDB] Connected successfully to database');

    // Seed/sync live and draft documents
    await syncWithDatabase();
    return true;
  } catch (err) {
    console.error('❌ [MongoDB] Connection error:', err.message);
    isConnected = false;
    return false;
  }
}

/**
 * Ensure live and draft documents exist in MongoDB, and cache them locally.
 */
async function syncWithDatabase() {
  if (!isConnected) return;

  try {
    let liveDoc = await Content.findOne({ key: 'live' });
    if (!liveDoc) {
      console.log('🌱 [MongoDB] Seeding default live hotel content...');
      liveDoc = await Content.create({
        key: 'live',
        data: DEFAULT_SITE_DATA,
        lastPublishedAt: new Date()
      });
    }

    let draftDoc = await Content.findOne({ key: 'draft' });
    if (!draftDoc) {
      console.log('🌱 [MongoDB] Seeding default draft hotel content...');
      draftDoc = await Content.create({
        key: 'draft',
        data: liveDoc.data,
        lastDraftUpdatedAt: new Date()
      });
    }

    inMemoryLive = liveDoc.data;
    inMemoryDraft = draftDoc.data;
    statusCache = {
      lastPublishedAt: liveDoc.lastPublishedAt ? liveDoc.lastPublishedAt.toISOString() : new Date().toISOString(),
      lastDraftUpdatedAt: draftDoc.lastDraftUpdatedAt ? draftDoc.lastDraftUpdatedAt.toISOString() : new Date().toISOString()
    };
  } catch (err) {
    console.error('❌ [MongoDB] Error syncing data:', err.message);
  }
}

export const db = {
  isReady: () => isConnected,

  getLive: async () => {
    if (isConnected) {
      try {
        const doc = await Content.findOne({ key: 'live' }).lean();
        if (doc?.data) {
          inMemoryLive = doc.data;
          return doc.data;
        }
      } catch (err) {
        console.error('[DB] Error reading live doc from MongoDB:', err.message);
      }
    }
    return inMemoryLive;
  },

  getDraft: async () => {
    if (isConnected) {
      try {
        const doc = await Content.findOne({ key: 'draft' }).lean();
        if (doc?.data) {
          inMemoryDraft = doc.data;
          return doc.data;
        }
      } catch (err) {
        console.error('[DB] Error reading draft doc from MongoDB:', err.message);
      }
    }
    return inMemoryDraft;
  },

  updateDraftSection: async (section, data) => {
    if (!inMemoryDraft) {
      inMemoryDraft = JSON.parse(JSON.stringify(inMemoryLive));
    }
    inMemoryDraft[section] = JSON.parse(JSON.stringify(data));
    statusCache.lastDraftUpdatedAt = new Date().toISOString();

    if (isConnected) {
      await Content.findOneAndUpdate(
        { key: 'draft' },
        {
          $set: {
            [`data.${section}`]: data,
            lastDraftUpdatedAt: new Date()
          }
        },
        { upsert: true, new: true }
      );
    }

    return inMemoryDraft;
  },

  updateFullDraft: async (fullDraftData) => {
    inMemoryDraft = JSON.parse(JSON.stringify(fullDraftData));
    statusCache.lastDraftUpdatedAt = new Date().toISOString();

    if (isConnected) {
      await Content.findOneAndUpdate(
        { key: 'draft' },
        {
          $set: {
            data: fullDraftData,
            lastDraftUpdatedAt: new Date()
          }
        },
        { upsert: true, new: true }
      );
    }

    return inMemoryDraft;
  },

  publishDraft: async () => {
    inMemoryLive = JSON.parse(JSON.stringify(inMemoryDraft));
    const now = new Date();
    statusCache.lastPublishedAt = now.toISOString();

    if (isConnected) {
      await Content.findOneAndUpdate(
        { key: 'live' },
        {
          $set: {
            data: inMemoryDraft,
            lastPublishedAt: now
          }
        },
        { upsert: true, new: true }
      );
    }

    return {
      success: true,
      publishedAt: statusCache.lastPublishedAt,
      data: inMemoryLive
    };
  },

  discardDraft: async () => {
    inMemoryDraft = JSON.parse(JSON.stringify(inMemoryLive));
    const now = new Date();
    statusCache.lastDraftUpdatedAt = now.toISOString();

    if (isConnected) {
      await Content.findOneAndUpdate(
        { key: 'draft' },
        {
          $set: {
            data: inMemoryLive,
            lastDraftUpdatedAt: now
          }
        },
        { upsert: true, new: true }
      );
    }

    return {
      success: true,
      data: inMemoryDraft
    };
  },

  resetDefaults: async () => {
    inMemoryLive = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
    inMemoryDraft = JSON.parse(JSON.stringify(DEFAULT_SITE_DATA));
    const now = new Date();
    statusCache.lastPublishedAt = now.toISOString();
    statusCache.lastDraftUpdatedAt = now.toISOString();

    if (isConnected) {
      await Content.findOneAndUpdate(
        { key: 'live' },
        { $set: { data: DEFAULT_SITE_DATA, lastPublishedAt: now } },
        { upsert: true }
      );
      await Content.findOneAndUpdate(
        { key: 'draft' },
        { $set: { data: DEFAULT_SITE_DATA, lastDraftUpdatedAt: now } },
        { upsert: true }
      );
    }

    return {
      success: true,
      data: inMemoryLive
    };
  },

  getStatus: () => {
    return {
      hasUnpublishedChanges: JSON.stringify(inMemoryLive) !== JSON.stringify(inMemoryDraft),
      lastPublishedAt: statusCache.lastPublishedAt,
      lastDraftUpdatedAt: statusCache.lastDraftUpdatedAt,
      database: isConnected ? 'mongodb_connected' : 'memory_pending_mongodb_uri'
    };
  }
};
