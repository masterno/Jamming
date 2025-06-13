import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl(),
    tsconfigPaths()
  ],
  server: {
    // https: true, // plugin-basic-ssl handles this
    port: 5173
  }
})
