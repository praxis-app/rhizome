import react from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';
import { defineConfig } from 'vite';
import dynamicImport from 'vite-plugin-dynamic-import';

dotenv.config();

// https://vitejs.dev/config
export default defineConfig({
  root: 'view',
  server: {
    port: parseInt(process.env.CLIENT_PORT || '3000'),
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.SERVER_PORT}/api`,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
        changeOrigin: true,
      },
    },
  },
  define: {
    'process.env': process.env,
  },
  build: {
    outDir: '../dist/view',
  },
  plugins: [
    dynamicImport({
      filter(id) {
        if (id.includes('./node_modules/tone')) {
          return true;
        }
      },
    }),
    react(),
  ],
});
