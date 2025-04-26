// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Root domain deployment
  assetsInclude: ['**/*.xlsx'], // Include .xlsx files as assets
});
