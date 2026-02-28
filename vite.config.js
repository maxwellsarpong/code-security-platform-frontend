import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
    plugins: [
        vue(),
        // Custom middleware to handle path rewrites for / and /app/
        {
            name: 'path-rewrite',
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    if (req.url === '/') {
                        req.url = '/apps/landing/index.html'
                    } else if (req.url === '/app' || req.url.startsWith('/app/')) {
                        // If it's not an asset request, rewrite to dashboard index.html
                        const isAsset = req.url.match(/\.(js|css|svg|png|jpg|vue|json)$/)
                        if (!isAsset) {
                            req.url = '/apps/dashboard/index.html'
                        }
                    }
                    next()
                })
            }
        }
    ],
    root: '.',
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
            }
        }
    },
    resolve: {
        alias: {
            // Allow components to find their assets relative to their source
            '/src': path.resolve(__dirname, 'src'),
        }
    }
})
