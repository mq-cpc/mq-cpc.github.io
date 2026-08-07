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
  // Org GitHub Pages site (repo is named mq-cpc.github.io), served at the root,
  // so no `base`. Internal links still flow through src/lib/base.ts withBase(),
  // which is a no-op at root — kept so a future move to a subpath is one config
  // line, not a link-wide refactor.
  site: 'https://mq-cpc.github.io',
  vite: { plugins: [tailwindcss()] },
});
