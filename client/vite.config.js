import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/gemini-api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/gemini-api/, '/api/ai/generate'),
      },
    },
  },
});