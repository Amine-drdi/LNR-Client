import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://51.83.69.195:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});