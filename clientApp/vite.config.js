// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs', // Explicitly point to the PostCSS config file
  },
  server: {
    proxy: {
      '/api': 'http://localhost:18099', // Replace with your backend server URL
    },
    hmr: {
      overlay: true,
    },
  },
});