# Deploy — GitHub Pages

The site auto-deploys from GitHub on every push to `main` via
`.github/workflows/deploy.yml`. No server; output is static.

It is served at the **root of the host** (`https://mq-cpc.github.io/`), so
`astro.config.mjs` sets **no `base`** — local dev/preview is at `/` too.

## One-time setup (an org owner does this)
1. The repo must be **public** (Pages on a private repo needs a paid plan).
2. Settings → Pages → Build and deployment → Source = **GitHub Actions**.
3. Root serving needs either the org's user/org Pages repo
   (`mq-cpc/mq-cpc.github.io`) or a custom domain. A project repo such as
   `mq-cpc/web-app` would publish under `/<repo>/` instead — in that case set
   `base: '/<repo>'` in `astro.config.mjs` to match (everything already routes
   through `withBase()`, so that is the only change).

## Ongoing
- Every push to `main` builds and deploys (workflow_dispatch also available).
- Node 22 is pinned in the workflow (astro@7 needs `>= 22.12`); `.nvmrc` pins
  local dev to 26.
