import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    passWithNoTests: true,
    watch: false,
    setupFiles: './test/utils.tsx',
    env: {
      API_URL: 'http://localhost:4000/api',
      WS_URL: 'http://localhost:4000/api',
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@test': resolve(__dirname, './test'),
    },
  },
});
