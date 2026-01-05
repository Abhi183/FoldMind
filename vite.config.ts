import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Cloudflare Pages-friendly default:
  // - output is dist/
  // - use hash routing in-app, so no special SPA rewrites required
});
