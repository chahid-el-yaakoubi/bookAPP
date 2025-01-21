import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:18099', // Default to localhost for dev
        changeOrigin: true,
        secure: false, // Set to true if using https:// for local development
      },
    },
  },
  optimizeDeps: {
    exclude: ['js-cookie'],
  },
  build: {
    outDir: 'dist',
  },
});
