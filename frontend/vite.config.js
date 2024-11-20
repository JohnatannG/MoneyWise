import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
  },
  base: '/MoneyWise/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})