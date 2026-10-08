import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Eletro-Recicla-Frontend/',
  plugins: [react()],
  server: {
    // O contrato da API so libera CORS para http://localhost:5173.
    // strictPort impede o Vite de subir em 5174 (5173 ocupada) e
    // quebrar as chamadas com erro de CORS.
    port: 5173,
    strictPort: true,
  },
})


