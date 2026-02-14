import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/admin/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 3001,
  },
  preview: {
    port: 3001,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
