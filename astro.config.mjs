import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  // Placeholder — confirm the real Cloudflare Pages URL after the first
  // deploy (the subdomain follows the Pages *project* name, not the repo).
  site: 'https://web-app.pages.dev',
});
