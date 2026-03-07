import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  root: '.',
  base: '/app/',
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'https://code-security-platform.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})
