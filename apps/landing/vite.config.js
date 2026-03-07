import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  root: '.',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://security-compliance-platform.fly.dev',
        changeOrigin: true,
        secure: false,
      },
      '/app': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        ws: true,
      }
    }
  },
})
