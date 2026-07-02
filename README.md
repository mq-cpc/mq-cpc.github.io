# MQ Competitive Programming Club

Static site for the Macquarie University Competitive Programming Club, built with [Astro](https://astro.build). No backend — content is Markdown/JSON in this repo, rendered to static HTML and deployed to Cloudflare Pages.

## Local development

```sh
nvm use            # Node 26 (see .nvmrc; astro@7 requires >=22.12.0)
npm install
npm run dev         # dev server at localhost:4321
npm test            # run the test suite
npm run build       # production build to ./dist
```

## Editing content

Site content lives in the repo and is edited via pull request:

- `src/content/` — Markdown/JSON content collections (topics, problems, events, resources, reference).
- `src/data/team-board.json` — the "find a team" board shown on the Events page.

Changes go through a normal PR; there is no admin UI or database.

## Deployment

The site auto-deploys to Cloudflare Pages on push to `main`. See [`docs/DEPLOY.md`](docs/DEPLOY.md) for setup and build settings.
