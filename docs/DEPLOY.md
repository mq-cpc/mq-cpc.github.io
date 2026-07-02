# Deploy — Cloudflare Pages

The site auto-deploys from the private GitHub repo. No server; output is static.

## One-time setup (an org owner does this)
1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
2. Authorise Cloudflare for the `sutantyo/mq-cpc-app` repo.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: set env var `NODE_VERSION = 26` (must satisfy `>=22.12.0`, the minimum required by astro@7; see `.nvmrc` / `engines.node` in `package.json`)
4. Save & Deploy.

## Ongoing
- Every push to `main` triggers a build and deploy.
- Pull requests get a preview deployment URL automatically.
