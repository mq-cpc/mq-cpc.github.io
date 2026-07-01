# MQ CPC Site — Static Foundation Implementation Plan (Plan 1 of 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a fully static, browsable MQ Competitive Programming Club website — design system, content model, and all content-driven pages — with no interactive tracker yet (that is Plan 2).

**Architecture:** Astro static-site generator. All content lives as Markdown/JSON in Astro content collections (the durable archive). `npm run build` compiles to a `dist/` folder of plain static HTML/CSS/JS. Deployed on Cloudflare Pages from the private GitHub repo. No club server or database.

**Tech Stack:** Astro (static output), TypeScript, Vitest (unit tests), Zod (content-collection validation, bundled with Astro), Cloudflare Pages (hosting). Fonts: Libre Franklin + JetBrains Mono. Design tokens/components come from the synced Claude Design project "Macquarie ICPC coding club".

## Global Constraints

- **Static only.** The build must emit a purely static bundle. No SSR, no server runtime, no API routes. `output` stays default (`'static'`).
- **No runtime club backend or database.** Nothing the club must keep running.
- **Content is the archive.** All durable content lives as Markdown/JSON in `src/content/`, editable via PR. No content baked into components.
- **Node version floor:** Node 20 LTS or newer (Astro 4+ requirement). Pin in `.nvmrc` and `package.json` `engines`.
- **Package manager:** npm (lockfile committed).
- **Design source of truth:** the CSS tokens/components from Claude Design project `96a30750-d07d-413b-92a0-4af8d1c6caf9`. Reuse them; do not reinvent the visual language.
- **Two themes:** light `pastel` (default) and dark `indigo`, toggled via a `data-theme` attribute on the page root.
- **Type identifiers must match across tasks** exactly as written in each task's Interfaces block.
- **Problem ID scheme:** a problem's stable ID is its content-collection entry slug (the filename without extension), e.g. `graphs-bfs-shortest-path`. This ID is the contract with the tracker (Plan 2) and must never change once published.
- **Commit after every task** with a conventional-commit message.

---

## File Structure

```
mq-cpc-app/
  .nvmrc
  astro.config.mjs          # Astro config, static output
  vitest.config.ts          # Vitest config
  package.json
  tsconfig.json
  src/
    content/
      config.ts             # Zod schemas for all collections (Task 3)
      topics/*.md           # roadmap topics (frontmatter + overview body)
      problems/*.md         # one file per problem; body = editorial/discussion
      events/*.md           # one file per event
      reference/*.md        # team-reference snippets; body = fenced code
      resources/*.json      # curated links, one file per category
    data/
      team-board.json       # team-finder entries (edited via PR)
    lib/
      roadmap.ts            # group/sort topics by level (Task 4)
      team-board.ts         # parse + validate team-board.json (Task 8)
    layouts/
      Base.astro            # <head>, fonts, design CSS, theme root (Task 2)
    components/
      Header.astro          # sticky header + nav (Task 5)
      EventCard.astro       # (Task 5/8)
      TopicCard.astro       # (Task 6)
    pages/
      index.astro           # Home (Task 5)
      learn.astro           # Roadmap (Task 6)
      topics/[slug].astro   # Topic detail (Task 7)
      events.astro          # Events + team board (Task 8)
      resources.astro       # Resources + team reference (Task 9)
      tools.astro           # external-tool links (Task 10)
    styles/
      design/               # CSS copied from the Claude Design project
      theme.css             # theme toggle glue + app-specific tweaks
    scripts/
      theme-toggle.ts       # client-side theme switch (Task 2)
  public/
    fonts/                  # optional self-hosted fonts (Task 2 note)
  tests/
    roadmap.test.ts         # Task 4
    team-board.test.ts      # Task 8
```

---

### Task 1: Scaffold the Astro project with Vitest

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `.nvmrc`, `src/pages/index.astro`
- Modify: `.gitignore` (already present — confirm `node_modules/` and `dist/` are ignored)

**Interfaces:**
- Consumes: nothing.
- Produces: a working Astro project where `npm run build` emits `dist/` and `npm test` runs Vitest.

- [ ] **Step 1: Create the project non-interactively**

Run from the repo root:
```bash
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict --skip-houston
```
If the directory-not-empty prompt blocks it, create in a temp dir and copy files in, preserving the existing `.git`, `.gitignore`, and `docs/`.

- [ ] **Step 2: Add Vitest and pin Node**

```bash
npm pkg set scripts.test="vitest run" scripts.test:watch="vitest"
npm pkg set engines.node=">=20"
printf "20\n" > .nvmrc
npm install -D vitest
npm install
```

- [ ] **Step 3: Write `astro.config.mjs` (static output)**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://mq-cpc-app.pages.dev',
});
```

- [ ] **Step 4: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 5: Replace `src/pages/index.astro` with a smoke page**

```astro
---
const title = 'MQ Competitive Programming Club';
---
<html lang="en">
  <head><meta charset="utf-8" /><title>{title}</title></head>
  <body><h1>{title}</h1></body>
</html>
```

- [ ] **Step 6: Verify build and test both work**

Run: `npm run build`
Expected: completes, creates `dist/index.html` containing "MQ Competitive Programming Club".

Run: `npm test`
Expected: Vitest runs and reports "No test files found" (exit 0) — acceptable at this stage.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro project with Vitest"
```

---

### Task 2: Design system, fonts, and theme toggle

**Files:**
- Create: `src/styles/design/` (copied CSS), `src/styles/theme.css`, `src/layouts/Base.astro`, `src/scripts/theme-toggle.ts`
- Modify: `src/pages/index.astro` (use `Base.astro`)

**Interfaces:**
- Consumes: nothing.
- Produces: `Base.astro` — a layout accepting props `{ title: string; description?: string }` and a default slot, rendering `<html>` with `data-theme` and all design CSS + fonts loaded. `initTheme()` — exported from `theme-toggle.ts`, wires a `[data-theme-toggle]` button to switch `data-theme` between `pastel`/`indigo` and persist to `localStorage['mqcp-theme']`.

- [ ] **Step 1: Bring in the design CSS from the Claude Design project**

Copy these files from the synced design project into `src/styles/design/` (fetch them with the DesignSync `get_file` method against project `96a30750-d07d-413b-92a0-4af8d1c6caf9`, paths under `_ds/pastel-design-system-3a7c0cbc-c71c-433f-bbc2-3bf4a72ac76d/`):
```
tokens/colors.css      -> src/styles/design/colors.css
tokens/typography.css  -> src/styles/design/typography.css
tokens/spacing.css     -> src/styles/design/spacing.css
components/components.css -> src/styles/design/components.css
components/svg.css     -> src/styles/design/svg.css
styles.css             -> src/styles/design/base.css
```
Also copy the dark **indigo** theme override block (the `.mqcp[data-theme="dark"] { ... }` rule) from `MQ CP Club.dc.html`'s `<style>` into `src/styles/theme.css`, renaming the selector to `[data-theme="indigo"]`.

- [ ] **Step 2: Write `src/scripts/theme-toggle.ts`**

```ts
const KEY = 'mqcp-theme';
type Theme = 'pastel' | 'indigo';

export function initTheme(): void {
  const root = document.documentElement;
  const stored = (localStorage.getItem(KEY) as Theme | null) ?? 'pastel';
  root.setAttribute('data-theme', stored);
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next: Theme =
        root.getAttribute('data-theme') === 'indigo' ? 'pastel' : 'indigo';
      root.setAttribute('data-theme', next);
      localStorage.setItem(KEY, next);
    });
  });
}
```

- [ ] **Step 3: Write `src/layouts/Base.astro`**

```astro
---
import '../styles/design/colors.css';
import '../styles/design/typography.css';
import '../styles/design/spacing.css';
import '../styles/design/components.css';
import '../styles/design/svg.css';
import '../styles/design/base.css';
import '../styles/theme.css';
interface Props { title: string; description?: string }
const { title, description = 'Macquarie University competitive programming club.' } = Astro.props;
---
<!doctype html>
<html lang="en" data-theme="pastel">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" />
  </head>
  <body class="mqcp ps-page">
    <slot />
    <script>
      import { initTheme } from '../scripts/theme-toggle.ts';
      initTheme();
    </script>
  </body>
</html>
```

- [ ] **Step 4: Use the layout in `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="MQ Competitive Programming Club">
  <main style="padding:var(--space-6);">
    <h1 class="ps-h1">MQ Competitive Programming Club</h1>
    <button class="ps-btn" data-theme-toggle>Toggle theme</button>
  </main>
</Base>
```

- [ ] **Step 5: Verify build and theme wiring**

Run: `npm run build`
Expected: build succeeds; `dist/index.html` links the design CSS and contains `data-theme="pastel"`.

Run: `npm run dev` and open the page; click "Toggle theme".
Expected: page switches to the indigo dark palette and the choice persists across reload.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add design system, fonts, and theme toggle"
```

---

### Task 3: Content collections schema

**Files:**
- Create: `src/content/config.ts`, one sample entry per collection: `src/content/topics/graphs.md`, `src/content/problems/graphs-bfs-shortest-path.md`, `src/content/events/2026-week1-practice.md`, `src/content/reference/graphs-dijkstra.md`, `src/content/resources/algorithms.json`
- Create: `src/data/team-board.json`

**Interfaces:**
- Consumes: nothing.
- Produces: collections `topics`, `problems`, `events`, `reference`, `resources` with the exact schemas below. A problem's ID is its entry slug. `problems.data.topic` is an Astro `reference('topics')`.

- [ ] **Step 1: Write `src/content/config.ts`**

```ts
import { defineCollection, reference, z } from 'astro:content';

const LEVEL = z.enum(['foundations', 'intermediate', 'advanced']);
const CATEGORY = z.enum(['c1', 'c2', 'c3', 'c4', 'c5', 'c6']);
const DIFFICULTY = z.enum(['easy', 'medium', 'hard']);

const topics = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    level: LEVEL,
    order: z.number().int().nonnegative(),
    blurb: z.string(),
    color: CATEGORY,
    videos: z
      .array(
        z.object({
          title: z.string(),
          youtubeId: z.string(),
          channel: z.string().optional(),
          duration: z.string().optional(),
        }),
      )
      .default([]),
  }),
});

const problems = defineCollection({
  type: 'content',
  schema: z.object({
    topic: reference('topics'),
    title: z.string(),
    difficulty: DIFFICULTY,
    tags: z.array(z.string()).default([]),
    judge: z.string(),
    url: z.string().url(),
    order: z.number().int().nonnegative().default(0),
  }),
});

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    location: z.string().optional(),
    type: z.enum(['contest', 'workshop', 'social', 'other']).default('other'),
    tag: z.string().optional(),
  }),
});

const reference = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    lang: z.string().default('cpp'),
    order: z.number().int().nonnegative().default(0),
  }),
});

const resources = defineCollection({
  type: 'data',
  schema: z.object({
    category: z.string(),
    order: z.number().int().nonnegative().default(0),
    links: z.array(
      z.object({ label: z.string(), url: z.string().url(), note: z.string().optional() }),
    ),
  }),
});

export const collections = { topics, problems, events, reference, resources };
```

- [ ] **Step 2: Write the sample content entries**

`src/content/topics/graphs.md`:
```md
---
name: Graphs
level: intermediate
order: 4
color: c6
blurb: Representations, traversal, and shortest paths.
videos:
  - title: Graphs — the mental model
    youtubeId: dQw4w9WgXcQ
    channel: MQ CP Club
    duration: "14:22"
---
Graphs show up everywhere in contests. Start with representations (adjacency
list vs matrix), then BFS/DFS, then weighted shortest paths.
```

`src/content/problems/graphs-bfs-shortest-path.md`:
```md
---
topic: graphs
title: BFS Shortest Path
difficulty: medium
tags: [bfs, graphs]
judge: Kattis
url: https://open.kattis.com/problems/shortestpath1
order: 1
---
Model the grid as a graph and run a breadth-first search from the source.
Each cell's distance is its BFS layer.
```

`src/content/events/2026-week1-practice.md`:
```md
---
title: Week 1 Practice Contest
date: 2026-03-02T18:00:00+11:00
location: 4CC 105
type: contest
tag: Practice
---
Kick-off practice contest. All levels welcome.
```

`src/content/reference/graphs-dijkstra.md`:
```md
---
title: Dijkstra
category: Graphs
lang: cpp
order: 1
---
​```cpp
void dijkstra(int s) {
  fill(dist, dist + N, INF); dist[s] = 0;
  priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
  pq.push({0, s});
  while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d > dist[u]) continue;
    for (auto [v, w] : adj[u])
      if (dist[u] + w < dist[v]) pq.push({dist[v] = dist[u] + w, v});
  }
}
​```
```

`src/content/resources/algorithms.json`:
```json
{
  "category": "Algorithms & references",
  "order": 1,
  "links": [
    { "label": "CP-Algorithms", "url": "https://cp-algorithms.com/" },
    { "label": "USACO Guide", "url": "https://usaco.guide/" }
  ]
}
```

`src/data/team-board.json`:
```json
{
  "entries": [
    { "handle": "octofox", "name": "Sam", "looking": "1 more, intermediate", "contact": "Discord: octofox" }
  ]
}
```

- [ ] **Step 3: Verify the schemas validate against the sample content**

Run: `npm run build`
Expected: build succeeds with no content-collection validation errors. (Astro validates all frontmatter against the Zod schemas at build time.)

- [ ] **Step 4: Verify a bad entry is rejected (temporary check)**

Temporarily change `difficulty: medium` to `difficulty: impossible` in the sample problem, then run `npm run build`.
Expected: build FAILS with a Zod error naming `difficulty`. Revert the change afterward.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: define content collections and seed sample content"
```

---

### Task 4: Roadmap grouping utility (TDD)

**Files:**
- Create: `src/lib/roadmap.ts`
- Test: `tests/roadmap.test.ts`

**Interfaces:**
- Consumes: an array of topic-like objects `{ slug: string; name: string; level: 'foundations'|'intermediate'|'advanced'; order: number }`.
- Produces: `groupTopicsByLevel(topics)` returning `Array<{ level: string; label: string; items: Topic[] }>` in fixed level order (foundations → intermediate → advanced), each `items` sorted by `order` ascending. Exports `type RoadmapTopic` and `type RoadmapGroup`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/roadmap.test.ts
import { describe, it, expect } from 'vitest';
import { groupTopicsByLevel, type RoadmapTopic } from '../src/lib/roadmap';

const topics: RoadmapTopic[] = [
  { slug: 'dp', name: 'DP', level: 'advanced', order: 2 },
  { slug: 'basics', name: 'Basics', level: 'foundations', order: 1 },
  { slug: 'greedy', name: 'Greedy', level: 'intermediate', order: 2 },
  { slug: 'twoptr', name: 'Two Pointers', level: 'intermediate', order: 1 },
];

describe('groupTopicsByLevel', () => {
  it('orders groups foundations -> intermediate -> advanced', () => {
    const groups = groupTopicsByLevel(topics);
    expect(groups.map((g) => g.level)).toEqual(['foundations', 'intermediate', 'advanced']);
  });

  it('sorts items within a group by order', () => {
    const groups = groupTopicsByLevel(topics);
    const inter = groups.find((g) => g.level === 'intermediate')!;
    expect(inter.items.map((t) => t.slug)).toEqual(['twoptr', 'greedy']);
  });

  it('omits levels with no topics', () => {
    const groups = groupTopicsByLevel([{ slug: 'x', name: 'X', level: 'foundations', order: 1 }]);
    expect(groups.map((g) => g.level)).toEqual(['foundations']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/roadmap.test.ts`
Expected: FAIL — cannot find module `../src/lib/roadmap`.

- [ ] **Step 3: Write `src/lib/roadmap.ts`**

```ts
export type Level = 'foundations' | 'intermediate' | 'advanced';
export interface RoadmapTopic {
  slug: string;
  name: string;
  level: Level;
  order: number;
}
export interface RoadmapGroup {
  level: Level;
  label: string;
  items: RoadmapTopic[];
}

const LEVEL_ORDER: Level[] = ['foundations', 'intermediate', 'advanced'];
const LEVEL_LABEL: Record<Level, string> = {
  foundations: 'Foundations',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export function groupTopicsByLevel(topics: RoadmapTopic[]): RoadmapGroup[] {
  return LEVEL_ORDER.map((level) => ({
    level,
    label: LEVEL_LABEL[level],
    items: topics
      .filter((t) => t.level === level)
      .sort((a, b) => a.order - b.order),
  })).filter((g) => g.items.length > 0);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/roadmap.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add roadmap grouping utility"
```

---

### Task 5: Header component and Home page

**Files:**
- Create: `src/components/Header.astro`, `src/components/EventCard.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `Base.astro`; `events` collection.
- Produces: `Header.astro` — renders the sticky header (logo, title, theme toggle button with `data-theme-toggle`, and a "Sign in with GitHub" button that is inert in Plan 1) and the nav with links to `/`, `/learn`, `/events`, `/resources`, `/tools`. `EventCard.astro` — props `{ title, date, location?, tag?, stroke }`.

- [ ] **Step 1: Write `src/components/Header.astro`**

```astro
---
const links = [
  { href: '/', label: 'home' },
  { href: '/learn', label: 'learn' },
  { href: '/events', label: 'events' },
  { href: '/resources', label: 'resources' },
  { href: '/tools', label: 'tools' },
];
const path = Astro.url.pathname;
---
<header style="position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:var(--space-5);padding:var(--space-3) var(--space-6);background:color-mix(in srgb, var(--surface) 86%, transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--line);">
  <a href="/" style="display:flex;align-items:center;gap:var(--space-3);text-decoration:none;">
    <span style="width:34px;height:34px;border-radius:var(--radius-md);background:var(--accent);color:var(--accent-ink);display:grid;place-items:center;font-family:var(--font-label);font-weight:700;">{'{}'}</span>
    <span style="display:flex;flex-direction:column;line-height:1.05;">
      <span style="font-family:var(--font-display);font-weight:600;color:var(--ink-strong);font-size:15px;">MQ Competitive Programming Club</span>
      <span class="mono" style="font-size:11px;color:var(--ink-muted);">acm.icpc · macquarie</span>
    </span>
  </a>
  <span style="flex:1;"></span>
  <button class="ps-btn ps-btn--sm" data-theme-toggle title="Toggle theme" style="width:34px;height:34px;padding:0;">◐</button>
  <button class="ps-btn ps-btn--primary" disabled title="Coming soon" style="white-space:nowrap;">Sign in with GitHub</button>
</header>
<nav style="display:flex;justify-content:center;padding:0 var(--space-6);background:var(--surface);border-bottom:1px solid var(--line);">
  <div style="display:flex;gap:var(--space-6);max-width:var(--content-max);width:100%;">
    {links.map((l) => (
      <a class="mono" href={l.href} data-active={path === l.href} style="font-size:14px;color:var(--ink);text-decoration:none;padding:var(--space-3) 0;">{l.label}</a>
    ))}
  </div>
</nav>
```

- [ ] **Step 2: Write `src/components/EventCard.astro`**

```astro
---
interface Props { title: string; date: Date; location?: string; tag?: string; stroke?: string }
const { title, date, location, tag, stroke = 'var(--accent)' } = Astro.props;
const dateStr = new Intl.DateTimeFormat('en-AU', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(date);
---
<div class="ps-card" style={`border-top:3px solid ${stroke};gap:var(--space-3);`}>
  <div style="display:flex;align-items:center;justify-content:space-between;">
    {tag && <span class="ps-pill">{tag}</span>}
    {location && <span class="mono" style="font-size:11px;color:var(--ink-muted);">{location}</span>}
  </div>
  <div class="ps-card__title" style="font-size:var(--text-md);">{title}</div>
  <div class="mono" style="font-size:12px;color:var(--accent-text);">{dateStr}</div>
</div>
```

- [ ] **Step 3: Write the Home page pulling upcoming events**

```astro
---
// src/pages/index.astro
import Base from '../layouts/Base.astro';
import Header from '../components/Header.astro';
import EventCard from '../components/EventCard.astro';
import { getCollection } from 'astro:content';

const now = Date.now();
const upcoming = (await getCollection('events'))
  .filter((e) => e.data.date.getTime() >= now)
  .sort((a, b) => a.data.date.getTime() - b.data.date.getTime())
  .slice(0, 3);
---
<Base title="MQ Competitive Programming Club">
  <Header />
  <main style="max-width:var(--content-max);margin:0 auto;padding:var(--space-6) var(--space-6) var(--space-8);">
    <section style="display:flex;flex-direction:column;gap:var(--space-5);">
      <span class="ps-pill ps-pill--accent"><span class="ps-pill__dot"></span>ACM-ICPC PREP · ALL LEVELS WELCOME</span>
      <h1 style="font-family:var(--font-display);font-weight:500;font-size:clamp(34px,4.4vw,54px);line-height:1.04;color:var(--ink-strong);margin:0;">
        Solve hard problems<br /><span style="color:var(--accent-text);">together.</span>
      </h1>
      <p style="font-size:var(--text-md);max-width:46ch;color:var(--ink);margin:0;">
        A student-run club for ACM-ICPC and everyday practice. We hold weekly contests, work through a shared topic roadmap, and keep a team reference.
      </p>
    </section>

    <section style="margin-top:var(--space-8);">
      <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:var(--space-4);">
        <h2 class="ps-h2"><span class="mono" style="color:var(--accent-text);">&gt;</span> Upcoming Events</h2>
        <a class="mono" href="/events" style="font-size:13px;color:var(--accent-text);text-decoration:none;">view all events →</a>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);">
        {upcoming.map((e) => (
          <EventCard title={e.data.title} date={e.data.date} location={e.data.location} tag={e.data.tag} />
        ))}
      </div>
    </section>

    <section style="margin-top:var(--space-8);">
      <h2 class="ps-h2"><span class="mono" style="color:var(--accent-text);">&gt;</span> Explore the club</h2>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin-top:var(--space-4);">
        <a class="ps-card ps-card--c6" href="/learn"><div class="ps-card__title">Topic Roadmap</div><div class="ps-card__body">Ordered topics from two-pointers to flows.</div></a>
        <a class="ps-card ps-card--c2" href="/resources"><div class="ps-card__title">Team Reference</div><div class="ps-card__body">A printable algorithm library.</div></a>
        <a class="ps-card ps-card--c4" href="/events"><div class="ps-card__title">Events</div><div class="ps-card__body">Weekly practice and workshops.</div></a>
      </div>
    </section>
  </main>
</Base>
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: succeeds; `dist/index.html` contains "Solve hard problems" and the seeded event title "Week 1 Practice Contest".

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add header, event card, and home page"
```

---

### Task 6: Learn / roadmap page

**Files:**
- Create: `src/components/TopicCard.astro`, `src/pages/learn.astro`

**Interfaces:**
- Consumes: `topics` collection; `groupTopicsByLevel` from `src/lib/roadmap.ts`; `Base.astro`, `Header.astro`.
- Produces: `/learn` listing topics grouped by level, each linking to `/topics/<slug>`. `TopicCard.astro` props `{ href, name, blurb, total, stroke }`.

- [ ] **Step 1: Write `src/components/TopicCard.astro`**

```astro
---
interface Props { href: string; name: string; blurb: string; total: number; stroke: string }
const { href, name, blurb, total, stroke } = Astro.props;
---
<a href={href} style={`display:flex;flex-direction:column;gap:var(--space-3);background:var(--surface);border:1px solid var(--line);border-left:3px solid ${stroke};border-radius:var(--radius-lg);padding:var(--space-4);text-decoration:none;`}>
  <div style="display:flex;align-items:center;justify-content:space-between;">
    <span style="font-family:var(--font-display);font-weight:600;font-size:var(--text-md);color:var(--ink-strong);">{name}</span>
    <span class="mono" style={`font-size:11px;color:${stroke};`}>{total}q</span>
  </div>
  <div style="font-size:var(--text-sm);color:var(--ink-muted);min-height:2.6em;">{blurb}</div>
  <span class="mono" style="font-size:12px;color:var(--accent-text);margin-top:auto;">open topic →</span>
</a>
```

- [ ] **Step 2: Write `src/pages/learn.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Header from '../components/Header.astro';
import TopicCard from '../components/TopicCard.astro';
import { getCollection } from 'astro:content';
import { groupTopicsByLevel, type RoadmapTopic } from '../lib/roadmap';

const topicEntries = await getCollection('topics');
const problems = await getCollection('problems');
const countFor = (slug: string) => problems.filter((p) => p.data.topic.slug === slug).length;

const roadmap: RoadmapTopic[] = topicEntries.map((t) => ({
  slug: t.slug, name: t.data.name, level: t.data.level, order: t.data.order,
}));
const groups = groupTopicsByLevel(roadmap);
const meta = new Map(topicEntries.map((t) => [t.slug, t.data]));
const strokeOf = (slug: string) => `var(--${meta.get(slug)!.color})`;
const blurbOf = (slug: string) => meta.get(slug)!.blurb;
---
<Base title="Learn — MQ CP Club">
  <Header />
  <main style="max-width:var(--content-max);margin:0 auto;padding:var(--space-7) var(--space-6) var(--space-8);">
    <div class="mono" style="font-size:12px;color:var(--accent-text);">// LEARN</div>
    <h1 class="ps-h1" style="margin-top:8px;">Topics, in the order we suggest learning them.</h1>
    {groups.map((group) => (
      <div style="margin-bottom:var(--space-7);">
        <div class="mono" style="font-size:12px;color:var(--ink-muted);text-transform:uppercase;margin:var(--space-5) 0 var(--space-3);">{group.label}</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);">
          {group.items.map((t) => (
            <TopicCard href={`/topics/${t.slug}`} name={t.name} blurb={blurbOf(t.slug)} total={countFor(t.slug)} stroke={strokeOf(t.slug)} />
          ))}
        </div>
      </div>
    ))}
  </main>
</Base>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: succeeds; `dist/learn/index.html` contains "Graphs" under the "Intermediate" group and shows "1q".

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add learn/roadmap page"
```

---

### Task 7: Topic detail page (static)

**Files:**
- Create: `src/pages/topics/[slug].astro`

**Interfaces:**
- Consumes: `topics`, `problems` collections; `Base.astro`, `Header.astro`.
- Produces: a statically-generated page per topic via `getStaticPaths`, rendering the topic overview, video embeds, and a problem-set table (#, problem, difficulty, links). A `data-problem-id` attribute is placed on each problem row for the Plan 2 tracker to hook into; a `Status` column header exists with an inert placeholder cell in Plan 1.

- [ ] **Step 1: Write `src/pages/topics/[slug].astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import Header from '../../components/Header.astro';
import { getCollection, type CollectionEntry } from 'astro:content';

export async function getStaticPaths() {
  const topics = await getCollection('topics');
  const problems = await getCollection('problems');
  return topics.map((topic) => ({
    params: { slug: topic.slug },
    props: {
      topic,
      problems: problems
        .filter((p) => p.data.topic.slug === topic.slug)
        .sort((a, b) => a.data.order - b.data.order),
    },
  }));
}

interface Props { topic: CollectionEntry<'topics'>; problems: CollectionEntry<'problems'>[] }
const { topic, problems } = Astro.props as Props;
const { Content } = await topic.render();
const stroke = `var(--${topic.data.color})`;
const diffColor: Record<string, string> = { easy: 'var(--success)', medium: 'var(--warning)', hard: 'var(--danger)' };
---
<Base title={`${topic.data.name} — MQ CP Club`}>
  <Header />
  <main style="max-width:var(--content-max);margin:0 auto;padding:var(--space-6) var(--space-6) var(--space-8);">
    <a class="mono" href="/learn" style="font-size:13px;color:var(--ink-muted);text-decoration:none;">← Learn / Roadmap</a>
    <div style={`border-left:4px solid ${stroke};padding-left:var(--space-4);margin-top:var(--space-4);`}>
      <h1 class="ps-h1">{topic.data.name}</h1>
      <div style="color:var(--ink);margin-top:var(--space-3);"><Content /></div>
    </div>

    {topic.data.videos.length > 0 && (
      <>
        <h2 class="ps-h3" style="margin:var(--space-7) 0 var(--space-4);"><span class="mono" style="color:var(--accent-text);">&gt;</span> Tutorials</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-4);">
          {topic.data.videos.map((v) => (
            <div style="border:1px solid var(--line);border-radius:var(--radius-lg);overflow:hidden;background:var(--surface);">
              <div style="aspect-ratio:16/9;">
                <iframe width="100%" height="100%" style="border:0;display:block;" src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`} title={v.title} loading="lazy" allowfullscreen></iframe>
              </div>
              <div style="padding:var(--space-3) var(--space-4);">
                <div style="font-size:var(--text-sm);font-weight:600;color:var(--ink-strong);">{v.title}</div>
                <div class="mono" style="font-size:11px;color:var(--ink-muted);margin-top:3px;">YouTube{v.channel ? ` · ${v.channel}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </>
    )}

    <h2 class="ps-h3" style="margin:var(--space-7) 0 var(--space-4);"><span class="mono" style="color:var(--accent-text);">&gt;</span> Problem set</h2>
    <div style="border:1px solid var(--line);border-radius:var(--radius-lg);overflow:hidden;background:var(--surface);">
      <div class="mono" style="display:grid;grid-template-columns:36px 1fr 96px 168px 132px;gap:var(--space-3);padding:11px var(--space-4);background:var(--paper-sunk);border-bottom:1px solid var(--line);font-size:11px;color:var(--ink-muted);text-transform:uppercase;">
        <span>#</span><span>Problem</span><span>Difficulty</span><span>Links</span><span>Status</span>
      </div>
      {problems.map((p, i) => (
        <div data-problem-id={p.slug} style="display:grid;grid-template-columns:36px 1fr 96px 168px 132px;gap:var(--space-3);align-items:center;padding:12px var(--space-4);border-bottom:1px solid var(--line);">
          <span class="mono" style="color:var(--ink-muted);">{i + 1}</span>
          <span style="color:var(--ink-strong);">{p.data.title}</span>
          <span class="ps-pill" style={`color:${diffColor[p.data.difficulty]};border-color:transparent;`}>{p.data.difficulty}</span>
          <span class="mono" style="font-size:12px;display:flex;gap:12px;">
            <a href={p.data.url} target="_blank" rel="noopener" style="color:var(--accent-text);">{p.data.judge} →</a>
            <a href={`/problems/${p.slug}`} style="color:var(--ink-muted);">editorial</a>
          </span>
          <span class="mono" data-status-slot style="font-size:12px;color:var(--ink-muted);">— sign in —</span>
        </div>
      ))}
    </div>
  </main>
</Base>
```

- [ ] **Step 2: Verify build generates a page per topic**

Run: `npm run build`
Expected: succeeds; `dist/topics/graphs/index.html` exists, contains the embedded video iframe, and a problem row with `data-problem-id="graphs-bfs-shortest-path"`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add topic detail page with problem-set table"
```

---

### Task 8: Team-board parser (TDD) + Events page

**Files:**
- Create: `src/lib/team-board.ts`, `src/pages/events.astro`
- Test: `tests/team-board.test.ts`

**Interfaces:**
- Consumes: `src/data/team-board.json`; `events` collection; `Base.astro`, `Header.astro`, `EventCard.astro`.
- Produces: `parseTeamBoard(raw: unknown)` → `TeamEntry[]`, throwing a descriptive `Error` on malformed input. `type TeamEntry = { handle: string; name?: string; looking: string; contact: string }`.

- [ ] **Step 1: Write the failing test**

```ts
// tests/team-board.test.ts
import { describe, it, expect } from 'vitest';
import { parseTeamBoard } from '../src/lib/team-board';

describe('parseTeamBoard', () => {
  it('parses valid entries', () => {
    const out = parseTeamBoard({ entries: [{ handle: 'a', looking: '1 more', contact: 'dm' }] });
    expect(out).toEqual([{ handle: 'a', looking: '1 more', contact: 'dm' }]);
  });

  it('throws on a missing required field', () => {
    expect(() => parseTeamBoard({ entries: [{ handle: 'a' }] })).toThrow(/looking|contact/);
  });

  it('throws when entries is not an array', () => {
    expect(() => parseTeamBoard({ entries: 'nope' })).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/team-board.test.ts`
Expected: FAIL — cannot find module `../src/lib/team-board`.

- [ ] **Step 3: Write `src/lib/team-board.ts`**

```ts
import { z } from 'astro/zod';

const entrySchema = z.object({
  handle: z.string(),
  name: z.string().optional(),
  looking: z.string(),
  contact: z.string(),
});
const boardSchema = z.object({ entries: z.array(entrySchema) });

export type TeamEntry = z.infer<typeof entrySchema>;

export function parseTeamBoard(raw: unknown): TeamEntry[] {
  return boardSchema.parse(raw).entries;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/team-board.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Write `src/pages/events.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Header from '../components/Header.astro';
import EventCard from '../components/EventCard.astro';
import { getCollection } from 'astro:content';
import { parseTeamBoard } from '../lib/team-board';
import boardRaw from '../data/team-board.json';

const now = Date.now();
const all = (await getCollection('events')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
const upcoming = all.filter((e) => e.data.date.getTime() >= now).reverse();
const past = all.filter((e) => e.data.date.getTime() < now);
const team = parseTeamBoard(boardRaw);
const repoUrl = 'https://github.com/sutantyo/mq-cpc-app';
---
<Base title="Events — MQ CP Club">
  <Header />
  <main style="max-width:var(--content-max);margin:0 auto;padding:var(--space-7) var(--space-6) var(--space-8);">
    <div class="mono" style="font-size:12px;color:var(--accent-text);">// EVENTS</div>
    <h1 class="ps-h1" style="margin-top:8px;">What's on</h1>

    <h2 class="ps-h2" style="margin:var(--space-6) 0 var(--space-4);"><span class="mono" style="color:var(--accent-text);">&gt;</span> Upcoming</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);">
      {upcoming.length === 0 && <p class="mono" style="color:var(--ink-muted);">Nothing scheduled right now.</p>}
      {upcoming.map((e) => <EventCard title={e.data.title} date={e.data.date} location={e.data.location} tag={e.data.tag} />)}
    </div>

    {past.length > 0 && (
      <>
        <h2 class="ps-h2" style="margin:var(--space-7) 0 var(--space-4);"><span class="mono" style="color:var(--accent-text);">&gt;</span> Past</h2>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);">
          {past.map((e) => <EventCard title={e.data.title} date={e.data.date} location={e.data.location} tag={e.data.tag} stroke="var(--line-strong)" />)}
        </div>
      </>
    )}

    <h2 class="ps-h2" style="margin:var(--space-7) 0 var(--space-4);"><span class="mono" style="color:var(--accent-text);">&gt;</span> Looking for a team</h2>
    <p style="color:var(--ink);max-width:60ch;">The board is just a JSON file in the club repo — no logins, no server. Add an entry, open a PR, and you'll appear here once it's merged.</p>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--space-4);margin-top:var(--space-4);">
      {team.map((t) => (
        <div class="ps-card" style="gap:var(--space-2);">
          <div class="ps-card__title">{t.name ?? t.handle} <span class="mono" style="font-size:12px;color:var(--ink-muted);">@{t.handle}</span></div>
          <div style="color:var(--ink);font-size:var(--text-sm);">{t.looking}</div>
          <div class="mono" style="font-size:12px;color:var(--accent-text);">{t.contact}</div>
        </div>
      ))}
    </div>
    <a class="ps-btn ps-btn--primary" href={`${repoUrl}/edit/main/src/data/team-board.json`} target="_blank" rel="noopener" style="margin-top:var(--space-4);display:inline-block;">Add yourself with a pull request →</a>
  </main>
</Base>
```

- [ ] **Step 6: Verify build and tests**

Run: `npm test`
Expected: PASS (roadmap + team-board suites).

Run: `npm run build`
Expected: succeeds; `dist/events/index.html` contains "Week 1 Practice Contest" and the team-board entry "octofox".

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add team-board parser and events page"
```

---

### Task 9: Resources + Team Reference page (with print)

**Files:**
- Create: `src/pages/resources.astro`

**Interfaces:**
- Consumes: `resources`, `reference` collections; `Base.astro`, `Header.astro`.
- Produces: `/resources` rendering curated links grouped by category, plus the team-reference notebook (snippets grouped by `category`, ordered by `order`) with a "Print / PDF" button that calls `window.print()`.

- [ ] **Step 1: Write `src/pages/resources.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Header from '../components/Header.astro';
import { getCollection } from 'astro:content';

const linkGroups = (await getCollection('resources')).sort((a, b) => a.data.order - b.data.order);
const snippets = (await getCollection('reference')).sort((a, b) => a.data.order - b.data.order);
const byCategory = new Map<string, typeof snippets>();
for (const s of snippets) {
  const arr = byCategory.get(s.data.category) ?? [];
  arr.push(s);
  byCategory.set(s.data.category, arr);
}
const rendered = await Promise.all(snippets.map(async (s) => ({ slug: s.slug, Content: (await s.render()).Content })));
const contentBySlug = new Map(rendered.map((r) => [r.slug, r.Content]));
---
<Base title="Resources — MQ CP Club">
  <Header />
  <main style="max-width:var(--content-max);margin:0 auto;padding:var(--space-7) var(--space-6) var(--space-8);">
    <div class="mono" style="font-size:12px;color:var(--accent-text);">// RESOURCES</div>
    <h1 class="ps-h1" style="margin-top:8px;">Resources &amp; team reference</h1>

    <h2 class="ps-h2" style="margin:var(--space-6) 0 var(--space-4);"><span class="mono" style="color:var(--accent-text);">&gt;</span> Curated links</h2>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--space-4);">
      {linkGroups.map((g) => (
        <div class="ps-card" style="gap:var(--space-3);">
          <div class="ps-card__title">{g.data.category}</div>
          {g.data.links.map((l) => (
            <a href={l.url} target="_blank" rel="noopener" class="mono" style="font-size:13px;color:var(--accent-text);text-decoration:none;display:block;">{l.label} →</a>
          ))}
        </div>
      ))}
    </div>

    <div style="display:flex;align-items:baseline;justify-content:space-between;margin:var(--space-7) 0 var(--space-4);">
      <h2 class="ps-h2"><span class="mono" style="color:var(--accent-text);">&gt;</span> Team reference notebook</h2>
      <button class="ps-btn ps-btn--sm" onclick="window.print()">⎙ Print / PDF</button>
    </div>
    {[...byCategory.entries()].map(([cat, items]) => (
      <section style="margin-bottom:var(--space-6);">
        <div class="mono" style="font-size:12px;color:var(--ink-muted);text-transform:uppercase;margin-bottom:var(--space-3);">{cat}</div>
        {items.map((s) => {
          const C = contentBySlug.get(s.slug)!;
          return (
            <div style="margin-bottom:var(--space-4);">
              <div class="mono" style="font-size:13px;color:var(--ink-strong);margin-bottom:6px;">{s.data.title} · {s.data.category}</div>
              <div class="mqcp-code"><C /></div>
            </div>
          );
        })}
      </section>
    ))}
  </main>
</Base>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds; `dist/resources/index.html` contains "CP-Algorithms", "Dijkstra", and the `void dijkstra` code.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add resources and team-reference page"
```

---

### Task 10: Tools page (external links)

**Files:**
- Create: `src/pages/tools.astro`, `src/content/resources/tools.json` (reuse resources collection? No — see step) OR a small inline list.

**Interfaces:**
- Consumes: `Base.astro`, `Header.astro`.
- Produces: `/tools` — a static list of member-built tools, each an external GitHub repo link, plus a "coming soon" note for the Graph Visualiser. No embedded apps.

- [ ] **Step 1: Write `src/pages/tools.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Header from '../components/Header.astro';

const tools: { name: string; blurb: string; url?: string; soon?: boolean }[] = [
  { name: 'Graph Visualiser', blurb: 'Sketch a graph, then run BFS, DFS, or Dijkstra step by step.', soon: true },
];
---
<Base title="Tools — MQ CP Club">
  <Header />
  <main style="max-width:var(--content-max);margin:0 auto;padding:var(--space-7) var(--space-6) var(--space-8);">
    <div class="mono" style="font-size:12px;color:var(--accent-text);">// TOOLS</div>
    <h1 class="ps-h1" style="margin-top:8px;">Tools built by members.</h1>
    <p style="color:var(--ink);max-width:60ch;">Small client-side utilities we use in workshops and while practising. Each lives in its own repo.</p>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin-top:var(--space-6);">
      {tools.map((t) => (
        <div class="ps-card" style="gap:var(--space-2);">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div class="ps-card__title">{t.name}</div>
            {t.soon && <span class="ps-pill">soon</span>}
          </div>
          <div class="ps-card__body">{t.blurb}</div>
          {t.url
            ? <a class="mono" href={t.url} target="_blank" rel="noopener" style="font-size:12px;color:var(--accent-text);margin-top:auto;">open repo →</a>
            : <span class="mono" style="font-size:12px;color:var(--ink-muted);margin-top:auto;">coming soon</span>}
        </div>
      ))}
    </div>
  </main>
</Base>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds; `dist/tools/index.html` contains "Graph Visualiser" and "soon".

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add tools page"
```

---

### Task 11: Deploy to Cloudflare Pages

**Files:**
- Create: `docs/DEPLOY.md`
- Modify: `README.md` (create if absent) with local-dev + deploy notes

**Interfaces:**
- Consumes: the whole build.
- Produces: a live site on Cloudflare Pages, auto-building on push to `main`.

- [ ] **Step 1: Confirm the production build is clean**

Run: `npm run build && npm test`
Expected: build succeeds, all tests pass.

- [ ] **Step 2: Write `docs/DEPLOY.md`** with these exact Cloudflare Pages settings

```md
# Deploy — Cloudflare Pages

The site auto-deploys from the private GitHub repo. No server; output is static.

## One-time setup (an org owner does this)
1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
2. Authorise Cloudflare for the `sutantyo/mq-cpc-app` repo.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: set env var `NODE_VERSION = 20`
4. Save & Deploy.

## Ongoing
- Every push to `main` triggers a build and deploy.
- Pull requests get a preview deployment URL automatically.
```

- [ ] **Step 3: Perform the Cloudflare Pages connection**

This is a dashboard action (no CLI required). Follow `docs/DEPLOY.md` steps 1–4. If you have `wrangler` and prefer CLI, that is optional and not required.
Expected: first deploy succeeds; the `*.pages.dev` URL serves the Home page.

- [ ] **Step 4: Update `astro.config.mjs` `site`** to the real Pages URL if it differs from the placeholder, then commit.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "docs: add Cloudflare Pages deploy instructions"
```

---

## Self-Review

**Spec coverage (against `2026-06-30-mqacm-site-design.md`):**
- Static, backend-free architecture → Tasks 1, 11 (Astro static output, Cloudflare Pages). ✓
- Durable content as Markdown/JSON in repo → Task 3 (content collections). ✓
- Problem-ID scheme (entry slug) → Global Constraints + Task 3 + `data-problem-id` in Task 7. ✓
- Pages: Home (5), Learn (6), Topic detail (7), Events + team-board (8), Resources + Team Reference (9), Tools (10). ✓
- Visual identity: fonts + pastel/indigo themes + design tokens → Task 2. ✓
- **My Dashboard, personal tracker, auth, gist storage, sanitized-Markdown-for-notes → deferred to Plan 2** (explicitly out of scope here; the topic table exposes `data-problem-id` and an inert status slot as the Plan 2 hook). ✓
- Security (JSON-not-HTML, DOMPurify, PR review) → primarily a Plan 2 concern (tracker data); Plan 1 renders only trusted repo content through Astro's escaping. ✓
- Succession (GitHub org) → operational, documented in DEPLOY/spec; no code task. ✓

**Placeholder scan:** No "TBD"/"implement later" in code steps; every code step shows complete code. The only "coming soon" strings are intentional UI copy (Tools page), matching the spec.

**Type consistency:** `RoadmapTopic`/`RoadmapGroup` (Task 4) used consistently in Task 6. `TeamEntry`/`parseTeamBoard` (Task 8) used in the events page. `EventCard` props consistent across Tasks 5 and 8. `data-problem-id` = entry slug consistent between Task 7 and the Global Constraints ID scheme.

**Note for Plan 2 (tracker):** will add auth (token-paste, `gist` scope), a gist JSON client, progress computation, per-problem status/notes islands hooking onto `[data-problem-id]`/`[data-status-slot]`, the My Dashboard page, and DOMPurify-sanitized note rendering.
