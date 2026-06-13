import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  css: {
    devSourcemap: true,
  },
  build: {
    sourcemap: false,
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://syncscript.up.railway.app',
        changeOrigin: true,
      }
    },
    // This helps bypass some CSP "eval" issues in local dev
    hmr: {
      overlay: false,
    }
  },
  
})
