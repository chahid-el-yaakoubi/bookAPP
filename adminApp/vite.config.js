import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {BASE_URL} from './src/pages/utils/apiConfig'

export default {
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: BASE_URL || " http://localhost:18049",  // Default to localhost for dev
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
};
