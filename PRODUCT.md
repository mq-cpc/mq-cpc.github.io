# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: newcomers deciding and starting.** Someone who has encountered the club — a poster, a unit announcement, word of mouth — is working out whether competitive programming is for them, and needs a concrete first step. They arrive knowing little; "ICPC" and "Kattis" are not yet words they own.

**Equally load-bearing: active members training.** Someone already in the club returning across a semester to work the roadmap, watch the next video, and grind problems. They arrive knowing exactly what they want.

Newcomers come first when the two conflict, but never at the returning member's expense — the site has to convert a stranger and then serve them for months.

## Product Purpose

The club's **durable public front door**: the permanent, linkable, indexed record of what the club is, what's on, and how to start.

It exists because Discord scrolls away and shared documents rot. Success is that a stranger can understand the club and take a first step without asking anyone, and a member can return in three months and still find what's on and what to learn next — at a stable URL, without having to scroll a chat history.

## Positioning

Permanence and addressability. Any club can run a Discord; this is the artifact that survives committee turnover, semester breaks, and the loss of whoever was answering questions last year. Content is versioned in the same repository as the site, so the record and its history are the same object.

## Operating Context

- **Content is edited by pull request.** No admin UI, no database. Contributors edit Markdown/JSON in the repo; a committee member reviews and merges.
- The GitHub repo is currently **private to the `mq-cpc` org**, so contribute links 404 for anyone a committee member has not added. (Current state, not a stated permanent commitment.)
- Auto-deploys to **Cloudflare Pages** on push to `main`; pull requests receive preview URLs. See `docs/DEPLOY.md`.
- Two remotes: `org` = `mq-cpc/web-app` (canonical, PRs target its `main`), `origin` = personal fork.
- Students practise on **Kattis** as the online judge. The contest the club trains for is the **ICPC** — teams of three sharing one machine for five hours, running from regional qualifiers to World Finals.
- Team formation happens through the board on the Events page, also by pull request.

## Capabilities and Constraints

**Durable constraints (user-confirmed):**

- **No backend for content, contributions stay pull requests.** The static / no-database model is a deliberate long-term choice, not a stopgap.
- **Auth and per-user progress tracking are genuinely planned**, not built. Sign-in markup is deliberately commented out in `src/components/Header.astro` and `src/pages/index.astro`. The problem-table "Status" column was removed on 2026-08-02 because it read `— sign in —` with no way to sign in; it is expected to return once auth ships.

These two sit in tension and future work should treat it as a known seam, not an inconsistency to resolve unilaterally: *content* stays static and PR-based while *identity* is a separate planned capability. An `api/` directory exists at the repo root with Hono installed and no source yet — scaffolding consistent with a small edge function for auth.

**Technical:**

- Astro 7, `output: 'static'`. Node ≥ 22.12 required; dev pinned to 26 via `.nvmrc`. Tailwind v4 via `@tailwindcss/vite`.
- Content collections: `topics`, `problems`, `events`, `resources`, `reference`; plus `src/data/team-board.json`.
- Client-side tools run entirely in the browser; the graph visualiser vendors its own d3 and makes no network calls.

**Terminology (use these words, consistently):** topic, problem, roadmap, team board, committee member, judge (Kattis), ICPC.

**Explicitly undecided — do not invent an answer:**

- No accessibility standard has been established for this project. The light theme currently fails WCAG AA on several text tokens (see the 2026-08-02 audit); until a standard is set, those are quality problems, not compliance obligations.
- `astro.config.mjs` `site:` is still the placeholder `https://web-app.pages.dev`, pending the real Cloudflare Pages project URL.

## Brand Commitments

- Name: **MQ Competitive Programming Club**. Short form in page titles: *MQ CP Club*.
- Voice, as evidenced consistently in the shipped copy rather than separately confirmed: **approachable rigour**. Serious contest preparation that stays beginner-kind — "all levels welcome" appears on the hero, the events, and the Getting Started topic. Never edgy, never intimidating, never assuming prior knowledge.
- The wordmark subtitle currently reads `acm.icpc · macquarie`. ICPC dropped ACM sponsorship in 2018; this is flagged as inaccurate and unresolved.

## Evidence on Hand

**Real content that exists today:**

- 5 roadmap topics (`src/content/topics/`): Getting Started, Java Basics, C++ Basics, Recursion & Backtracking, Dynamic Programming.
- 22 Kattis problems (`src/content/problems/`), distributed 13 / 4 / 3 / 2 across Java Basics, C++, Dynamic Programming, Recursion. Getting Started has none by design.
- **~25 tutorial videos, all recorded by Daniel Sutantyo**, embedded by YouTube ID across the topics. These are the club's own teaching material, not curated third-party links — the single most distinctive asset on the site.
- 1 team-reference notebook snippet (Dijkstra), 1 tool (graph visualiser), 2 events.

**Absences that future work must not fabricate:**

- **No membership count and no founding year.** Placeholder values (`127 members`, `running since 2021`) were removed on 2026-08-02 and must not be reintroduced without real figures.
- No testimonials, sponsors, partners, alumni outcomes, or contest placements.
- The team board is **empty on purpose** — a fabricated sample entry was removed. It stays empty until real members add themselves.

## Product Principles

1. **Newcomer first, member second — but never at the member's expense.** A stranger must be able to start without asking anyone; a returning member must not have to wade through onboarding to reach the roadmap.
2. **Nothing on the site may be unverifiable.** Every claim must be checkable against content in the repo. A visitor is always one click from disproving a number.
3. **Permanence over freshness.** Stable URLs and content that still makes sense after a semester break outrank anything that needs constant tending.
4. **Contribution stays a pull request.** Lowering the barrier means better docs and clearer file layout, not an admin UI.
5. **Thin is honest.** When a section has one item, say so plainly and show the way to add more. Never dress emptiness up as abundance.
