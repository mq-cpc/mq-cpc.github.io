# MQ Competitive Programming Club — Website Design Spec (v1)

**Status:** Approved design, ready for implementation planning
**Date:** 2026-06-30
**Owner:** Daniel Sutantyo

## 1. Purpose

A website for the Macquarie University ACM-ICPC / competitive-programming club. It serves three audiences and goals at once:

1. **A learning hub** — an ordered topic roadmap, curated problem sets with solutions/discussion, tutorial videos, and a printable team-reference notebook, for ACM-ICPC prep and general coding practice.
2. **A personal practice tracker** — each signed-in student tracks their own problem progress (Todo / Attempted / Solved) and private notes.
3. **A durable record of the society** — because the club waxes and wanes year to year, the site and its content must survive long periods with no maintainer, no budget, and no active committee.

Target audience: university students, from complete beginners to serious ICPC competitors.

## 2. Guiding constraints

These constraints drove every architectural decision and must be preserved:

- **Survives neglect.** Must cost $0 to keep running and require near-zero upkeep. Maintainers come and go; nothing should silently expire or rot during a quiet year.
- **No club-operated server or database.** Anything the club must "keep running" is a liability. The club operates no backend.
- **The permanent record is plain files.** The archive must be readable and recoverable even if the website itself is gone — i.e. it is just text in a Git repository.
- **Students own their own data.** Personal progress is not centralised; each student's data lives in their own account.

## 3. Architecture overview

A **100% static website** with **no club-operated backend**. Three storage planes, each with a different lifespan:

| Plane | Lives in | Lifespan | Holds |
|---|---|---|---|
| Durable content (the archive) | Files in the club's **GitHub repo** | Immortal | Topics, problems, solutions, events, team-reference notebook, resources, team-finder board |
| Personal data | Each student's own **private GitHub gist** | Owned by the student | Per-problem status + private notes |
| Club identity / membership | A **GitHub organization** | Outlives any cohort (multiple owners) | Repo ownership, member list, succession |

- **Hosting:** static host on a free tier (GitHub Pages or Cloudflare Pages), built from the repo. No runtime service to maintain.
- **Why this survives neglect:** the only "live" dependency is GitHub itself (OAuth/API + static hosting), which GitHub runs for free indefinitely. If sign-in ever breaks (e.g. a future committee deletes the OAuth app), the entire archive is unaffected because it is static files in Git. The tracker is the only feature that depends on a live API, and it degrades gracefully (content still fully browsable when signed out).

## 4. Authentication & access model

- **Sign in with GitHub.** The natural fit: the audience already has GitHub accounts, it is per-user (no university tenant / admin-consent gatekeeper, which rules out Microsoft 365 SSO complications), and it doubles as the membership system.
- **Token scope: `gist` only.** The app can read/write the student's gists and nothing else. The club never sees the student's code or token.
- **All content is public.** Signing in unlocks *only* the personal tracker (status toggles, notes, dashboard). There is no gated content — this matches the public-archive goal and the reality that static content cannot be truly gated without a backend.
- **Membership is a soft, cosmetic concept.** A "✓ member" badge derives from GitHub org membership and/or a roster file. It is not a security boundary and grants no access — there is nothing to protect, since each student only ever reads their own gist. Open use by non-members is fine and costs the club nothing.
- **Auth mechanism (token-paste vs. proxy)** is an implementation detail, not a design decision. Default preference: **paste a fine-grained Personal Access Token** (scoped to gists), stored in the browser, so the site stays purely static with no proxy/secret. The alternative (a tiny free serverless OAuth proxy for a one-click button) introduces a live component and is therefore disfavoured given the longevity constraint. The decision is deferred to implementation; either way the design is unchanged.

## 5. Data model

### 5.1 Durable content (in the club repo)

Authored by organizers via pull requests (the GitHub web editor is sufficient; no local tooling required). Exact file layout to be finalised in the implementation plan, but the content entities are:

- **Topics** — the 12-topic roadmap, each with: name, level/group, ordering, blurb, category color, and links to its problems, tutorial videos, and editorials.
- **Problems** — per topic: title, difficulty, tags, external judge link (Kattis / Codeforces / etc.), and a link to a solution/editorial writeup. Problems are referenced by a **stable ID** (used as the key in the student's gist).
- **Editorials / solution writeups** — Markdown.
- **Tutorial videos** — YouTube embeds attached to topics.
- **Events** — upcoming and past; each with title, date, location, tag/type. Past events accumulate into the archive automatically.
- **Team-finder board** — a JSON file (e.g. `data/team-board.json`); students add themselves via PR. No logins, no server.
- **Team Reference notebook** — categorized, syntax-highlighted code snippets (graphs, math, strings, geometry, …) with a print/PDF view.
- **Resources** — curated, categorized external links.
- **Roster** (optional/cosmetic) — members by cohort; doubles as a durable historical record.

Content format: Markdown for prose, structured data (JSON/YAML/front-matter) for lists. To be pinned down in the plan; the principle is *structured + human-editable + diffable*.

### 5.2 Personal data (in the student's gist)

- One private gist per student, holding a **JSON document**.
- Schema (indicative): a map keyed by stable problem ID → `{ status: "todo" | "attempted" | "solved", note: string, updatedAt: timestamp }`, plus a small metadata header (schema version).
- All personal stats are **derived from this single document** (solved count, per-topic progress, "this week", day-streak — using the per-entry timestamps).
- The app reads/writes this gist directly from the browser via the GitHub REST API (which supports CORS for token-authenticated requests).

## 6. Pages (v1 scope)

1. **Home** — hero ("Solve hard problems together"), a code/terminal/roadmap visual, upcoming-events strip, a featured item, and "explore the club" cards.
2. **Learn (Roadmap)** — the 12 topics, grouped by level, each card showing the student's solved ratio when signed in. "Getting Started Guide" and "Cheat Sheets" appear as *soon* placeholders.
3. **Topic detail** — topic blurb, tutorial-video embeds, and a **problem-set table** (#, problem, difficulty, links, status). Per-problem Todo/Attempted/Solved toggle + a private notes field appear for signed-in users; signed-out users see a "sign in to track" prompt.
4. **My Dashboard** — personal stats only: solved count, this-week, day-streak, **per-topic progress bars**, recently-solved, pinned note. **No leaderboard / club rank** (would require shared data, which the architecture forbids). Signed-out users see a "your tracker lives in your gist" explainer + sign-in CTA.
5. **Events** — what's on + a **team-finder board** (the PR'd JSON file), with a short "new to git?" guide for first-time contributors.
6. **Tools** — a list of **links to external GitHub repos** for member-built tools (e.g. a future Graph Visualiser). No embedded apps in v1.
7. **Resources** — curated links + the **Team Reference notebook** with print/PDF.

## 7. Visual identity

- **Type:** Libre Franklin (display) + JetBrains Mono (labels/code accents).
- **Themes:** light "pastel" and dark "indigo" (#191970 base with pastel-neon accents), with a toggle.
- **Source of truth:** the tokens (colors, spacing, typography) and components from the approved Claude Design project "Macquarie ICPC coding club" (`96a30750-d07d-413b-92a0-4af8d1c6caf9`). The implementation should reuse those design tokens/components rather than reinventing the visual language.
- Responsive / mobile-friendly. Comfortable dark mode.

## 8. Security & data integrity

- **Stored tracker data is JSON, never HTML.** Rendered via escaping / `textContent` / framework auto-escaping — never `innerHTML` on raw data.
- **Any Markdown** (e.g. personal notes, editorials) is rendered through a sanitizer (DOMPurify) + a safe Markdown renderer.
- **Club-authored content** is gated by **PR review** by trusted organizers.
- **No cross-user data flow:** a student can only ever read their *own* gist, so stored-XSS-affecting-others is structurally impossible; the worst case is a user sabotaging their own page. The `gist`-only token scope caps blast radius further.

## 9. Succession & longevity (operational)

- The **GitHub org with multiple owners** is the durable institution. Each cohort adds the next cohort's organizers as owners before graduating — ownership transfers cleanly without any single person being a point of failure.
- The archive (all durable content) is plain files in Git: recoverable, forkable, and readable even if hosting lapses.
- During dormant years nothing runs and nothing is billed; reviving the club requires no recovery of lost data.

## 10. Explicitly out of scope for v1 (deferred)

- **Interactive Tools** (e.g. Graph Visualiser) — each becomes its own repo, linked from the Tools page.
- **Opt-in public leaderboard** — would require members to publish their progress and a scheduled GitHub Action to aggregate public gists into a `leaderboard.json`. Feasible later without a server, but real added complexity.
- **Meta / longevity timeline pages** (the narrative history of the society).
- **Contest results archive & hall-of-fame** — desirable later; accumulate as content over time.
- **Getting Started Guide & Cheat Sheets** — shown as "soon" placeholders in v1.

## 11. Open questions for the implementation plan

- Static site generator / framework choice (must produce a purely static bundle; should make Markdown/JSON content authoring and the GitHub-API tracker logic clean).
- Final repo content file layout and the exact problem-ID scheme (the ID is the contract between repo content and the gist).
- Final decision on auth mechanism (token-paste vs. serverless proxy) — defaulting to token-paste.
- Gist JSON schema versioning/migration approach.
