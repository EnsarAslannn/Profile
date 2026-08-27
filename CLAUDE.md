# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Vite dev server on http://localhost:5173
npm run build      # tsc -b (typecheck) && vite build
npm run preview    # serve the production build
npm run lint       # oxlint (NOT eslint - see .oxlintrc.json)
npm test           # vitest run (single pass)
npm run test:watch # vitest in watch mode
npx tsc -b         # typecheck only, without bundling
npx vitest run src/components/Hero.test.tsx   # a single test file
npx vitest run -t "renders the heading"       # a single test by name
```

Tests run on Vitest + React Testing Library in a `jsdom` environment. `vitest.config.ts` merges `vite.config.ts`, so components compile under test exactly as they do in dev and build. Test files live next to the component as `src/**/*.{test,spec}.{ts,tsx}`; shared setup is `src/test/setup.ts`.

Vitest globals are **off** - import `describe` / `it` / `expect` from `vitest` explicitly. `passWithNoTests` is `false`, so a broken `include` glob fails loudly instead of reporting a green run with zero tests collected.

## What this is

Personal portfolio for Ensar Aslan. The home route `/` is a scroll-navigated single page; project detail pages live at `/projects/<slug>` behind a client-side router (`react-router-dom`). All user-facing copy is **Turkish**; identifiers, types, props, and comments are **English**. Content is no longer entirely placeholder: Hakkımda, Projeler and Özgeçmiş carry real owner-supplied content. There is no longer a separate İletişim section - it was removed (six-owner-changes Task 4); contact details (e-posta, telefon, konum) live in `ProfileCard` (inside Hero) and in `Footer`, which is the only place they surface on a project detail page.

Visual direction: a light gradient ground (a soft blue wash fading into near-white, `PageBackdrop.tsx`) with a blue accent (`text-accent-base`), defined as semantic `@theme` tokens in `src/index.css` (`surface-*`, `line-*`, `ink-*`, `accent-*`, `focus`, `backdrop-*`). Modeled on cyze.dev.

## Agent workflow

Non-trivial UI work runs through four agents defined in `.claude/agents/`, in this order:

**planner → ui-agent → builder → reviewer**

| Agent | Model | Skill | Owns | Writes code? |
| --- | --- | --- | --- | --- |
| `planner` | opus | `writing-plans` | Architecture and content organization: which components exist, data shapes, section order, heading hierarchy | No |
| `ui-agent` | sonnet | `ui-ux-pro-max` | Design and Tailwind decisions: exact class strings, spacing rhythm, breakpoints, `@theme` tokens in `src/index.css` | Tokens only |
| `builder` | sonnet | `tdd` | Component implementation test-first (red → green → refactor), wiring into `App.tsx` / `Navbar.tsx`, making the build pass | Yes - the only one |
| `reviewer` | sonnet | `standards-spec-review` | Two-axis diff review (Standards against this file, Spec against the planner's brief) **plus** the responsive, accessibility, and SEO audit - the skill covers only the first two, so the last three are the agent's own mandate and are never optional | No |

Each stage hands its output to the next. Skip stages only for genuinely trivial edits (a typo, a single class tweak). Never let `builder` invent visual design or `ui-agent` invent structure - if an upstream brief is missing, go get it rather than guessing.

Skills are installed under `.agents/skills/` (committed) and surfaced to Claude Code through Windows junctions in `.claude/skills/` (gitignored - they are links, not content). `skills-lock.json` pins each skill to its upstream source and commit hash. `vercel-react-best-practices` is installed but deliberately **not** bound to any agent - it is for manual use at deploy time, and much of it is Next.js-specific and does not apply here.

### Restoring skills after a clone

One command restores all five into `.agents/skills/` and recreates the agent links:

```bash
npx skills experimental_install    # reads skills-lock.json
```

Then rename the code-review skill locally. This is required, not optional: upstream ships it as `code-review`, which collides with the `code-review` skill built into Claude Code, so the lock file pins it under its upstream name and the rename happens after restore.

```bash
mv .agents/skills/code-review .agents/skills/standards-spec-review
sed -i 's/^name: code-review$/name: standards-spec-review/' .agents/skills/standards-spec-review/SKILL.md
rm -rf .claude/skills/code-review
cmd //c mklink /J ".claude\skills\standards-spec-review" ".agents\skills\standards-spec-review"   # Windows
# ln -s ../../.agents/skills/standards-spec-review .claude/skills/standards-spec-review           # macOS / Linux
```

Confirm with `npx skills list` that the entry reads `standards-spec-review`; `reviewer` binds to that name and will not find the skill under the upstream one. For the same reason, `npx skills update` re-adds it as `code-review` - redo the rename after any update.

## Architecture

`BrowserRouter` is mounted in `src/main.tsx`. `src/App.tsx` is the chrome shell: `ScrollToHash` + `Navbar` + `<Routes>` + the footer wrapper, rendered outside `<Routes>` so chrome is identical on every route. **`App` requires a Router ancestor** - it throws if rendered bare, so tests render it (or any component that uses `<Link>`/`useLocation`) through `src/test/renderWithRouter.tsx`, which wraps the tree in a `MemoryRouter` at a given route.

Routes: `/` → `src/pages/HomePage.tsx` (the single-page body, in order: Hero, Projeler, Özgeçmiş); `/projects/:slug` → `src/pages/ProjectDetailPage.tsx`; `*` (including an unknown `:slug`) → `<Navigate to="/" replace />`. There is no 404 page - it would require inventing Turkish copy. Pages live in `src/pages/`, sections and reusable pieces in `src/components/`, content in `src/data/`.

`ScrollToHash` (`src/components/ScrollToHash.tsx`) exists because React Router does not scroll to a `#hash` on navigation by itself. It watches `location.key` (not just `pathname`/`hash`) so clicking the same nav link twice re-scrolls both times, matching native anchor behaviour. Navbar links are **not** plain `<a href="#hakkimda">` - they are router `<Link to={{ pathname: '/', hash: '#hakkimda' }}>` on every route, so a link clicked from `/projects/dolfin` correctly returns to `/` and scrolls, instead of producing a dead `/projects/dolfin#hakkimda` URL.

`PageBackdrop` (`src/components/PageBackdrop.tsx`) is the site's single decorative gradient layer, rendered in `App.tsx` as the first child, outside `<Routes>`, so it is identical on every route. It is `absolute`, not `fixed`, positioned against `App.tsx`'s root `<div>` (`relative isolate`), so the gradient scrolls away with the page instead of re-painting at every scroll position. **Never add `overflow-hidden`, `transform`, `filter`, `backdrop-filter`, or `contain` to that root `<div>` or to any ancestor of the navbar or the profile card** - any of them changes the containing block for `position: sticky`/`position: absolute` descendants and will silently break the sticky navbar (`Navbar.tsx`, `sticky top-0`) and the sticky profile card (`Hero.tsx`, `lg:sticky lg:top-24`).

Each section in `src/components/` is a self-contained `<section>` that owns its own heading and spacing - there is no layout wrapper beyond the chrome above, and no state management.

**Section contract** - every section follows the same shape, and new sections must match it:

- an `id` with a Turkish slug, lowercase, no diacritics (`hakkimda`, `ozgecmis`, `projeler`, `iletisim` - the last is documentation of the naming convention only; the İletişim section itself no longer exists, see "What this is" above)
- `scroll-mt-20` so the sticky navbar does not overlap the heading on anchor jump
- `border-t border-line-subtle` between sections (Hero omits it, being first)
- heading followed by `<div className="mt-4 h-1 w-12 rounded bg-accent-base" />`
- `py-16` section padding, `mt-8` from the heading block to the body

**Adding a section requires two edits**: render it in `src/pages/HomePage.tsx` *and* add its anchor to `NAV_LINKS` in `src/data/navigation.ts`. The source of truth for navigation moved out of `Navbar.tsx` into that data file (six-owner-changes Task 3) specifically so `Footer.tsx` (via `FooterNav.tsx`) can import the same array instead of re-typing the anchors - both `Navbar.tsx` and `FooterNav.tsx` are pure consumers and need no edit when a section is added or removed. Removing a section is the same two edits in reverse: delete the render in `HomePage.tsx` **and** delete the entry from `NAV_LINKS`, or the navbar/footer keep a dead anchor. This two-edit rule is about **sections** specifically; adding a *project* needs neither edit (see "Adding a project" below), and project detail routes are deliberately not added to the navbar - the grid in Projeler is the only entry point.

`Footer.tsx` is rendered outside `<Routes>` but inside its own `max-w-7xl` wrapper, so it aligns with the content column without being part of the scroll sections and appears identically on `/` and every `/projects/<slug>` page. It is composed of a brand block, a contact block (from `CONTACT_ITEMS`/`SOCIAL_LINKS`, see below), `FooterNav.tsx` (two link columns - "Bölümler" from `NAV_LINKS`, "Projeler" from `PROJECTS`, so neither adding a project nor changing a section ever requires a footer edit), and `FooterWordmark.tsx` (a decorative, cursor-tracking wordmark - see "Component standards" for why it has no `motion` dependency). The navbar, `<main>` (in both `HomePage` and `ProjectDetailPage`), and the footer wrapper share one width token (`max-w-7xl`) and one horizontal-padding ramp (`px-6 sm:px-8 lg:px-10 xl:px-12`) - changing one without the others misaligns the page, and `src/App.test.tsx` enforces the invariant; the footer wrapper stays inside it rather than going full-bleed for exactly this reason.

## Adding a project

1. **Data** - add a `src/data/projects/<slug>.ts` file exporting one `ProjectInput` and register it in `PROJECT_INPUTS` in `src/data/projects/index.ts`: `slug` (lowercase, no diacritics), `title`, `subtitle`, `description` (Turkish, verbatim from the owner, never embellished), `technologies` (array, taken from the owner's own description of the stack - never invented), `screens` (`{ name, caption }[]`, one entry per screenshot, `caption` Turkish and verbatim from the owner, in narration order). `imageOrder` no longer exists - `screens[].name` is both the caption key and the narration order.
2. **Images** - create `src/assets/<slug>/` and drop the raw PNG screenshots in, then run `node scripts/optimize-images.mjs --delete` from the repo root. That resizes to 1600px wide, converts to WebP, prints a PSNR figure per file, and removes the originals. **Only `.webp` is globbed** - a leftover PNG is invisible to the site. **The folder name must equal the slug, lowercase** - `import.meta.glob` keys off it, and Linux build hosts (Vercel) are case-sensitive even though Windows is not. Never hardcode a filename anywhere.
3. **Cover image** - add `src/assets/profile<Slug>.webp`, flat in `src/assets/` (deliberately **outside** `src/assets/<slug>/`, so the screenshot glob pattern `'../assets/*/*.webp'` in `src/data/projectImages.ts`, which requires exactly one intervening directory, never picks it up). Register it in `src/data/projectCovers.ts` with its **true measured** `width`/`height` - covers are outside the sanctioned nominal-dimensions exception (see Images below). The cover is both the home-page mosaic card image and the detail page's LCP image; screenshots are the narrated walkthrough underneath and no longer serve either role.
4. **Ordering** - `screens[].name` are filename stems without the extension, in narration order - this is the detail-page walkthrough order only, not a cover/LCP designation. Every other image in the folder that has no matching `screens` entry is silently dropped from the walkthrough (graceful at runtime; caught loudly at test time - see step 7).
5. **Route** - nothing to do. `/projects/:slug` is dynamic and looks up the project by slug; an unknown slug redirects to `/`.
6. **`App.tsx` / `Navbar.tsx`** - nothing to do. The two-edit rule above applies to sections, not projects; the nav is a section list, not a project list.
7. **Display order** - the order of `PROJECT_INPUTS` is the home-page grid order. Route lookup is by slug, so reordering never changes a URL. `src/components/Projects.test.tsx` asserts the expected order, so update it deliberately when you reorder. **The mosaic is asymmetric, not uniform**: index 0 occupies the tall featured left cell (spanning two rows at `md:`+); indices 1..n stack in the right column, so a fourth project becomes a third right-column cell with no layout change needed. **Index 0's cover must be portrait (~3:4)**; every other cover should be landscape-to-square. Moving a project to index 0 without a portrait cover fails the portrait assertion in `src/data/projectCovers.test.ts`.
8. **Tests** - bump the expected counts in `src/data/projects/index.test.ts` (project count, slug list) and `src/components/Projects.test.tsx` (list items, hrefs), add the new project's verbatim description assertion, and add its cover to `src/data/projectCovers.test.ts`. Add the new project's `ProjectScreens.test.tsx`/`ProjectDetailPage.test.tsx` coverage as needed. **Set-equality guard**: `index.test.ts` asserts that `screens[].name` exactly matches the set of `.webp` stems on disk for each project, so adding, renaming, or deleting a screenshot without updating `screens` fails the suite instead of silently shipping an uncaptioned image.
9. **New screenshots** should be roughly 1.82:1 to match `PROJECT_IMAGE_WIDTH`/`PROJECT_IMAGE_HEIGHT` in `src/data/projectImages.ts`. This ratio is scoped to **screenshots only** - covers deliberately do not share it; a materially different screenshot ratio means revisiting those constants and the `aspect-project-cover` token together.
10. **Alt text** - screenshots are currently generated as `` `${project.title} ekran görüntüsü ${index + 1}` `` (see the Images section's sanctioned exception above); the real per-screenshot explanation lives in each screen's `caption`, rendered as a `<figcaption>`, and is never duplicated into `alt`. **Cover images render `alt=""` deliberately** - on the card the `<Link>`'s `aria-label` already carries the accessible name, and on the detail page the surrounding content does the same; no owner-supplied Turkish alt text exists for the covers yet. Real alt text for both covers and screenshots remains an owner-supplied improvement, not something an agent may invent.
11. Each project is its own `src/data/projects/<slug>.ts`, barrelled through `src/data/projects/index.ts` - add the file and register it in the barrel's `PROJECT_INPUTS` array.

## Per-route metadata

`src/components/RouteMeta.tsx` sets `document.title`, `<meta name="description">`, and the Open Graph / Twitter tags for the route that renders it. `HomePage` and `ProjectDetailPage` each render one. Values are **derived, never written by hand**: the home description is trimmed from `ABOUT_PARAGRAPHS[0]` in `Hero.tsx`, and a project description is that project first sentence (`firstSentence` in `src/lib/siteMeta.ts`, which deliberately does not cut at the dot in `.NET`). `og:image` is the profile photo on the home page and, on a detail page, the project's **cover asset** from `src/data/projectCovers.ts` (falling back to screenshot 0 if a project has no registered cover).

**Known limitation - do not report this as a bug.** These tags are applied by JavaScript after load. Crawlers that execute JS (Google) see them; social-preview scrapers (LinkedIn, X, Slack, WhatsApp) read the raw HTML response and never run scripts, so a shared link always shows the static defaults in `index.html`. Genuine per-route link previews require prerendering or SSG (e.g. `vite-plugin-ssg`, or moving to a framework that renders HTML per route) - a real change of architecture, not a tweak.

## Deployment

`vercel.json` rewrites every path to `/index.html`, so a direct hit or refresh on `/projects/*` (or any client-side route) does not 404 on Vercel's static hosting. Deleting it breaks every deep link while leaving local dev (`vite dev`/`vite preview`, which have their own SPA fallback) perfectly healthy - the failure only shows up on a real deploy, so do not remove this file without verifying on a preview deployment first.

## Component standards

- **Size limit: 150 lines per component file.** At ~120 lines, plan the split; past 150, extract a child component (for example a `ProjectCard` out of `Projects`). A long list is not an excuse - map over data instead of repeating JSX.
- One component per file, `export default function ComponentName()`, PascalCase filename matching the export.
- Function components only. No class components, no `React.FC`.
- Props typed with a local `type Props = { ... }` above the component. No `any`.
- Repeating content is rendered with `.map()` over a typed `const` array, using a stable `key` - never the array index when the list can reorder. **Owner-supplied content** (about paragraphs, projects, resume entries) lives in `src/data/`, not in the component: it is reused outside rendering (`HomePage` derives its meta description from `ABOUT_PARAGRAPHS`) and a component file exporting non-component values trips the `react/only-export-components` lint rule. Purely presentational lists with no reuse may stay at the top of the component file. `CONTACT_ITEMS` (`src/data/contact.ts`) and `SOCIAL_LINKS` (`src/data/social.ts`) are two such cases: both are consumed by two components each (`ContactList`/`Footer` and `SocialLinks`/`Footer`), so the record lives in `src/data/` and each component keeps its own presentation (markup/spacing are not shared - only the data is).
- Never fabricate biographical facts, employers, dates, project descriptions, metrics, or links. Use an explicit placeholder and report what real content the owner must supply.
- **No `motion`/`framer-motion`, no `lucide-react`.** Neither is installed, and this is deliberate, not an oversight - a future agent adapting a third-party component (e.g. `FooterWordmark.tsx`'s cursor-tracking effect) should not quietly reach for them. The repo's motion needs are met with plain CSS transitions and, where a value must change every animation frame (the wordmark's cursor-following mask), an imperative `ref.current.style.setProperty(...)` call in a `pointermove` listener - zero React re-renders, and no dependency for what a `@property`-registered custom property plus a CSS `transition` already does. Icons are the five-plus local inline SVGs in `src/components/icons/`, matching `MailIcon.tsx`'s convention (`viewBox="0 0 24 24"`, `stroke="currentColor"`, `aria-hidden="true"`, `focusable="false"`) - add a new one there rather than installing an icon package.

## Tailwind usage

This uses Tailwind v4 via the `@tailwindcss/vite` plugin, which works differently from v3:

- There is **no `tailwind.config.js` and no PostCSS config** - do not create them.
- `src/index.css` is a single `@import "tailwindcss";`. Theme customization (custom colors, fonts, spacing) goes in that file inside an `@theme { ... }` block, not in a JS config.
- The plugin is registered in `vite.config.ts` alongside `@vitejs/plugin-react`.

Style rules:

- **Utility-first, inline in JSX.** No `@apply`, no CSS modules, no styled-components, no inline `style` objects except for genuinely dynamic values.
- **Mobile-first.** Unprefixed classes describe the small screen; `sm:` / `md:` / `lg:` widen it. Never write desktop-first and patch downward.
- **Prefer the built-in scale** over arbitrary values. Reach for `[...]` only when the scale genuinely cannot express the value.
- Keep class order readable and consistent with existing files: layout, then box model, then typography, then color, then state variants.
- Reuse the established semantic palette rather than introducing new colors ad hoc: surfaces (`surface-base`, `surface-raised`, `surface-sunken`), lines (`line-subtle`, `line-strong`), ink (`ink-strong`, `ink-body`, `ink-muted`), accent (`accent-base`, `accent-hover`, `accent-active`), `focus`, and the gradient stops (`backdrop-from`, `backdrop-to`) - all defined in `src/index.css`. Names are role-based, not literal-color-based, on purpose: it is what makes a future `prefers-color-scheme` variant, or any further palette change, a one-file edit instead of a second full migration across every component. Do not introduce a new literal-colour token name (e.g. a `blue-*` or `slate-*` token); extend the semantic set instead. `src/theme.test.ts` guards against a `navy-*`/`accent-(300|400|600)` token literal surviving anywhere in `src/**/*.tsx` - do not delete that test to make a stray class quiet.

## Images

Every `<img>` must have, without exception:

- `loading="lazy"` and `decoding="async"`
- explicit `width` and `height` attributes matching the intrinsic pixel size of the asset, to reserve space and prevent layout shift (CLS)
- a meaningful `alt`, or `alt=""` when the image is purely decorative

The single permitted exception: a genuinely above-the-fold LCP image (such as the profile photo) may use `loading="eager"` with `fetchpriority="high"` - it still needs `width`, `height`, and `alt`.

**Sanctioned exception - project screenshots.** Project images (`src/assets/<slug>/*.webp`) are collected by a single `import.meta.glob` call in `src/data/projectImages.ts`, which yields hashed URL strings and no dimension metadata - the entire point of globbing is to avoid a per-file table that has to be hand-maintained every time a screenshot is added or renamed. Their `<img>` elements therefore carry the **nominal** shared constants `PROJECT_IMAGE_WIDTH` (1600) / `PROJECT_IMAGE_HEIGHT` (879) exported from that file, not per-file measured intrinsics. CLS is still genuinely prevented: every project image renders inside a fixed `aspect-project-cover` box (`@theme` token in `src/index.css`, ratio ~1.82:1) that reserves its height from CSS before the image loads, independent of what the `width`/`height` attributes say - so an approximate attribute cannot produce a shift. This is a deliberate, bounded exception to the "matching the intrinsic pixel size" rule above, and it applies **only** to globbed project screenshots consumed via `getProjectImages`; the profile photo and any other `<img>` added elsewhere still need true intrinsic `width`/`height`. Treat this as sanctioned, not as a defect to flag.

**Project cover images are explicitly outside this exception.** `src/data/projectCovers.ts` is a small hand-maintained table (three entries, one per project) carrying each cover's **true measured** `width`/`height`, not a nominal shared constant - there are few enough covers, and added rarely enough, that a per-file table does not rot the way it would for screenshots, and each cover's differing aspect ratio (portrait for the featured mosaic cell, landscape/near-square for the others) is load-bearing for the layout. Covers render `w-full h-auto` and must never be placed inside `aspect-project-cover`.

## Accessibility

- **Semantic HTML first**: `<section>`, `<nav>`, `<header>`, `<main>`, `<footer>`, `<ul>`/`<li>` for lists. `<a>` navigates, `<button>` acts - a clickable `<div>` is never acceptable.
- **Headings**: exactly one `<h1>` on the page (the Hero). Section titles are `<h2>`, subsections `<h3>`. Never skip a level to get a font size; that is what classes are for.
- **Alt text**: descriptive for meaningful images, `alt=""` for decorative ones. Never restate the filename or start with "resim" / "image of".
- **Contrast**: body text must clear WCAG AA 4.5:1; large text and UI borders 3:1. The page ground is not a single flat color in the first viewport - `PageBackdrop` paints a gradient from `backdrop-from` to `backdrop-to` - so measure text against **both gradient extremes**, not just `surface-base`. `ink-muted` clears 4.5:1 against `surface-base`/`surface-raised` but **fails** against `backdrop-from` (the gradient's bluest point, ~3.90:1) - use it only inside an opaque `surface-raised` container (a card) or below the gradient band, never as text sitting directly on the bare page ground within the first viewport.
- **Keyboard**: every interactive element is reachable and shows a visible focus ring (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus`). `focus` is a token decoupled from `accent-base` specifically so the ring's contrast can be tuned without dragging every accent-colored link along with it. Never remove an outline without replacing it.
- **Icon-only links** (social icons) need an accessible name via `aria-label` or visually hidden text.
- Do not add ARIA where native HTML already conveys the semantics - redundant ARIA is a defect, not a safety net.
- Touch targets should be at least ~44px in effective height.

### Navbar translucency contract

`Navbar.tsx` is scroll-adaptive (`data-nav-state="top" | "scrolled"`, threshold `NAV_SCROLL_THRESHOLD = 12` px of `scrollY`): fully transparent at the top of the page, `bg-surface-raised/90` with `backdrop-blur-sm` once scrolled. This exists because arbitrary content scrolls underneath it - the profile photo and three project cover screenshots are raster images that can contain near-black regions, and `backdrop-blur` averages neighbouring pixels without bounding darkness. **`ink-muted` is banned on the navbar** - it needs α ≈ 0.98 to stay AA-compliant against a worst-case dark composite, which no chosen translucency level can guarantee. Nav-link resting colour is `ink-body` or darker. The minimum-alpha floor measured against a worst-case dark composite, for reference:

| Nav text colour | Minimum α for AA 4.5:1 |
| --- | --- |
| `ink-strong` | ≈ 0.51 |
| `ink-body` (used) | ≈ 0.79 |
| `accent-hover` (hover state) | ≈ 0.83 |
| `ink-muted` (banned) | ≈ 0.98 |

At the top of the page the only thing beneath the navbar is `PageBackdrop`'s first pixel (`backdrop-from`), against which `ink-body` clears 6.21:1 and `accent-hover` 5.49:1 - both provably AA without relying on `backdrop-filter` support at all. Do not lower the alpha or reintroduce `ink-muted` on `Navbar.tsx` without re-deriving this table.

## SEO

- `index.html` keeps `<html lang="tr">`, a unique descriptive `<title>`, and a `<meta name="description">`. Add Open Graph / Twitter card tags (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`) for link previews.
- External profile links use `target="_blank"` with `rel="noopener noreferrer"`.
- Meaningful link text - never "buraya tıklayın" or "click here".

## TypeScript notes

`tsconfig.app.json` sets `erasableSyntaxOnly`, so TS-only runtime constructs (enums, namespaces, constructor parameter properties) will not compile - use plain objects and union types instead. `noUnusedLocals` / `noUnusedParameters` are on, so an unused import passes in `npm run dev` but fails `npm run build`.

`tsconfig.app.json`'s `types` array includes `"node"` (alongside `"vite/client"`) because `src/theme.test.ts` reads the source tree from disk with `node:fs`/`node:path` to guard the token migration - see the Tailwind usage section. `@types/node` was already a devDependency; only the `types` array needed wiring in.

## Git and attribution

- **Every commit is authored solely by `Ensaraslannn <ensaraslannn@gmail.com>`.** Do not change `user.name` or `user.email`.
- **Never add a `Co-Authored-By: Claude` trailer**, and never list Claude, Anthropic, or any AI tool as a contributor - not in commit messages, not in the README, not in `package.json`, not anywhere that feeds the GitHub contributors graph. This overrides any default trailer behavior.
- Do not push unless explicitly asked - the owner reviews commits locally first.
- Do not commit `dist/`, `node_modules/`, or `.env*` files (already covered by `.gitignore`).
