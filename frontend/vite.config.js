import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      context: path.resolve(__dirname, 'src/context'),
      '@api': path.resolve(__dirname, './src/api')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
    allowedHosts: [
      'localhost',
      'bodies-winter-democracy-nam.trycloudflare.com' // 👈 Add your current tunnel URL here
    ]
  }
});
