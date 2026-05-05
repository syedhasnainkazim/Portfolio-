import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      },
    },
    rollupOptions: {
      output: {
        // Split vendor chunks for better long-term CDN caching
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('/react/')) return 'react';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('three') || id.includes('@react-three')) return 'three';
            if (id.includes('react-router')) return 'router';
          }
        },
      },
    },
  },
})
