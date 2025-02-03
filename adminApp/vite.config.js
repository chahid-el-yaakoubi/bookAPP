import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default {
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target:  " http://localhost:18099",  // Default to localhost for dev
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
