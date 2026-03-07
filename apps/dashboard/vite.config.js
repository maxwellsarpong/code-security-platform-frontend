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
        target: 'https://security-compliance-platform.fly.dev',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})
