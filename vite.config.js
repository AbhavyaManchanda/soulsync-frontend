// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    transformer: 'postcss', // Standard PostCSS use karein
  },
  optimizeDeps: {
    // Ye line LightningCSS ko optimization se bahar nikal degi
    exclude: ['lightningcss']
  },
  build: {
    cssMinify: 'esbuild'
  }
})