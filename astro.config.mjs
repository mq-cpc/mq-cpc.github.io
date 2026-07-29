import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  // Placeholder — confirm the real Cloudflare Pages URL after the first
  // deploy (the subdomain follows the Pages *project* name, not the repo).
  site: 'https://web-app.pages.dev',
  vite: { plugins: [tailwindcss()] },
});
