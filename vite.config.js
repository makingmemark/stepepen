import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3004
  },
  target: 'es2022', // or 'es2023' or 'esnext'
})