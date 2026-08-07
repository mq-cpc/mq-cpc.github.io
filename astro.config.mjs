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
  // GitHub Pages, project site: served under /web-app/. `base` must match the
  // repo name; internal links/asset srcs in .astro are wrapped via
  // src/lib/base.ts (withBase). Internal links authored in Markdown should be
  // written RELATIVE (e.g. ../other-topic/) so they resolve under the subpath
  // without coupling to the base. (A custom domain would let us drop `base`.)
  site: 'https://mq-cpc.github.io',
  base: '/web-app',
  vite: { plugins: [tailwindcss()] },
});
