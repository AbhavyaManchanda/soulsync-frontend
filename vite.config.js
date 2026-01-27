import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Naya import

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Is line ko add karein
  ],
  server: {
    proxy: {
      '/api': 'https://soulsync-backend-e70c.onrender.com' // Backend connection ke liye
    }
  }
})