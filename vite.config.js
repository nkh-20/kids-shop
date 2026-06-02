import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        react(),
        laravel({
            input: ['resources/js/main.js'],
            refresh: true,
        }),
    ],
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-dom/client',
            'react-router-dom',
        ],
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        hmr: {
            host: 'localhost',
        },
    },
});
