import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, connectDB } from './db.js';
import { mediaService } from './services/mediaService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config(); // fallback to root .env if present

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'swastika_ayodhya_secure_jwt_secret_key_2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'swastika2026';

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for local upload fallback
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// Multer in-memory storage for media uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB max
});

// Auth Middleware
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Token expired or invalid' });
  }
}

// ==========================================
// 1. PUBLIC ENDPOINTS
// ==========================================

// Health check (supports both /health and /api/health for Render/cloud monitors)
const handleHealthCheck = (req, res) => {
  res.json({
    status: 'online',
    service: 'swastika-inn-backend',
    timestamp: new Date().toISOString(),
    database: db.isReady() ? 'mongodb_connected' : 'pending_mongodb_uri',
    cloudinaryConfigured: mediaService.isCloudinaryConfigured()
  });
};

app.get('/health', handleHealthCheck);
app.get('/api/health', handleHealthCheck);

// Live Public Content (Cached with ETag & stale-while-revalidate)
app.get('/api/content', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    const liveContent = await db.getLive();
    res.json({
      success: true,
      data: liveContent
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch content: ' + err.message });
  }
});

// Get specific section from live content
app.get('/api/content/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const liveContent = await db.getLive();
    if (liveContent[section]) {
      return res.json({ success: true, data: liveContent[section] });
    }
    res.status(404).json({ error: `Section '${section}' not found` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. AUTHENTICATION ENDPOINTS
// ==========================================

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid admin password' });
  }

  const token = jwt.sign({ role: 'admin', user: 'hotel_manager' }, JWT_SECRET, {
    expiresIn: '7d'
  });

  res.json({
    success: true,
    token,
    user: { role: 'admin', name: 'Hotel Manager' }
  });
});

app.get('/api/auth/verify', requireAuth, (req, res) => {
  res.json({ success: true, user: req.user });
});

// ==========================================
// 3. ADMIN DRAFT & CMS ENDPOINTS
// ==========================================

// Get current working draft content + status
app.get('/api/admin/draft', requireAuth, async (req, res) => {
  try {
    const draft = await db.getDraft();
    const status = db.getStatus();
    res.json({
      success: true,
      draft,
      status
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a specific section in the draft
app.put('/api/admin/draft/:section', requireAuth, async (req, res) => {
  const { section } = req.params;
  const updatedSectionData = req.body;

  try {
    const updatedDraft = await db.updateDraftSection(section, updatedSectionData);
    res.json({
      success: true,
      message: `Section '${section}' draft updated`,
      draft: updatedDraft,
      status: db.getStatus()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update entire draft payload
app.put('/api/admin/draft', requireAuth, async (req, res) => {
  try {
    const updatedDraft = await db.updateFullDraft(req.body);
    res.json({
      success: true,
      draft: updatedDraft,
      status: db.getStatus()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Publish draft to live website
app.post('/api/admin/publish', requireAuth, async (req, res) => {
  try {
    const result = await db.publishDraft();
    res.json({
      success: true,
      message: 'Draft published to live site successfully in MongoDB!',
      publishedAt: result.publishedAt,
      data: result.data,
      status: db.getStatus()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Discard changes and revert draft to current live
app.post('/api/admin/discard', requireAuth, async (req, res) => {
  try {
    const result = await db.discardDraft();
    res.json({
      success: true,
      message: 'Draft discarded. Reverted to live content.',
      draft: result.data,
      status: db.getStatus()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset database back to default seed data
app.post('/api/admin/reset-defaults', requireAuth, async (req, res) => {
  try {
    const result = await db.resetDefaults();
    res.json({
      success: true,
      message: 'Reset all site content to original defaults in MongoDB.',
      data: result.data,
      status: db.getStatus()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. MEDIA UPLOAD (Cloudinary + Local Fallback)
// ==========================================

app.post('/api/media/upload', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const folder = req.body.folder || 'swastika-inn';
    const uploadResult = await mediaService.uploadImage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      folder
    );

    res.json({
      success: true,
      ...uploadResult
    });
  } catch (err) {
    console.error('[Upload Error]:', err);
    res.status(500).json({ error: 'Image upload failed: ' + err.message });
  }
});

app.delete('/api/media/:publicId', requireAuth, async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await mediaService.deleteImage(publicId);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start listening after initiating MongoDB connection
app.listen(PORT, async () => {
  console.log(`===============================================`);
  console.log(`🚀 Hotel Swastika Inn Backend API running on port ${PORT}`);
  console.log(`📡 Public Content: http://localhost:${PORT}/api/content`);
  console.log(`🛠️ Health Check:   http://localhost:${PORT}/api/health`);
  console.log(`🔑 Admin Auth:     POST http://localhost:${PORT}/api/auth/login`);
  console.log(`===============================================`);

  await connectDB();
});
