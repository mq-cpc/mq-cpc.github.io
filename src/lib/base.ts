// Prefix an absolute internal path with the deploy base.
//
// The site currently serves at the org root (https://mq-cpc.github.io/), so
// there is no base and this is a no-op. It's kept because Astro does NOT
// auto-prefix hand-written link hrefs or public/ asset srcs: if the site ever
// moves back to a subpath, setting `base` in astro.config is all it takes and
// every wrapped link follows — no link-wide refactor.
//
// import.meta.env.BASE_URL is '/' at root (or e.g. '/web-app/' under a subpath).
// Strip the trailing slash so `base + '/learn'` joins cleanly and `base + '/'`
// yields the home path.
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

export const withBase = (path: string): string => base + path;
