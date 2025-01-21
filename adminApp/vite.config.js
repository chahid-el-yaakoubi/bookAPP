const backendUrl = process.env.NODE_ENV === 'production' ? 'https://your-production-backend.com' : 'http://localhost:18099';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
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
