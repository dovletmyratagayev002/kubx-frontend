import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
    server: {
    host: true,
    port: 5173,
    proxy: {
      '/local': {
        target: 'http://127.0.0.1',
        changeOrigin: true,
        secure: false,
      },
      '/bitrix': {
        target: 'http://127.0.0.1',
        changeOrigin: true,
        secure: false,
      },
      '/upload': {
        target: 'http://127.0.0.1',
        changeOrigin: true,
        secure: false,
      }
    }
  }})
