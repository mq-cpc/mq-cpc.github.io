---
name: MQ Competitive Programming Club
description: Static site for a university competitive-programming club — a terminal/code aesthetic on warm paper, with a cool indigo dark mode.
colors:
  # Values below are the WARM (light) theme — the default :root palette.
  # The COOL indigo dark theme swaps every one of these roles; see Colors + the
  # sidecar for the dark values. Consume colours by role, never by hardcoded hex.
  paper: "#f3ede1"
  paper-sunk: "#e8dfce"
  surface: "#ffffff"
  ink-strong: "#2e2a24"
  ink: "#585149"
  ink-muted: "#70695f"
  line: "#ece4d4"
  line-strong: "#dacfbb"
  accent: "#b8506f"
  accent-hover: "#a5475f"
  accent-press: "#933f53"
  accent-tint: "#fcdce1"
  accent-ink: "#ffffff"
  accent-text: "#ac4763"
  success: "#3e6c4b"
  warning: "#805b11"
  danger: "#a64230"
  cat-lilac: "#975fab"
  cat-pink: "#c04e70"
  cat-butter: "#9a6c1b"
  cat-celadon: "#6e7b3d"
  cat-mint: "#458160"
  cat-sky: "#467c8e"
  focus-ring: "#3f7fbf"
typography:
  display:
    fontFamily: "'Libre Franklin', system-ui, sans-serif"
    fontSize: "clamp(34px, 4.4vw, 54px)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Libre Franklin', system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Libre Franklin', system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.15
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 500
    letterSpacing: "0.04em"
  # The second of the two fixed label sizes (--text-label-lg): nav, the wordmark,
  # larger mono captions. Previously only documented in prose below.
  labelLarge:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "15px"
    fontWeight: 500
    letterSpacing: "0.04em"
  # The root size the whole rem scale is defined against. Not a step — the
  # baseline that makes 1rem == 17px.
  root:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "17px"
  # Documented exception: the hero terminal panel. The Google-served JetBrains
  # Mono webfont has no U+2500 box-drawing block and silently falls back, which
  # drifts the kattis-cli result table's columns — so this one surface uses a
  # SYSTEM monospace, and 11px is the size at which the 78-column banner fits
  # the panel. Do not copy either value anywhere else.
  terminal:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "11px"
    lineHeight: 1
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "18px"
  pill: "999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "7": "3rem"
  "8": "4rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-strong}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  pill:
    backgroundColor: "{colors.paper-sunk}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.75rem"
  pill-accent:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.accent-text}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.75rem"
---

# Design System: MQ Competitive Programming Club

## Overview

A static, content-driven site (Astro) for a university competitive-programming club. The design is a **terminal/code aesthetic on warm paper**: JetBrains Mono labels, a `{}` brand mark, `$` and `>` prompts, and macOS-style window panels — set on a warm beige ground with soft "Color Crush" pastels doing the wayfinding. The single hero is a real terminal running a Kattis `compile → submit → Accepted` session.

It ships **two themes of one identity**, differing only in palette temperature: a **warm light** default (pastel beige + rose) and a **cool indigo dark** mode (deep indigo + neon orange). The code core — mono type, prompts, panel chrome, structure, spacing — is identical in both; only the colours change.

The tone is **approachable rigour**: serious contest prep that stays beginner-kind ("all levels welcome"), never edgy, hacker-dark by default, or intimidating. Warmth is the friendly face; the cool dark theme is the same personality with a hotter accent.

**Key Characteristics:**
- Two temperatures of one identity (warm light default, cool indigo dark) — role tokens, not hardcoded colour.
- A terminal/code vernacular: `{}` mark, `$`/`>` prompts, mono labels, window-title-bar panels.
- Warm neutral paper (not white) as the ground; clean white surfaces sit on it.
- Six pastel "Color Crush" hues used as **identity tags**, kept distinct from green/amber/red **status** colours.
- Flat by default — hairline borders and tonal layering carry structure; shadows are theme-tinted and rare.
- Restrained, precise, human; the personality lives in the details, not decoration.

## Colors

A warm neutral ground with a single rose accent and six pastel identity hues; the dark theme is its cool inversion. Every colour is a role token defined per theme.

### Primary
- **Warm Rose** (`#b8506f`, text `#ac4763`): the brand accent — the `{}` logo mark, primary buttons, section `>` markers, `//` eyebrows, links, the active nav underline, the hero's "together." In the **cool/dark** theme this role becomes **Neon Orange** (`#ff9440`, text `#ff9d5c`). AA-tuned against its background in both themes.

### Secondary — Category / identity hues
Six "Color Crush" pastels used as **identity tags** (a topic's or a category's own colour), never as decoration or difficulty.
- **Lilac** (`#9a64ad`), **Pink** (`#c65f7e`), **Butter** (`#b07c1f`), **Celadon** (`#87964a`), **Mint** (`#4f956f`), **Sky** (`#4f8da1`). Each carries a matching soft `-fill` for washes. The dark theme lightens the strokes and deepens the fills.

### Tertiary — Semantic / status
Reserved for state, never for identity: **Success green** (`#4f8a5f`), **Warning amber** (`#9a6e15`), **Danger coral** (`#bb4a36`), each with a tint. Used by problem-difficulty pills and event upcoming/past.

### Neutral
- **Warm Paper** (`#f3ede1`): the page ground — warm beige, not white. Sunk wells use **Paper Sunk** (`#e8dfce`).
- **Surface White** (`#ffffff`): panels and cards — clean white floating on the paper.
- **Ink** — Strong `#2e2a24` (headings), Body `#585149`, Muted `#8b8376` (captions).
- **Line** — hairline `#ece4d4`, emphasised `#dacfbb`.
- In the **cool/dark** theme these become deep indigo: paper `#0f1022`, surface `#181a30`, ink-strong `#e7e8f4`, line `#262943`.

### Named Rules
**The Two-Temperature Rule.** Every colour is a *role* token (`--accent`, `--paper`, `--ink`, `--cat-N`), never a hardcoded hex. Warm/light is the default; the cool/indigo theme swaps every role — *including the accent hue* (rose → neon orange) and even the shadow tint. New UI that reads roles themes for free; a literal hex breaks a theme.

**The Two-Language Rule.** The six pastels mean **identity** (what a thing *is*); green/amber/red mean **status/difficulty**. Never colour a card stripe by difficulty, and never use a pastel to signal state — the two vocabularies must not blur.

**The Rare-Accent Rule.** The accent is the loudest colour; it marks *actions and the current thing* (buttons, active nav, the `>` prompt), not surfaces. If a screen is washed in accent, it's wrong.

## Typography

**Display / Headings:** Libre Franklin (with `system-ui` fallback)
**Body / UI:** the native `system-ui` sans stack
**Label / Mono:** JetBrains Mono (with `ui-monospace` fallback)

**Character:** A quiet grotesque for headings and native sans for reading, offset by a confident monospace that carries the whole "code" personality — eyebrows, tags, nav, the `{}` mark, and every terminal surface. The mono is doing the identity work; the sans stays neutral. Root is **17px** (the rem scale and spacing open up together).

### Hierarchy
- **Display** (Libre Franklin 500, `clamp(34px,4.4vw,54px)`, line-height 1.04, tracking -0.02em): the home hero headline only.
- **Headline** (Libre Franklin 600, `2.25rem`/`1.75rem`, tracking -0.01em): page titles (`ps-h1`/`ps-h2`).
- **Title** (Libre Franklin 600, `1.375rem`): card and panel headings (`ps-h3`, `ps-card__title`).
- **Body** (system-ui 400, `1rem`, line-height 1.55, measure ~64ch): paragraphs and UI text.
- **Label** (JetBrains Mono 500, `12px` or `15px`, tracking 0.04em, often UPPERCASE): eyebrows, tags, nav, captions, terminal text.

### Named Rules
**The Two-Label-Sizes Rule.** Mono/label text uses exactly two fixed-px sizes — `12px` (`--text-label`) and `15px` (`--text-label-lg`) — not the rem body scale. Don't introduce an 11/13/14px one-off; snap to one of the two. **One documented exception:** the hero terminal panel runs at `11px` in a *system* monospace, because the JetBrains Mono webfont lacks the U+2500 box-drawing block and falls back mid-table, drifting the columns. That exception is the panel's alone — see `typography.terminal` above — and does not license a third label size anywhere else.

**The Mono-Vernacular Rule.** The "code" voice — `//SECTION` eyebrows, the `>` heading prompt, `$` terminal lines, the `{}` mark — is always JetBrains Mono. It's the club's accent of personality; keep it for chrome and labels, not body copy.

## Layout

Content sits in a **capped, centred shell** (`--content-max: 1600px` — the outer width, gutters included) rather than spanning the window. The sticky header spans the viewport but aligns its contents to the same column via a `padding-inline` calc, so the wordmark lines up with the page's `h1`. Spacing is a **hand-tuned, non-linear scale** (`--space-0..8`: `0, .25, .5, .75, 1, 1.5, 2, 3, 4 rem`) — not a linear multiplier — so utilities like `gap-5` map to `1.5rem`, not `5×`. The standard page wrapper (`.mq-page`) is `box-sizing:border-box; max-width:var(--content-max); margin:0 auto; padding: 3rem 2rem 4rem` — `border-box` is stated explicitly because preflight is off and nothing sets it globally. Card and reference grids are content-driven, not fixed: `.mq-grid-2`/`-3` are `repeat(auto-fit, minmax(…, 1fr))` with a `1rem` gap, so the column count follows the item count and the viewport, and a section holding one item does not reserve empty tracks. Sections that can legitimately hold a single item cap their container instead. The home hero is a two-column split (`1fr 1.15fr`, text left / terminal right) that collapses to one column at **≤860px**. Video tutorials are a wrapping, numbered grid, not a carousel — a scroller hid most of a 13-video topic behind an edge with no count or cue. The problem table is capped at the width of its own columns (`58rem`) rather than stretched, so a row's title, difficulty and judge link stay within one fixation; the box-drawing result banner still scrolls inside its own container rather than breaking the page.

## Elevation & Depth

Flat by default. Structure comes from **hairline borders (1px) and tonal layering** (warm paper → sunk paper → white surface), not shadows. Shadows are used sparingly and are **theme-tinted**: warm-neutral `hsl(38 16% 32%)` in light, near-black `hsl(240 40% 2%)` in dark — so even depth carries the theme's temperature. Cards rest nearly flat (`--shadow-sm`) and gain a soft `--shadow-md` + a 2px lift on hover; the hero terminal panel is the one element that floats, on `--shadow-lg`.

### Shadow Vocabulary
- **shadow-sm** (`0 1px 2px hsl(var(--shadow-color)/.10)`): card resting state — barely there.
- **shadow-md** (layered, ~`0 2px 4px …`): card hover.
- **shadow-lg** (`0 8px 24px hsl(var(--shadow-color)/.14) …`): the hero terminal panel only.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest — borders and tone do the work. A shadow appears only as a *response* (hover) or for the single hero panel. Don't drop-shadow everything.

## Shapes

Softly rounded, never sharp, never pill-everything. Radius scale: **sm 4px** (inputs, small tags), **md 8px** (buttons, the `{}` mark, badges), **lg 12px** (cards, panels), **xl 18px** (large containers), **pill 999px** (pills and the terminal traffic-light dots). Borders are hairline (`1px`), occasionally `1.5px` on controls and `2px` for focus. Two recurring silhouettes define the form language: the **macOS window** (a panel with a `paper-sunk` title bar and three coloured dots — used for the hero terminal) and the **top-stripe card** (a 3px identity-coloured `border-top` on an otherwise plain card).

## Components

### Buttons
- **Shape:** rounded (`8px`), `min-height` 34px, `1.5px` border.
- **Primary:** accent fill, `accent-ink` text (`.ps-btn--primary`). **Default:** white surface, `line-strong` border, `ink-strong` text. **Sm** (28px) and **Lg** (42px, hero CTA) size modifiers; **Ghost** is transparent with accent text.
- **Hover / Focus:** primary darkens to `accent-hover`; default fills to `paper-sunk`; `:active` nudges down 1px. Focus-visible = 2px `focus-ring` outline, 2px offset.

### Cards
- **Corner:** `12px`. **Background:** white `surface` on a `1px` `line` border. **Shadow:** `shadow-sm` at rest → `shadow-md` + `translateY(-2px)` on hover (links only).
- **Identity stripe:** a 3px `border-top` in the item's own hue (`--cat-N`) for topics/categories, or a single `--accent` stripe for category-less cards. The stripe encodes identity, never decoration or difficulty.
- **Padding:** `1.5rem`.

### Pills
- **Style:** `paper-sunk` fill, hairline border, `pill` radius, mono `12px` uppercase label. **Accent** variant: `accent-tint` fill + `accent-text`. Used for tags and the hero "ICPC PREP" badge.

### Navigation
- A centered mono nav row under the sticky header. Links are `15px` JetBrains Mono; the **active/hovered** link takes `accent-text` *and* animates a 2px accent underline (`::after`, `scaleX`). The header carries the `{}` mark + two-line wordmark and a theme toggle (◐).

### Signature — The Terminal Panel
The home hero's macOS-style window: a `paper-sunk` title bar with three traffic-light dots and a `me@macquarie:~` label, over a mono body that plays a real Kattis session (`$ javac` / `$ java` / `$ kattis submit` → the box-drawing **Accepted** banner). Rendered in a system monospace (box-drawing glyphs need it), `line-height:1` for the table. This panel is the identity's clearest expression — keep its vernacular exact.

## Do's and Don'ts

### Do:
- **Do** read colours from **role tokens** (`var(--accent)`, `var(--ink)`, `var(--cat-N)`) so new UI themes in both temperatures for free.
- **Do** keep the **terminal vernacular** where it belongs: `//` eyebrows, the `>` heading marker (`.mq-heading`), `$` prompts, JetBrains Mono labels, the `{}` mark.
- **Do** use the six pastels as **identity** and green/amber/red as **status** — and keep them apart.
- **Do** stay flat: hairline borders + tonal layering; shadow only on hover or the hero panel.
- **Do** use the two label sizes (`12`/`15px`) for mono chrome, and **arbitrary utilities for raw-px** values (`text-[14px]`) — the 17px root makes rem tokens diverge from px.
- **Do** hold **WCAG AA** on accent/text, and respect `prefers-reduced-motion`.

### Don't:
- **Don't** hardcode a hex in markup or components — it breaks a theme. One exception: dynamic per-item colours already sourced from `--cat-N`.
- **Don't** add a gradient/glassmorphism hero, drop-shadow everything, or otherwise trade the flat, papery, terminal feel for generic-SaaS gloss.
- **Don't** colour a card stripe by difficulty, or use a pastel to signal state (see the Two-Language Rule).
- **Don't** wash a screen in the accent — it marks actions and the current thing, not surfaces.
- **Don't** introduce a third label size or reach for the rem scale for mono labels.
