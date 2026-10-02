import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function spaAdminFallbackPlugin() {
  return {
    name: 'spa-admin-fallback',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      const indexHtml = path.join(distDir, 'index.html');
      const adminDir = path.join(distDir, 'admin');
      if (fs.existsSync(indexHtml)) {
        if (!fs.existsSync(adminDir)) {
          fs.mkdirSync(adminDir, { recursive: true });
        }
        fs.copyFileSync(indexHtml, path.join(adminDir, 'index.html'));
      }
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), spaAdminFallbackPlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
