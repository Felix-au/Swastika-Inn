import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Root public uploads directory for local fallback
const LOCAL_UPLOADS_DIR = path.join(__dirname, '..', '..', 'public', 'uploads');

function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

function getCloudinary() {
  if (isCloudinaryConfigured()) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
    return cloudinary;
  }
  return null;
}

export const mediaService = {
  isCloudinaryConfigured,

  uploadImage: async (fileBuffer, originalName, mimeType, folder = 'swastika-inn') => {
    // If Cloudinary credentials are set, upload directly to Cloudinary
    if (isCloudinaryConfigured()) {
      const c = getCloudinary();
      return new Promise((resolve, reject) => {
        const uploadStream = c.uploader.upload_stream(
          {
            folder: folder,
            resource_type: 'image',
            format: 'webp',
            transformation: [{ quality: 'auto:good' }, { fetch_format: 'auto' }]
          },
          (error, result) => {
            if (error) {
              console.error('[Media] Cloudinary upload error:', error);
              return reject(error);
            }
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
              provider: 'cloudinary'
            });
          }
        );
        uploadStream.end(fileBuffer);
      });
    }

    // Local Fallback: Save file to public/uploads/
    if (!fs.existsSync(LOCAL_UPLOADS_DIR)) {
      fs.mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });
    }

    const ext = path.extname(originalName) || '.jpeg';
    const cleanBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    const filename = `${cleanBase}_${Date.now()}${ext}`;
    const destinationPath = path.join(LOCAL_UPLOADS_DIR, filename);

    fs.writeFileSync(destinationPath, fileBuffer);

    return {
      url: `/uploads/${filename}`,
      publicId: filename,
      provider: 'local',
      note: 'Saved locally. Add Cloudinary credentials to .env to upload to CDN cloud.'
    };
  },

  deleteImage: async (publicId) => {
    if (isCloudinaryConfigured() && !publicId.includes('/uploads/')) {
      try {
        const c = getCloudinary();
        const result = await c.uploader.destroy(publicId);
        return result;
      } catch (err) {
        console.warn('[Media] Cloudinary delete warning:', err.message);
      }
    }

    // If local file
    const localFile = path.join(LOCAL_UPLOADS_DIR, path.basename(publicId));
    if (fs.existsSync(localFile)) {
      try {
        fs.unlinkSync(localFile);
      } catch (e) {
        console.warn('[Media] Local delete warning:', e.message);
      }
    }
    return { result: 'ok' };
  }
};
