// Prefix an absolute internal path with the deploy base.
//
// GitHub Pages serves this project under a subpath (https://mq-cpc.github.io/web-app/),
// so `base` is set to '/web-app' in astro.config. Astro auto-prefixes its own
// bundled assets, but NOT hand-written link hrefs or public/ asset srcs — those
// must be wrapped in withBase().
//
// import.meta.env.BASE_URL is '/web-app/' in that deploy (or '/' for a root
// deploy). Strip the trailing slash so `base + '/learn'` joins cleanly and
// `base + '/'` yields the home path.
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

export const withBase = (path: string): string => base + path;
