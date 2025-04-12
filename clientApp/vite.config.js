// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiUrl = import.meta.env.VITE_API_URL;

console.log('API URL:', apiUrl);  // Add this line to verify if it's loaded correctly

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs', // Explicitly point to the PostCSS config file
  },
  server: {
    proxy: {
      '/api': apiUrl, // Replace with your backend server URL
    },
    hmr: {
      overlay: true,
    },
  },
});
