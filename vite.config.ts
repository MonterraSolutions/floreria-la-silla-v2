import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Versión 2: en GitHub Pages vive en su propio repo, /floreria-la-silla-v2/ (la versión 1 sigue en /floreria-la-silla/).
// En local y en Hostinger, en la raíz.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? (process.env.BASE_PATH ?? '/floreria-la-silla-v2/') : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
}))
