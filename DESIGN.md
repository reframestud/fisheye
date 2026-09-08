---
name: FISHEYE Architecture & Design
description: Mediterranean luxury craft: parchment ground, bright beige action, soft serif display, scrubbed photo plates, for a Marbella interior studio
colors:
  beige: "#fdf9f4"
  beige-2: "#f3f0e8"
  ink: "#000000"
  brand: "#e3d5ca"
  grey-200: "#e1dcd9"
  grey-300: "#c6c6c6"
  grey-700: "#7c7c7c"
  grey-800: "#484847"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 5rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  display-xl:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(2.5rem, 8vw, 5.5rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  fig-numeral-lead:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(4.5rem, 12vw, 8rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.04em"
  fig-numeral:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(3rem, 7vw, 5.5rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(1.75rem, 4.2vw, 3.25rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  heading:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(1.85rem, 3.5vw, 2.75rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  heading-sm:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(1.35rem, 2vw, 1.85rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  offer-mark:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  chapter-title:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(1.2rem, 1.6vw, 1.45rem)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  quote:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "1.2rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  body-lg:
    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  body-md:
    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  label:
    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.08em"
  meta:
    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0em"
  brand-mark:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "1.85rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
  brand-sub:
    fontFamily: "Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.65rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.12em"
rounded:
  sm: "0.25rem"
  md: "0.5rem"
spacing:
  margin: "clamp(1rem, 4vw, 3rem)"
  section: "clamp(4rem, 10vw, 8rem)"
  header: "4.5rem"
  shell: "1200px"
  measure: "68ch"
  title-measure: "28ch"
  title-measure-sm: "22ch"
  title-measure-lg: "36ch"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 2rem"
    height: "2.75rem"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.ink}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 2rem"
    height: "2.75rem"
    typography: "{typography.label}"
  button-secondary-hover:
    backgroundColor: "color-mix(in srgb, currentColor 12%, transparent)"
    textColor: "{colors.ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 2rem"
  button-ghost-hover:
    backgroundColor: "color-mix(in srgb, currentColor 10%, transparent)"
    textColor: "{colors.ink}"
  button-on-dark:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 2rem"
  link-underline:
    textColor: "{colors.ink}"
    backgroundColor: "transparent"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: "2.75rem"
    padding: "0 1rem"
---

# Design System: FISHEYE Architecture & Design

## Overview

**Creative North Star: "The Parchment Atelier"**

FISHEYE's shipped interface speaks a Mediterranean luxury craft language: warm parchment grounds, bright beige brand action, soft Instrument Serif display against quiet Inter body, rounded photographic plates, Lenis-smooth scroll, and ScrollTrigger image drift — applied to studio work, not hospitality. Photography and built interiors do the selling; chrome stays quiet.

**Mode:** Persuade on marketing routes; Experience on portfolio (projects lead). The visitor feels calm luxury, sees real interiors, understands process and accountability, then requests via the bright beige CTA.

**Scene:** A Marbella villa owner browsing midday on a bright laptop, parchment surfaces, black type, one bright beige accent for the action that matters: start a project.

Product truth (names, contacts, claims, stats, process) stays bound to PRODUCT.md and live studio content. This file records only the visual system as built.

**Key Characteristics:**
- Parchment / beige banding with pure ink type and a single bright beige action color
- Instrument Serif (400) for display and brand; Inter for body and UI
- Shared title system: `text-wrap: pretty` + `.title-measure` widths + `antiOrphan()` — natural 1–2 line titles, not balanced stacks
- Full-bleed photo heroes; media plates at `0.5rem`; buttons at `0.25rem`
- Depth from photography, tonal bands, and scrubbed drift, not drop shadows
- Homepage pillars as atelier dossier scroll: three tall 3/4 offer cards (Design / Supervision / FF&E) with real studio plates, shell-aligned track, then a hairline six-proof ledger — not an icon feature grid
- Lenis + GSAP ScrollTrigger as the motion spine; reduced-motion disables all of it
- Studio surfaces use split scroll dialogue and a horizontal team proof row — not equal team-card grids or numbered process spines
- Work scheme as horizontal proof chapters: scrubbed stage plates + Instrument Serif Fig. numerals, deep-linkable stages, optional proof galleries — not a text-only ledger

## Colors

Warm parchment neutrals with pure black ink and one bright beige brand accent. No secondary accent family.

### Primary
- **Bright Beige** (`brand`): Primary CTA fill, CTA borders, and text-link underline on hover. Rarity is the point — action and accent only.

### Neutral
- **Parchment** (`beige`): Primary page ground and solid header background.
- **Warm Wash** (`beige-2`): Alternating section bands (including homepage pillars), media-frame fallbacks, footer ground.
- **Ink** (`ink`): Primary text, dark theme ground, focus rings, selection background.
- **Warm Mist** (`grey-200`): Soft 1px rules, chapter hairlines, and field borders on light themes; solid header bottom edge.
- **Stone** (`grey-300`): Stronger rules; label color on dark themes.
- **Ash** (`grey-700`): Secondary / meta text (locations, captions, copyright).
- **Graphite** (`grey-800`): Emphasized secondary body and support copy on parchment.
- **White** (`white`): Text on dark bands and transparent-nav heroes.

Dark theme bands (`.theme-dark`) invert to ink ground and white text; brand CTAs stay bright beige. Selection uses ink background with parchment text. Muted white on dark heroes uses `color-mix` (~72–78% white) for support lines, not a separate token.

**The One Accent Rule.** Bright beige appears only on primary actions and link-hover underlines. It never paints large surfaces or decorative washes.

**The No-Costume Palette Rule.** No purple gradients, neon glow, terracotta-on-cream defaults, or mineral-ledger bone paper.

## Typography

**Display Font:** Instrument Serif (Georgia fallback), weight 400 only  
**Body Font:** Inter (Helvetica Neue, Arial), weights 400–500 in UI

**Character:** Soft editorial serif for presence; quiet sans for reading and controls. Tracking on display is tight (`-0.02em` to `-0.03em`). Labels are small Inter uppercase with `0.08em` tracking.

### Hierarchy
- **Display XL** (400, `clamp(2.5rem, 8vw, 5.5rem)`, lh 0.95): Hero-level brand signal where a text wordmark appears; mobile menu destinations use a related large display clamp.
- **Fig. numeral lead** (400, `clamp(4.5rem, 12vw, 8rem)`, lh 1, tracking `-0.04em`, tabular-nums): Work scheme stage `01` beside the opening plate — the largest Instrument Serif figure on the surface.
- **Fig. numeral** (400, `clamp(3rem, 7vw, 5.5rem)`, lh 1, tracking `-0.04em`, tabular-nums): Later Work scheme stage figures (`02`–`10`); visually decorative (`aria-hidden`) with sr-only “Figure NN.” on the title.
- **Headline** (400, `clamp(1.75rem, 4.2vw, 3.25rem)`, lh ~1.08): Hero offer line and large page statements.
- **Display / page title** (400, `clamp(2.25rem, 5vw, ~4–5rem)`, lh ~1.05): Interior page H1s (projects, request, work scheme ~`clamp(2.35rem, 5.5vw, 4.25rem)`).
- **Heading** (400, `clamp(1.85rem, 3.5vw, 2.75rem)`): Section titles (Selected work, pillars offer, Why design first, Feedback); Work scheme stage titles use a related clamp (`~1.5–2.75rem`, lead slightly larger).
- **Heading SM** (400, `clamp(1.35rem, 2vw, 1.85rem)`): Project titles in indexes; Feedback attribution names.
- **Chapter title** (400, `clamp(1.2rem, 1.6vw, 1.45rem)`): Offer dossier card titles (Design / Supervision / FF&E) and related chapter labels.
- **Chapter title** (400, `clamp(1.2rem, 1.6vw, 1.45rem)`): Pillar commitment names in hairline chapter rows.
- **Quote** (400, `1.2rem`–`clamp(1.2rem, 2vw, 1.45rem)`, lh ~1.4–1.45): Testimonials, Studio chapter asides, and pull lines.
- **Body** (400, `0.875rem`, lh 1.5): Default UI and supporting copy; measure capped at `68ch`.
- **Body MD / LG** (400, `1rem` / `1.125rem`): Lead support under titles.
- **Label** (500, `0.75rem`, `0.08em`, uppercase): Form labels, CTA button text, footer column titles, Feedback place lines.
- **Meta** (400, `0.8rem`): Captions, locations, legal footnotes.
- **Brand mark / sub:** Header wordmark via logo asset; optional uppercase tagline microcopy (`0.65rem` / `0.12em`) where the text mark still appears.

### Title measure system
Display titles prefer natural **1–2 lines**. Shared utilities in `globals.css`:

| Utility | Max width | Typical use |
|---|---|---|
| `.title-measure` | `min(100%, 28ch)` | Section titles (pillars offer); Work scheme page H1 |
| `.title-measure-sm` | `min(100%, 22ch)` | Compact section / page titles |
| `.title-measure-lg` | `min(100%, 36ch)` | Hero offer and wide statements |

Pair with `h1/h2/h3.font-display { text-wrap: pretty }` and `antiOrphan()` (non-breaking space before the last word). Do **not** use skinny `max-w-[12ch]` / `max-w-[14ch]` with `text-wrap: balance` — that forces awkward three-line stacks (e.g. “Design, supervision, and FF&E”).

**The Serif-For-Presence Rule.** Instrument Serif carries brand and section voice. Inter carries reading and controls. Do not swap roles.

**The No-Kicker Rule.** Section titles speak alone. Do not invent eyebrow/kicker lines above headlines. The `.label` utility is for form labels, footer columns, CTA microcopy, and attribution meta — not for dressing headlines.

**The Pretty Title Rule.** Section and page display titles use `text-wrap: pretty` + a shared `.title-measure*` width + `antiOrphan()`. Prefer 1–2 natural lines over evenly balanced multi-line stacks.

## Layout

- **Site margin:** `clamp(1rem, 4vw, 3rem)` (`--site-margin`).
- **Shell:** `min(100% - 2×margin, 1200px)` centered; narrow shell caps at `42rem` (privacy).
- **Header height:** `4.5rem`; page content on non-home routes pads by this amount.
- **Section rhythm:** `padding-block: clamp(4rem, 10vw, 8rem)` (`.section-y`).
- **Measure:** `.measure` → `max-width: 68ch`; hero and pillar support often tighter (`~42ch`).
- **Grids:** Asymmetric marketing splits (e.g. `0.9fr / 1.1fr`); project indexes 2-column with occasional full-bleed / wide plates (`21/9`, `16/10`, `4/5`); Studio dialogue `1fr / 0.95fr` with sticky answer column; quiet belief lists in up to 3 text columns (no cards). Gaps typically `1.5rem`–`3.5rem` (Tailwind `gap-6`–`gap-14`).
- **First viewport (home):** Full-bleed photo plane (`min-h: 100svh`), transparent nav with logo brand mark, one offer headline (`.title-measure-lg`), one support, one CTA group (bright beige primary + secondary outline). No stats, process, or secondary marketing in the first viewport.
- **First viewport (Studio):** Two-column shell — FISHEYE display-XL left with Studio meta (`0.75rem` / `0.12em` uppercase Ash), one support line (`~36ch`), then a quiet **atelier ledger**: the four `site.stats` figures as Instrument Serif display numerals in a 2×2 grid under the copy (no cards, no brass fill). Tall founder plate (`4/5`) right. **Studio exception:** big figures live in this hero only — do not repeat them in a lower strip. (Home and other marketing routes still ban stats in the first viewport.)
- **First viewport (Work scheme):** Compact shell header — page title (`.title-measure` + pretty wrap) + one Graphite support line (`~40ch`). Stage `01` opens immediately below as a proof chapter (plate + Fig. numeral + title + body). No sticky rail, no stats, no secondary marketing in the first scroll of the sequence.
- **Homepage pillars (atelier dossier scroll):** Beige-2 band (`data-pillars-band` / `OfferDossierScroll`). Shell title “Design, supervision, and FF&E” (`.title-measure`). Below: three tall dossier cards fill the shell on desktop (`3/4` scrubbed plates), Instrument Serif service title + Graphite body. Real studio photography only. Under the cards: six operational proofs as a **smaller horizontal strip** (`.offer-proof-strip--shell`) of compact tiles (`.offer-proof-tile`) — Schedule through Implementation — shell-aligned snap scroll, clearly secondary to the dossier plates. Not a 2×3 column ledger or icon feature grid.
- **Split Atelier Dialogue:** Story chapters scroll on the left; sticky media plates answer on the right (`md+`). Chapters are discrete beliefs/practice/people — never numbered process stages (that spine belongs only to Work scheme). Active chapter holds full opacity; inactive soften to ~45–55%. Mobile stacks each plate inline under its chapter.
- **Team proof row:** Horizontal snap-scroll row of portrait plates (`3/4`, ~`11.5–14rem` wide), name + uppercase role + note under a `grey-200` hairline — proof of named people, not an equal team-card grid. Reuses `.team-proof-track` (scrollbar hidden, snap-x).
- **Work scheme horizontal proof chapters:** Ordered stage list (`WorkSchemeSequence`) — each stage is a hairlined proof chapter (`id="work-step-N"` deep links), not a text-only ledger row. Shell grid `md:grid-cols-12` with equal `col-span-6` plate / copy; odd stages reverse column order. Lead stage plate `4/5` → `md:5/6` with `data-hero-plate`; later stages `4/5` → `md:16/11`. Copy column: oversized Instrument Serif Fig. numeral (`01`…), stage title, Graphite body (`~40–42ch`). Optional under-stage galleries reuse `.team-proof-track` with portrait plates (`4/5` → `md:3/4`, ~`17–18rem`) and uppercase label captions under a hairline. No sticky sidebar index — sequence + plate proof is the product information. Dark CTA band closes.
- **Closing punctuation:** Recurring dark (`theme-dark`) band with bright beige CTA before footer.

**The Offer Dossier Rule.** On the homepage pillars band, Design / Supervision / FF&E read as three tall scrubbed dossier plates in a shell-aligned horizontal track, each with measured title and body. Cards exist only as the scroll container. Do not rearrange into equal icon feature grids or Work-scheme-style numbered stages.

**The Proof Strip Rule.** The six operational commitments (Schedule → Implementation) sit under the dossier as a smaller shell-aligned horizontal strip of compact tiles — not a 2×3 column ledger, not a second photo carousel, and not a sticky chapter column.

**The Grainline Tick Rule.** Each proof-ledger item opens with a short ink tick on the leading edge of its `grey-200` hairline — a sewing-pattern grainline, not a bullet, icon, or stage number.

**The Split Dialogue Rule.** On Studio, story and plates answer each other in a split scroll dialogue. Do not replace this with equal team-card grids or a Work-scheme-style numbered process spine.

**The Team Proof Row Rule.** Named people after the story prove the team as a horizontal scrubbed-plate row. Do not rearrange them into equal card grids with icons or decorative chrome.

**The Horizontal Proof Chapter Rule.** On Work scheme, each process stage is a scrubbed plate + Instrument Serif Fig. numeral + title + body (alternating columns, deep-linkable `#work-step-N`). Do not reduce stages to a text-only ruled ledger, a sticky rail index, or equal process cards without plates.

## Elevation & Depth

Depth comes from **photography scale, parchment/beige banding, hero gradient scrims, and motion**, not drop shadows. Borders are flat 1px `grey-200` (occasionally `grey-300`). Media frames use no decorative shadow. Focus is a 2px ink outline with 3px offset — structural, not glowing.

### Named Rules
**The Flat-By-Default Rule.** Surfaces stay flat at rest. No multi-layer soft shadows, no glassmorphism.

**The Photo-Is-Depth Rule.** Scale, crop, scrub drift (`-6rem` Y), and tonal bands create hierarchy. Decorative elevation is out of character.

## Shapes

- **Small radius** (`0.25rem` / `--radius-sm`): Buttons, inputs, textareas.
- **Media radius** (`0.5rem` / `--radius-md`): Image plates, media frames.
- **Aspect language:** `16/10` default / landscape dialogue plate; `4/5` tall portraits (founder, project indexes, Work scheme stage plates on mobile); `5/6` Work scheme lead plate on `md+`; `16/11` later Work scheme stage plates on `md+`; `3/4` team proof-row and Work scheme gallery portraits; `21/9` wide feature plates; hero is full-bleed (no radius on the viewport plane itself).
- **Media frames:** Overflow hidden, beige-2 fallback, hover scale `1.05` on the image (0.8s kube ease), not opacity fade.
- **Hairlines:** 1px `grey-200` top borders for offer-proof ledger items, Feedback entries, and related ledger rows; proof grainline ticks are 1px × `0.55rem` ink.
- **Plate captions:** Meta under a top hairline (`grey-200`) or quiet Ash caption — name/role baseline split on founder; caption string on dialogue plates.

**The Plate Rule.** Photography lives in scrubbed, rounded plates or full-bleed heroes, never floating shadowed cards.

## Components

### Buttons
Quiet, uppercase label CTAs — bright beige fill is the only loud move. Never underline (including hover).

- **Shape:** Small radius (`0.25rem`); min-height `2.75rem`; padding `0.75rem 2rem`. Sizes: `sm` / `md` / `lg`.
- **Primary (`.btn-primary`):** Brand fill + brand border, ink text, Inter label (12px / 500 / uppercase / `0.08em`). Hover: `brightness(0.97)` + `translateY(-2px)`. Active: `scale(0.98)`.
- **Secondary (`.btn-secondary`):** Transparent fill, `currentColor` outline; inherits ink/white from context. Hover: `12%` currentColor wash + `translateY(-2px)`.
- **Ghost (`.btn-ghost`):** Transparent fill and border; minimal. Hover: `10%` currentColor wash; no lift.
- **On dark (`.btn-on-dark`):** Same bright beige fill as primary — brand does not change on dark bands.

### Text links
- **Underline link (`.link-line`):** 1px currentColor underline via background-image; hover swaps underline to brand bright beige.
- **Nav link (`.nav-link`):** No underline; opacity ~0.75 → 1; hover tints bright beige and lifts `2px`.

### Fields
- **Style:** Transparent ground, 1px `grey-200` border, `0.25rem` radius, height `2.75rem`, inline padding `1rem`.
- **Textarea:** Same border language; padding `0.85rem 1rem`.
- **Hover:** Border mixes toward ink (~28%).
- **Focus:** Border shifts to ink; soft beige-2 wash (~55% mix). Global `:focus-visible` outline remains ink 2px / 3px offset.

### Navigation
- **Fixed** bar, height `4.5rem`, z-50.
- **Home:** Transparent over the hero (`white` text) until scroll, then solid parchment + ink + `grey-200` bottom border. Non-home routes start solid.
- **Logo:** Brand logo asset; scroll scale floor `0.72` (`1 - y/900`).
- **Desktop:** Inter `.nav-link` items; phone micro-link; bright beige **Request** button (`sm`).
- **Mobile:** Full-viewport parchment panel (not a compact dropdown); large Instrument Serif destinations; phone + Request in a hairline footer block.

### Media plates
- **Frame (`.media-frame`):** `overflow: hidden`, `0.5rem` radius, beige-2 ground.
- **Drift:** `[data-img-wrap]` / `[data-img]`, ScrollTrigger scrub Y `0 → -6rem` (taller wrapper + `scale` headroom on hero `1.12`).
- **Hover:** Image scale `1.05` inside the frame.

### Homepage pillars (signature)
Atelier dossier scroll on a beige-2 band — Design / Supervision / FF&E as tall scrubbed plates, then a hairline proof ledger.

- **Title:** Heading “Design, supervision, and FF&E” in `.shell` (`.title-measure` + pretty wrap + `antiOrphan`).
- **Track (`.offer-dossier-track--shell`):** Full-bleed horizontal snap scroll; padding/scroll-padding from shell inset (same grammar as `.team-proof-track--shell`); scrollbar hidden; gaps `1–1.25rem`.
- **Card (`.offer-dossier-card`):** Fixed-width tall dossier (~`17.5–18.5rem`); scrubbed `3/4` plate with img-drift headroom; hairline caption (chapter-title serif + Graphite body `~36ch`). Real studio photography only.
- **Proof strip (`.offer-proof-strip--shell`):** Six commitments under the cards — compact tiles (`.offer-proof-tile`) with grey-200 top rule, parchment wash, Instrument Serif title + Graphite body; shell-aligned horizontal snap scroll, clearly smaller than the dossier plates.
- **Not:** Icon feature grids, glyph tiles, numbered process stages, dash-separated free labels, or equal multi-column marketing cards without plates.

### Quiet belief list
Beige-2 band (“Why design first”); up to three text-only columns (display title + body). No borders, shadows, or cards — a calm hold list, not a feature grid. Distinct from the pillars dossier scroll.

### Feedback ledger
Guest-book style named reviews: two-column hairline entries; attribution (display name + uppercase place) leads; Instrument Serif quote with a quiet oversized opening mark. Not an editorial quote column or card grid.

### Dark CTA band
- Ink ground, white heading, muted white support (~72% mix), bright beige primary CTA. Recurs on home, studio, work scheme, and project detail.

### Studio dialogue (signature)
Split atelier conversation: left chapters, right sticky answering plates (`StudioDialogue`).

- **Grid:** Shell; `md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]`; sticky answer `top: calc(header + 1.75rem)`.
- **Chapters:** Display heading (`clamp(1.75rem, 3.2vw, 2.75rem)`); optional Instrument Serif aside; body measure `~48ch`. No stage numbers.
- **Active state:** Opacity `1` vs `0.45–0.55`; plate crossfade `700ms` ease-out (`translateY` 3px when entering); chapter nav is uppercase Inter labels with ink/Ash, not brass.
- **Reduced motion:** Instant plate swap; smooth scroll becomes `auto`.

### Team proof row (signature)
Horizontal named-people proof after the Studio story.

- **Track:** Full-bleed horizontal scroll with site-margin padding; snap-start; scrollbar hidden (`.team-proof-track`); gaps `1–1.25rem`.
- **Cell:** Fixed-width scrubbed `3/4` plate; hairline caption block (display name, uppercase role label, meta note).
- **Not:** Equal multi-column card grids, icon rows, or process thumbnails.

### Work scheme proof chapters (signature)
Process as horizontal proof chapters (`WorkSchemeSequence`) — scrubbed plates and Fig. numerals lead; refuses text-only stage stacks.

- **Page open:** Shell header H1 + one support; Fig. `01` plate chapter begins immediately (no sticky rail).
- **Chapter:** `grey-200` top hairline; `md:grid-cols-12` plate / copy (`col-span-6`); odd indices reverse order. Lead padding slightly tighter above; later chapters `py-14` / `md:py-20`.
- **Plate:** `.media-frame` + `[data-img-wrap]` / `[data-img]` scrub; lead uses `data-hero-plate` + hero enter; height headroom `120%` for drift.
- **Fig. numeral:** Instrument Serif tabular `01`–`10` (lead larger); decorative visually; title carries sr-only “Figure NN.”
- **Copy:** Stage title (display) + Graphite body; lead body ~`1–1.125rem` / `40ch`; later ~`0.875–1rem` / `42ch`.
- **Gallery (optional):** Same `.team-proof-track` snap row under the chapter; portrait plates + uppercase Inter captions (`0.75rem` / `0.08em`) under a hairline.
- **Deep links:** `#work-step-1` … `#work-step-N` on each `<li>`.
- **Close:** Dark CTA band — proposal invite + bright beige Request.
- **Not:** Text-only ruled ledger, sticky stage index, equal process cards without plates, or Studio-style sticky answering dialogue.

### Footer
- Beige-2 ground, top rule; 3-column grid on md (`1.4fr / 1fr / 1fr`); display wordmark; Studio / Connect link lists with `.link-line`; quiet copyright rule in meta/label style.

### Motion grammar (site-wide)

**Thesis: Atelier Reveal** — soft parchment lifts on viewport enter, photo plate scrub, hero settle as the focal moment, quiet UI feedback. Tokens live in `src/lib/motion.ts` and CSS `--motion-*`.

| Behavior | Spec |
|---|---|
| Smooth scroll | Lenis `lerp: 0.08`, `wheelMultiplier: 0.9` |
| Image drift | Scrubbed Y `0 → -6rem` on `[data-img-wrap] [data-img]` |
| Section reveal | `[data-reveal]`: Y `40px → 0` + `autoAlpha 0 → 1`, `1s`, `power3.out`, start `top 88%` |
| Reveal variants | `lift` (40px), `lift-lg` (48px), `clip` (`inset(32% 0 36% 0)` wipe + fade) |
| Stagger groups | `[data-reveal-group]` + `[data-reveal-child]`, stagger `0.1s` |
| Page enter | Soft nav: content stays fully opaque after paint; Lenis scrolls to top immediately. First load only: `#main` Y `14 → 0`, autoAlpha `0.9 → 1`, `0.28s`. Above-fold reveals skip on soft nav. |
| Hero enter | First load: `[data-hero-el]` stagger Y `40`, `1.15s`, `0.16` stagger; plate scale `1.1 → 1`, `1.6s`. Soft nav: hero copy stays opaque; plate-only settle `1.02 → 1`, `0.4s`. |
| CTA band | `[data-cta-band] [data-cta-el]` Y `44`, start `top 82%` |
| Nav | Logo scale floor `0.72`; links opacity + 2px lift + brand tint; mobile menu staggered enter |
| Buttons / filters | CSS `--motion-ui` lift `-2px` / press; filter bar `[data-motion-chrome]` |
| Forms | Field border + soft parchment wash on focus |
| Footer | Column stagger via reveal-group |
| Studio dialogue | Chapter opacity `500ms`; plate crossfade `700ms` + `translateY(3px→0)` ease-out; IntersectionObserver active chapter |
| Offer dossier / proof ledger | `[data-reveal-group]` / `[data-reveal-child]` on dossier cards and proof items; plates scrub via shared img-drift |
| Work scheme chapters | Lead stage rides hero enter (`data-hero` / `data-hero-el` / `data-hero-plate`); later stages `[data-reveal]`; gallery cells `[data-reveal-group]` / `[data-reveal-child]`; plates scrub via shared img-drift |
| UI easing | `--ease-out` / `--ease-lift`: `cubic-bezier(0.16, 1, 0.3, 1)`; `--ease-kube`: `cubic-bezier(0.22, 1, 0.36, 1)` |
| Reduced motion | No Lenis, no scrub, no reveals, no hover image scale, no nav/button translates; dialogue plate swap instant |

Signature moments: (1) full-bleed hero settle + headline stagger, (2) scrubbed plate parallax on project photography, (3) homepage offer dossier scroll (Design / Supervision / FF&E) + proof ledger, (4) Studio split dialogue plate answers, (5) Work scheme Fig. `01` plate opening beside stage copy, (6) dark-band CTA with bright beige button.

## Do's and Don'ts

### Do:
- **Do** let project photography dominate; keep chrome quiet (PRODUCT principle).
- **Do** keep the FISHEYE brand mark hero-visible on the home first viewport (fixed transparent nav over the photo plane) before any competing chrome.
- **Do** use `.title-measure*` + `text-wrap: pretty` + `antiOrphan()` for display titles so they read as 1–2 natural lines.
- **Do** present homepage pillars as a shell-aligned horizontal dossier scroll of Design / Supervision / FF&E plates with real studio photography, then a smaller horizontal proof strip for Schedule → Implementation.
- **Do** open Studio with brand + founder plate and the atelier ledger figures in the hero (single placement); keep secondary marketing and belief copy below.
- **Do** pair Studio story chapters with answering plates (split dialogue); keep Work-scheme numbering only on Work scheme.
- **Do** present the named team as a horizontal proof row of scrubbed plates.
- **Do** present Work scheme stages as horizontal proof chapters (plate + Fig. numeral + copy, deep-linkable); open Fig. `01` beside stage copy in the first viewport.
- **Do** use bright beige only for primary actions, nav-link hover tint, and link-hover underlines.
- **Do** round media at `0.5rem` and CTAs at `0.25rem`.
- **Do** preserve factual content, contacts, and claims from PRODUCT.md / live studio sources.
- **Do** honor `prefers-reduced-motion` by disabling Lenis, scrub, and entrance offsets.

### Don't:
- **Don't** copy Kube hotel copy, room names, spa brands, or hospitality claims.
- **Don't** invent commercial claims, prices, clients, or awards not in PRODUCT.md / site content.
- **Don't** revive the prior mineral-ledger world (bone paper + Familjen Grotesk + solid ink CTAs + mono specimen captions).
- **Don't** use generic equal card grids with glyph icons, purple gradients, neon glow, or terracotta-on-cream AI defaults.
- **Don't** turn homepage pillars into icon feature grids, numbered process stages, chip/pill offer tags, or dash-separated free labels — cards exist only as the dossier scroll container.
- **Don't** force skinny balanced title wraps (`max-w-[12ch]` + `text-wrap: balance`) that stack short phrases into three awkward lines.
- **Don't** rearrange Studio people into equal team-card grids or dress Studio chapters as a numbered process spine.
- **Don't** reduce Work scheme to a text-only stage ledger, sticky rail index, or process cards without scrubbed plates.
- **Don't** place kickers/eyebrows above headlines; **Don't** put stats or secondary marketing in the first viewport — **except Studio**, where the atelier ledger figures belong in the hero by product request.
- **Don't** add drop shadows or glass treatments to plates, cards, or menus.
