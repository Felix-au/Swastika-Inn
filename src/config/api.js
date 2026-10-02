// API Base URL configuration
// In local development, Vite proxy forwards /api to http://localhost:5000.
// When deployed on Vercel, set VITE_API_URL in Vercel settings to your Render backend URL:
// Example: https://swastika-backend.onrender.com
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${cleanEndpoint}`;
};
