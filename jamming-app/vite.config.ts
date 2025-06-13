import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl()
  ],
  server: {
    // https: true, // plugin-basic-ssl handles this
    port: 5173
  }
})
