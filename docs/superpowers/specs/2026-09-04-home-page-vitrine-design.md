# Sedra Home Page — "The Vitrine"

**Date:** 2026-09-04
**Status:** Approved, ready for implementation planning

## Problem

The home page currently reads as a generic ecommerce storefront: a crossfading
image slideshow labelled `Hero3D` (it contains no 3D), followed by a four-up
grid of bordered product cards with prices and chevron buttons, then the footer.
Sedra sells rare, handcrafted Egyptian objects. The page should feel like a
museum vitrine, not a catalogue page.

## Goals

- The home page reads as a cinematic, scroll-driven showcase — no cards, no
  grid, no prices.
- Every object shown is still one click from its product page.
- The experience is fast and universal: CSS 3D and scroll-linked transforms, no
  WebGL.
- The rest of the site (light theme, dashboard, checkout) is unaffected.

## Non-goals

- No cart, add-to-cart, or price display on the home page.
- No WebGL / react-three-fiber work. `three`, `@react-three/fiber` and `drei`
  stay installed but unused; removing them is out of scope.
- No redesign of `/about`, `/contact`, `/product/[id]`, the dashboard, or the
  checkout flow.
- No changes to the Prisma schema or any API route.

## Decisions

| Question | Decision |
|---|---|
| Home's job | Showcase; objects link to their product pages. No commerce UI on home. |
| 3D technique | CSS 3D (`perspective`, `transform-style: preserve-3d`) plus scroll-linked transforms. No WebGL. |
| Art direction | Dark museum / gold. Home forces its own always-dark palette; the rest of the site keeps the existing light theme and toggle. |
| Dependencies | Add `motion` (Framer Motion v12) and `lenis`. |
| Narrative | "The Vitrine" — cold open, manifesto, one pinned act per featured object, craft interlude, horizontal collection drift, closing invitation. |
| Copy | Written as evocative placeholder. No invented specifics (no fabricated artisan names, villages, dates, or techniques presented as fact). Every string marked as placeholder and centralised in one file. |

## Art direction

Ground is near-black limestone. Type is gold and alabaster, display set in an
oversized serif against a small, wide-tracked sans for eyebrows and labels.
Objects are lit as if in a vitrine: a soft elliptical pool of warm light beneath
each piece, darkness everywhere else.

Home-only tokens are defined in `app/globals.css` under a `.museum` class
(scoped custom properties, not a change to `:root` or `.dark`). The home
wrapper carries both `museum` and `dark` so any shadcn component rendered
inside resolves to dark variants. Because `globals.css` declares
`@custom-variant dark (&:is(.dark *))`, the `dark` class on an ancestor is
sufficient; no change to the theme provider is required, and the user's stored
light/dark preference is untouched on every other route.

Token set to define on `.museum`: `--background`, `--foreground`, `--muted`,
`--muted-foreground`, `--primary` (gold), `--accent`, `--border`, plus
home-specific `--museum-gold`, `--museum-alabaster`, `--museum-limestone`.

## Structure

### Act 0 — Cold open

Full viewport, near-black. A single object photo floats on a CSS-3D stage with
a soft elliptical gold pool of light beneath it. Roughly forty absolutely
positioned motes of gold dust drift across on CSS keyframes (no canvas, no JS
per-frame work).

`SEDRA` reveals letter by letter on mount. As the section scrolls, the object
scales up and rotates slightly while the wordmark's letter-spacing expands and
its opacity falls to zero. A scroll cue sits at the bottom and fades on first
scroll.

Source image: the first featured product's photo, falling back to a heritage
image already in Supabase storage.

### Act 1 — Manifesto

A pinned sentence, oversized, whose words light one by one as scroll progress
advances (each word interpolating from ~0.15 to 1 opacity across its own slice
of the section's progress). One sentence only. This is where the page states
that these are objects, not products.

### Acts 2..N — Object vitrines

One act per featured object, capped at five. Each act owns a sticky viewport
inside a tall scroll container.

Composition:

- A giant index numeral (`01`, `02`, …) in outline stroke, sitting behind the
  object, low contrast.
- The product photo on a 3D plane. Its `rotateY`/`rotateX` respond to scroll
  progress and, additively, to cursor position (cursor influence is small and
  damped).
- The elliptical vitrine light beneath the object.
- Beside the object: category eyebrow, object name in large serif, a single
  line of story, and a quiet `View object →` link to `/product/[id]`.

Entry: the photo rises from below with a blur that resolves, and the text lines
stagger in. Exit: the photo drifts back and up into the dark as the next
numeral fades up. No price, no border, no card, no add-to-cart.

Alternating sides (object left / text right, then reversed) across acts.

### Act N+1 — The Making

A full-bleed heritage image revealed by a scroll-driven `clip-path` wipe with
slow parallax on the image itself. Two short paragraphs on craft. Below them,
two rows of material words drifting in opposite directions
(`ALABASTER · PAPYRUS · BRASS · …`), looping seamlessly.

### Act N+2 — Collection drift

A sticky section in which the objects not used as vitrine acts drift
horizontally as the page scrolls vertically. Objects only — photo, name,
slight 3D tilt — each linking to its product page. This replaces the former
grid without becoming a row of cards.

On viewports below the `md` breakpoint this degrades to a native
`overflow-x: auto` scroller with CSS scroll snapping and no scroll-linked
translation.

### Act N+3 — Invitation

Back to near-black. One oversized serif line, a single gold-outline link into
the full collection, and a quiet line naming Hurghada. The existing `Footer`
follows.

## Header

`components/header.tsx` gains a `variant?: "solid" | "overlay"` prop,
defaulting to `"solid"` so every existing caller is unchanged. Home passes
`"overlay"`: transparent, gold-on-black, sitting over the cold open, then
condensing into a slim backdrop-blurred bar once the user scrolls past the
first viewport. The cart badge, theme toggle and mobile menu keep working.

## Motion and accessibility

- All choreography is scroll-linked through `motion`'s `useScroll` and
  `useTransform`. Animated properties are limited to `transform`, `opacity`,
  `filter` and `clip-path`.
- Lenis is instantiated inside the home client shell only and torn down on
  unmount, so the dashboard, checkout and every other route keep native
  scrolling.
- `prefers-reduced-motion: reduce` disables Lenis and every transform. The page
  renders as a plain, fully legible vertical document: objects at rest, text at
  full opacity, the horizontal drift becomes a normal scroller. This is a hard
  requirement, verified before the work is called done.
- Every object image keeps meaningful `alt` text. Links are real anchors and
  remain keyboard-reachable and focus-visible against the dark ground.
- Text contrast against the limestone ground meets WCAG AA for body copy.

## Performance

- Only `transform`/`opacity`/`filter`/`clip-path` animate; no layout-triggering
  properties.
- `will-change` is applied narrowly and removed where it isn't needed.
- `next/image` with explicit `sizes` for every object; `priority` only on the
  cold-open image.
- Gold dust is pure CSS keyframes, not a per-frame JS loop.
- Cursor tracking is throttled to animation frames and damped through a spring.

## Files

New:

- `components/home/home-experience.tsx` — client shell; mounts Lenis, owns the
  reduced-motion check, composes the acts.
- `components/home/act-open.tsx`
- `components/home/act-manifesto.tsx`
- `components/home/object-vitrine.tsx` — one act, driven by props.
- `components/home/act-making.tsx`
- `components/home/collection-drift.tsx`
- `components/home/act-invitation.tsx`
- `content/home-copy.ts` — every invented string, each marked placeholder.

Modified:

- `app/page.tsx` — stays a server component; fetches products, splits them, and
  renders the client shell.
- `app/globals.css` — add the `.museum` scoped token block.
- `components/header.tsx` — add the `variant` prop.
- `package.json` — add `motion` and `lenis`.

Untouched but no longer used by home: `components/hero-3d.tsx`,
`components/animated-featured-products.tsx`. They are left in place rather than
deleted; other unused components (`hero-section`, `featured-products`,
`categories-section`, `testimonials-section`) are out of scope.

## Data flow

`app/page.tsx` calls the existing `getProducts()` (already includes
`category`). It then splits the result:

- Vitrine acts: products where `isFeatured` is true, capped at five.
- If none are flagged featured, the first four products stand in.
- Collection drift: every remaining product, capped at twelve.

Only the fields the presentation needs are passed to client components: `id`,
`name`, `image`, `categoryName`. Price is deliberately not passed. `image` is
nullable in the schema, so every consumer falls back to `/placeholder.svg`.

Edge cases: zero products (acts and drift render nothing; cold open falls back
to the heritage image and the rest of the page still reads as a complete
document), and fewer products than acts (render only what exists).

`export const dynamic = "force-dynamic"` stays as it is.

## Copy

All home copy lives in `content/home-copy.ts`. Each export carries a comment
marking it as placeholder awaiting real content. Copy is evocative but makes no
factual claims that could be wrong: no invented artisan names, no invented
villages, no invented founding dates, no invented techniques attributed to
specific people. Object story lines are written generically enough to be true of
the category, and are per-object overridable from that same file.

## Verification

The repository has no test infrastructure, so verification is manual and
evidence-based:

1. `npx tsc --noEmit` passes.
2. `next build` completes with no new errors.
3. The dev server runs and `/` renders; the browser console is free of errors.
4. The page is driven in a real browser at a desktop width and at 375px:
   every act reached, screenshots captured.
5. A `prefers-reduced-motion: reduce` pass confirms the page is static and fully
   legible.
6. `/about`, `/contact` and `/dashboard` are loaded to confirm the light theme,
   the theme toggle and native scrolling are unchanged.

No completion claim is made before these are run and their output confirmed.
