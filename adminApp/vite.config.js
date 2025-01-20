export default defineConfig({
  plugins: [react()],
  base: '/', // Adjust this if you are deploying to a subpath (e.g., '/my-app/')
  server: {
    proxy: {
      '/api': {
        target: 'https://axistay-backend.onrender.com',
        changeOrigin: true,
        secure: true, 
      }
    }
  },
  optimizeDeps: {
    exclude: ['js-cookie']
  },
  build: {
    outDir: 'dist',
  }
});
