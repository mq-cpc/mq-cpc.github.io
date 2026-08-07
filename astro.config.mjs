import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  markdown: {
    // Dual themes with defaultColor:false makes Shiki emit --shiki-light /
    // --shiki-dark custom properties instead of baking a colour into every
    // span. Without this it hardcoded a #24292e github-dark background, which
    // sat as a dark slab on the warm paper, ignored the theme toggle, and would
    // have burned a cartridge printing the reference notebook.
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
      wrap: false,
    },
  },
  // Placeholder — confirm the real Cloudflare Pages URL after the first
  // deploy (the subdomain follows the Pages *project* name, not the repo).
  site: 'https://web-app.pages.dev',
  vite: { plugins: [tailwindcss()] },
});
