# MQ Competitive Programming Club — site

Static marketing/content site for the Macquarie University CP club. **Astro 7, static output** (`output: 'static'`), no server or backend. Content lives in the repo as Markdown/JSON and compiles to plain HTML.

> **Authoritative context lives in two sibling docs:** `DESIGN.md` (the design system — tokens, both themes, named rules, component specs) and `PRODUCT.md` (product truth — what the club is, audience, goals). This file covers repo/build conventions and CSS gotchas; read those two for design and product decisions.
>
> **Recently expanded** (an "impeccable" design + content pass, ~Aug 2026): topic pages restructured to a **problem-first accordion** (videos attach to problems, not the topic); a print **reference notebook** (`resources/notebook`, `resources/[category]`, `reference/*` + `refcategories/*`); client-side **progress tracking** (`src/scripts/progress.ts`); and a Footer + 404 page. Verify structure against the current files, not older assumptions.

## Commands

```bash
npm run dev       # astro dev — local dev server
npm run build     # astro build — outputs to dist/ (~17 pages)
npm run preview   # serve the built dist/
npm test          # vitest run (2 files / ~23 tests)
```

Node **≥ 22.12** required (Astro 7); dev is pinned to **26** via `.nvmrc`.

## Editing content (the common case)

Most changes are **content, not code** — edit Markdown/JSON under `src/content/`:

- `topics/*.md` — roadmap topics (Getting Started, Java Basics, C++, Recursion & Backtracking, Dynamic Programming). Front-matter drives the topic page; `videos[]` = concept-video cards, and problems link by `topic.id`.
  - `sections[]` — the headings a topic's problems are grouped under (`id`, `title`, optional markdown `intro`). Omit it and the topic gets the default **Video Tutorials** / **Additional Problems** split. Empty sections never render. Rules live in `src/lib/topic-sections.ts`; all page copy is authored here, nothing is appended by the template.
- `problems/*.md` — Kattis problems (title, url, judge, difficulty, `topic`, `order`). One file per problem. A problem with a video lands in its topic's **first** section and one without in its **last**; `section: <id>` overrides that, and an id the topic doesn't declare fails the build.
- `events/*.md`, `resources/*.json`, `reference/*.md` — events list, curated links, team-reference notebook.
- `src/data/team-board.json` — the "looking for a team" board (contributors add themselves via PR).

Collections are defined in `src/content.config.ts` (Astro loader API — `glob()`/`file()`; use `entry.id`, not `.slug`). Pages that render them: `src/pages/*.astro` and `topics/[slug].astro`.

## Styling system — read before touching CSS/markup

Layered system; the interactions are the main source of foot-guns.

- **Tokens** (`src/styles/design/{colors,typography,spacing}.css`) — CSS custom properties (`--accent`, `--space-5`, `--text-md`, …). The single source of truth. Everything resolves against these; do not delete them.
- **Tailwind v4** via `@tailwindcss/vite`. `src/styles/tailwind.css` bridges every token into Tailwind with `@theme inline`, so `bg-accent` → `var(--accent)`, `gap-5` → `var(--space-5)`, etc. **`inline` is required** — it keeps utilities referencing the var at runtime so theming still works.
- **Component classes**: `ps-*` = "**P**astel **S**ystem" reusable components (`components.css`); `mq-*` = Macquarie app glue (`theme.css`, e.g. `mq-heading`, `mq-page`, `mq-grid-3`, `mq-navlink`). These are plain CSS, **imported unlayered**.
- **Themes**: `pastel` (`:root` defaults) and `indigo` (`[data-theme="indigo"]` in `theme.css`), swapped by a `data-theme` attr on `<html>` (pre-paint inline script in `Base.astro` + the ◐ toggle). All colors are tokens, so recolor is automatic — **must survive any change**.

### Gotchas (these bit us; they will bite you)

1. **Utilities lose to `ps-*`/`mq-*`.** Tailwind utilities live in the `utilities` cascade layer; the design CSS is unlayered, and **unlayered always beats layered**. So an inline style that *overrides* a component property (e.g. `ps-card` gap, `ps-card__title` font-size, `ps-btn` display) **cannot** become a utility — it stays inline. Only convert plain elements and non-conflicting props.
2. **Raw px → arbitrary utilities, never scale steps.** `html { font-size: 17px }`, so rem-based tokens diverge from px. A literal `14px` must be `text-[14px]`, *not* `text-sm` (which is `0.875rem` ≈ 14.9px).
3. **Preflight is intentionally OMITTED** (`tailwind.css` imports theme+utilities only). Border utilities still work (Tailwind emits `--tw-border-style:solid`), but there is no list/margin/`<pre>` reset — mind UA defaults (e.g. `<pre>` keeps `margin:1em 0`).
4. **Whitespace-sensitive spots** — the hero terminal lines, inline syntax-color `<span>`s, and problem-table rows. Astro **collapses newlines** inside non-`<pre>` elements. For preformatted blocks use a real `<pre>` (or a frontmatter string) so alignment survives. Box-drawing tables need a **system monospace** (`ui-monospace, …`) + `line-height:1` — the Google-served JetBrains Mono webfont lacks the U+2500 block and falls back, drifting columns.
5. `svg.css` + `graph-tool.css` + `tools/graph.astro` stay plain CSS (d3 sets classes at runtime; no Tailwind SVG utilities).

## Git / PRs

- One remote: **`origin` = `mq-cpc/mq-cpc.github.io`** (the org repo itself, not a fork; it was renamed from `web-app`, and the old URL still redirects). PRs target its `main`. An earlier setup had a separate `org` remote alongside a personal fork; that remote no longer exists — check `git remote -v` before assuming otherwise.
- Branch off `main`; commit only when asked. End commit messages with a `Co-Authored-By:` trailer.
- The user often edits pages manually — **re-read a file from disk before editing** rather than trusting a cached view.

## Known follow-ups

- **Launch-content cleanup is DONE** — the fabricated stats (`127 members`, `running since 2021`), aspirational "Explore the club" copy, and the fake team-board entry were all removed. Don't reintroduce unverifiable claims (this is a "no false information" project).
- **ICPC regional** — the Getting Started explainer still says "regional qualifiers" generically; the exact regional (South Pacific / whichever Macquarie competes in) is pending confirmation.
- **Deploy is GitHub Pages** (`.github/workflows/deploy.yml`, on push to `main`), served at the **host root** — `site: 'https://mq-cpc.github.io'`, **no `base`**. Hand-written links/asset srcs still go through `withBase()` (`src/lib/base.ts`) so a move back under a subpath is a one-line config change. See `docs/DEPLOY.md`.
- Preflight stays off by design.
