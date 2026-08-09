---
name: add-problem
description: Use when adding a Kattis problem to this site, or when filling in the title, difficulty, order or tags of a file in src/content/problems/. Triggers on a bare Kattis problem id plus a topic ("add freefood to java-basics", "add sottkvi and barcelona to getting-started under problems").
---

# Add a Kattis problem

Creates one `src/content/problems/<kattis-id>.md` per problem, with the title and
difficulty read from Kattis rather than guessed. **This is a "no false
information" project: never invent a title or a difficulty. If the fetch fails,
stop and say so.**

## Input

`<kattis-id> [topic] [section]`, one or more ids. The id is the last segment of
the problem URL — `open.kattis.com/problems/freefood` → `freefood`.

- **topic** — a file name in `src/content/topics/` (`java-basics`, not "Java Basics"). Ask if not given.
- **section** — optional. Omitted, the problem places itself: with a video into the topic's **first** section, without one into its **last**. Say which one it landed in.

## Steps

**1. Fetch the problem page.** WebFetch gets **403** from Kattis; curl with a
browser User-Agent gets 200. A wrong id 404s — stop, do not write a file.

```bash
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
html=$(curl -s -A "$UA" "https://open.kattis.com/problems/$id")
```

**2. Title** — from the `<h1>`, entities decoded, copied exactly:

```bash
printf '%s' "$html" | grep -o '<h1[^>]*>[^<]*</h1>' | head -1 | sed 's|<[^>]*>||g' \
  | sed 's/&amp;/\&/g; s/&ndash;/–/g; s/&#8217;/’/g; s/&quot;/"/g'
```

**3. Difficulty** — Kattis's own band, as a CSS class. Match the band words
only: a bare `difficulty_[a-z]*` hits `difficulty_number` first. The numeric
rating is not in the served HTML, so it cannot be recorded.

```bash
printf '%s' "$html" | grep -o 'difficulty_\(easy\|medium\|hard\)' | head -1 | sed 's/difficulty_//'
```

**4. Validate the placement.** The topic file must exist. Read its section ids;
a section that the topic does not declare **fails the build**, so check first and
stop with the valid ids listed rather than writing a file that breaks `main`.

```bash
grep -A1 '^\s*- id:' src/content/topics/<topic>.md   # declared sections
```

A topic declaring no `sections:` gets the default `tutorials` / `extra` split.

**5. `order`** — one past the highest in that topic (it sorts within a section):

```bash
grep -l '^topic: <topic>' src/content/problems/*.md | xargs grep -h '^order:' \
  | sed 's/order: *//' | sort -n | tail -1
```

**6. Tags** — ours, not Kattis's; they become the filter chips. Read the
statement, propose one or two, and **prefer vocabulary already used on that
topic** so the chip row doesn't sprout near-duplicates (`arrays` vs `array`).
Show the proposal with the topic's existing tags and get a yes before writing.

```bash
grep -l '^topic: <topic>' src/content/problems/*.md | xargs grep -h '^tags:' | sort -u
```

**7. Write the file**, named after the Kattis id, fields in this order. Body
empty — notes are written by hand later, and `videos:` is added only when a
walkthrough exists.

```markdown
---
topic: java-basics
title: "Free Food"
difficulty: easy
judge: Kattis
url: https://open.kattis.com/problems/freefood
section: arrays
order: 11
tags: ["arrays"]
---
```

Omit `section:` when the automatic placement is what you want.

**8. Verify, then stop.** `npm run build` is what proves the section id resolves;
`npm test` guards the placement rules.

```bash
npm run build && npm test
```

Report title, difficulty, topic § section, order, tags and path. **Do not commit,
branch or push** — that is the user's call.

## Quick reference

| Field | Source |
|---|---|
| `title` | Kattis `<h1>`, exact |
| `difficulty` | Kattis `difficulty_easy\|medium\|hard` class |
| `judge`, `url` | `Kattis`, the problem URL |
| `order` | max in topic + 1 |
| `section` | user, or omitted for automatic placement |
| `tags` | proposed from the topic's existing tags, confirmed |
| body, `videos` | left empty |

## Common mistakes

| Mistake | Consequence |
|---|---|
| Using WebFetch on Kattis | 403; use curl with a User-Agent |
| Guessing a title from the id | Wrong titles ship — `1dfroggereasy` is "1-D Frogger (Easy)" |
| `grep -o 'difficulty_[a-z]*'` | Matches `difficulty_number`, not the band |
| Writing before checking the section id | Build fails; the page is broken until fixed |
| Overwriting an existing file | Stop instead — an id already in `src/content/problems/` means it's already listed |
| Assuming a non-Kattis judge works | CodingBat and friends fit the schema but not this skill; those need `problemId:` set by hand |

Kattis's band is authoritative here even when it disagrees with an older file:
`walrusweights` is recorded `easy` but Kattis calls it `medium`.
