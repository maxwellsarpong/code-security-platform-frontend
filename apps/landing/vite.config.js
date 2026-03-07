import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  root: '.',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://code-security-platform.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/app': {
        target: 'https://code-security-platform-frontend-lan.vercel.app',
        changeOrigin: true,
        ws: true,
      }
    }
  },
})
