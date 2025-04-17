// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:18099',
    },
    hmr: {
      overlay: true,
    },
  },
  build: {
    rollupOptions: {
      external: ['mongoose'], // 🛡️ This prevents Vite from bundling it
    },
  },
});
