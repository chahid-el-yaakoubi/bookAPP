import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { BASE_URL } from './src/pages/utils/apiConfig'; // Import the value

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: BASE_URL || "http://localhost:18049", // Use imported BASE_URL or default to localhost
        changeOrigin: true,
        secure: false,
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
