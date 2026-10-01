import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: ['live', 'draft']
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    lastPublishedAt: {
      type: Date,
      default: Date.now
    },
    lastDraftUpdatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    minimize: false // Preserve empty objects if any
  }
);

export const Content = mongoose.models.Content || mongoose.model('Content', ContentSchema);
