# Contribute becomes a website guide; the board and events keep their own instructions

**Date:** 2026-08-09 · **Branch:** `pages-refactor`

## Problem

`/contribute` taught two unrelated things under one heading: how to put yourself
on the team board, and how to change the site. Adding yourself to a board is not
contributing to the website — it is using the club — so a reader who wanted one
had to scroll past the other, and `/events` linked *away* to Contribute to
explain its own board.

## Design

Each page owns the instructions for the thing it is about, and the pull-request
mechanics — the only genuinely shared part — are written once.

### `/contribute` — how to change the site

Keeps the `// CONTRIBUTE` eyebrow and the "How to contribute" h1. The intro no
longer offers "two ways to pitch in"; it scopes the page to the website.

1. **How a pull request works here** (`#pull-request`) — the shared mechanics,
   generalised away from the team board: prerequisites, four steps through
   GitHub's web editor, and the command-line variant. This is the anchor
   `/events` links to.
2. **Where things live** — the file map, unchanged, now full width.
3. **Add a problem** (`#add-a-problem`) — unchanged, including *Which section it
   lands under* and *Adding a new section*.
4. **Running it locally** — `npm install` / `npm run dev`, plus a pointer back to
   Events for teammates and sessions.

### `/events` — what's on, and how to add to it

1. **Looking for a team** (`#looking-for-a-team`) — board cards as before, then a
   compact how-to: the PR button, the `handle` / `name` / `looking` / `contact`
   glossary, and a link to `/contribute#pull-request`. The block sits **outside**
   the empty/filled branch, because an empty board is exactly when a reader needs
   telling how to fill it — previously the explanation rendered only when the
   board already had entries.
2. **Post an event** (`#post-an-event`) — new. What an event file is, a sample
   with placeholder values, a button to GitHub's new-file form prefilled with
   `src/content/events/new-event.md`, the field glossary from
   `content.config.ts`, and the same mechanics link.

### `/` — the third card

`Events` becomes **Looking for a team**, same `c2` hue, pointing at
`/events#looking-for-a-team`. The home page already lists upcoming events
directly above that grid, so the card was a second link to a page already on
screen; the board had no entry point at all. Events stays reachable from the
header, the footer and the 404 page.

### Inbound links

- `events.astro` — "New here? How to add yourself →" is replaced by the
  mechanics link; nothing points at Contribute for board instructions.
- `404.astro` — the Contribute note drops "or add yourself".
- `resources.astro`, `tools.astro` — "how to contribute →" stays accurate.

## Verification

Build; assert each of the four anchor targets exists in the built HTML and that
the two cross-page links resolve to them; confirm Contribute no longer contains
board copy and Events does; screenshot all three pages and check for horizontal
overflow.

## Out of scope

Renaming the page or its nav label (the h1 stays "How to contribute" for now),
how-tos for adding a topic or a notebook snippet, and the team-board JSON itself.
