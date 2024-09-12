import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig( {
    plugins: [ preact() ],
    server: {
        watch: {
            usePolling: true,
        },
        host: true, // needed for the Docker Container port mapping to work
        port: 5173,
        // To avoid CORS errors.
        origin: 'http://127.0.0.1:5173',
        proxy: {
            "/api": {
                target: "http://localhost:5025",
                changeOrigin: true,
                secure: false,
            }
        }
    },
} )
