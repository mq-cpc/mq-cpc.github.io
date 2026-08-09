# Topic pages: author-defined problem sections

**Date:** 2026-08-09 · **Branch:** `topic-page-refactor`

## Problem

A topic page renders every problem in one hard-coded `Problems` list, under one
hard-coded intro paragraph ("You can tick off the problems as you solve
them…"), with a `No notes yet.` placeholder inside any problem that has no
notes.

Three things are wrong with that:

1. Problems with a video walkthrough and problems without are presented
   identically, even though they ask different things of the reader.
2. The intro copy is the same on every topic. It should be per-topic — the
   tick-off sentence belongs on Getting Started and nowhere else.
3. `No notes yet.` is noise. An absent note should be absent.

## Design

A topic declares its own sections in front-matter. Each section is a heading, an
optional markdown intro, and a list of problems.

### Schema (`src/content.config.ts`)

```ts
const SECTION = z.object({
  id: z.string(),                 // anchor, and what a problem references
  title: z.string(),
  intro: z.string().optional(),   // markdown
});

// topics:   sections: z.array(SECTION).default([])   — empty means "use defaults"
// problems: section:  z.string().optional()          — overrides the automatic rule
```

### Grouping (`src/lib/topic-sections.ts`)

Pure functions, unit-tested, no Astro imports.

- `sectionsFor(declared)` — returns `declared` when non-empty, else
  `DEFAULT_SECTIONS`:

  ```
  [{ id: 'tutorials', title: 'Video Tutorials' },
   { id: 'extra',     title: 'Additional Problems' }]
  ```

  Throws on duplicate section ids.

- `groupProblems(sections, problems, topicId)` — assigns each problem and drops
  empty sections. Assignment, in order:
  1. `section:` set on the problem → that section. An id no section declares
     **throws**, failing the build with the problem id, the topic, and the valid
     ids (the same treatment a bad `refcategories` reference gets).
  2. Otherwise: the problem has a video → **first** section; no video → **last**
     section. With one declared section, first and last coincide, so everything
     lands there.

  Order within a section stays `order` then id — unchanged.

Consequences worth stating: every existing topic and problem file keeps working
untouched, and because all 23 current problems have a video, every topic renders
only *Video Tutorials* until a video-less problem is added.

### Page (`src/pages/topics/[slug].astro`)

- The single `Problems` block becomes a loop over non-empty sections. Each is a
  `<section class="mq-psection">` holding `<h2 id={section.id}>`, the intro, and
  that section's list.
- `intro` is rendered with `marked` at build time (`marked` is a `dependency`;
  it runs only during the build, nothing ships to the browser).
- No copy is appended by the template. The tick-off sentence moves into
  `getting-started.md`; the four topics that currently show the Kattis primer
  link get it written into their own intro.
- The `No notes yet.` fallback and its `.mq-prob__empty` rule are deleted. The
  notes block renders only when the problem has a body.
- The "On this page" rail lists one entry per rendered section instead of a
  single `Problems` entry.
- Filter chips stay as one bar above all sections with page-wide counts. When a
  filter empties a section, the section — heading and intro included — hides
  too.
- Problem numbering restarts at `01` in each section.
- A topic with no problems keeps today's `Problems` heading and empty-state
  paragraph.
- The topic-level "Concept videos" block is untouched: it is not a problem list.

## Verification

`tests/topic-sections.test.ts`, covering: defaults when nothing is declared,
explicit `section` winning over the automatic rule, video → first, no video →
last, unknown id throwing, duplicate ids throwing, a single-section topic, and
empty sections being dropped. Then `npm run build` and a read of the rendered
Getting Started and Java Basics pages.

## Out of scope

Per-section filter bars, per-section progress counts, folding concept videos
into the section system, and ordering problems from the topic file.

## Noted in passing

The template's Kattis-primer link targets `#your-first-submission`, a heading
`getting-started.md` no longer has. The migrated copy points at
`#kattis-and-java` instead.
