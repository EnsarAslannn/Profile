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

Personal portfolio for Ensar Aslan. The home route `/` is a scroll-navigated single page; project detail pages live at `/projects/<slug>` behind a client-side router (`react-router-dom`). All user-facing copy is **Turkish**; identifiers, types, props, and comments are **English**. Content is no longer entirely placeholder: Hakkımda, Projeler, Özgeçmiş and Yetenekler carry real owner-supplied content. There is no longer a separate İletişim section - it was removed (six-owner-changes Task 4); contact details (e-posta, telefon, konum) live in `ProfileCard` (inside Hero) and in `Footer`. The footer surfaces e-posta and konum on every route; the phone number appears only in `ProfileCard`, i.e. only on `/` (five-owner-changes Task 5 dropped the footer's `tel:` row).

Visual direction: a light gradient ground (a soft blue wash fading into near-white, `PageBackdrop.tsx`) with a blue accent (`text-accent-base`), defined as semantic `@theme` tokens in `src/index.css` (`surface-*`, `line-*`, `ink-*`, `accent-*`, `focus`, `backdrop-*`). Modeled on cyze.dev.

## Agent workflow

Non-trivial UI work runs through four agents defined in `.claude/agents/`, in this order:

**planner → ui-agent → builder → reviewer**

| Agent | Model | Skill | Owns | Writes code? |
| --- | --- | --- | --- | --- |
| `planner` | opus | `writing-plans` | Architecture and content organization: which components exist, data shapes, section order, heading hierarchy | No |
| `ui-agent` | sonnet | `ui-ux-pro-max` | Design and Tailwind decisions: exact class strings, spacing rhythm, breakpoints, `@theme` tokens in `src/index.css` | Tokens only |
| `builder` | sonnet | `tdd` | Component implementation test-first (red → green → refactor), wiring into `App.tsx` / `HomePage.tsx`, making the build pass | Yes - the only one |
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

`BrowserRouter` is mounted in `src/main.tsx`. `src/App.tsx` is the chrome shell: `ScrollToHash` + `<Routes>` + the footer wrapper, rendered outside `<Routes>` so chrome is identical on every route. There is no navbar - it was removed at the owner's request (five-owner-changes Task 4); `FooterNav` is the site's only in-page section navigation. **`App` requires a Router ancestor** - it throws if rendered bare, so tests render it (or any component that uses `<Link>`/`useLocation`) through `src/test/renderWithRouter.tsx`, which wraps the tree in a `MemoryRouter` at a given route.

Routes: `/` → `src/pages/HomePage.tsx` (the single-page body, in order: Hero, Projeler, Özgeçmiş, Yetenekler); `/projects/:slug` → `src/pages/ProjectDetailPage.tsx`; `*` (including an unknown `:slug`) → `<Navigate to="/" replace />`. There is no 404 page - it would require inventing Turkish copy. Pages live in `src/pages/`, sections and reusable pieces in `src/components/`, content in `src/data/`.

`ScrollToHash` (`src/components/ScrollToHash.tsx`) exists because React Router does not scroll to a `#hash` on navigation by itself. It watches `location.key` (not just `pathname`/`hash`) so clicking the same footer section link twice re-scrolls both times, matching native anchor behaviour. The footer's section links (`FooterNav.tsx`) are **not** plain `<a href="#hakkimda">` - they are router `<Link to={{ pathname: '/', hash: '#hakkimda' }}>` on every route, so a link clicked from `/projects/dolfin` correctly returns to `/` and scrolls, instead of producing a dead `/projects/dolfin#hakkimda` URL.

`PageBackdrop` (`src/components/PageBackdrop.tsx`) is the site's single decorative gradient layer, rendered in `App.tsx` as the first child, outside `<Routes>`, so it is identical on every route. It is `absolute`, not `fixed`, positioned against `App.tsx`'s root `<div>` (`relative isolate`), so the gradient scrolls away with the page instead of re-painting at every scroll position. **Never add `overflow-hidden`, `transform`, `filter`, `backdrop-filter`, or `contain` to that root `<div>` or to any ancestor of the sticky profile card** - any of them changes the containing block for `position: sticky`/`position: absolute` descendants and will silently break the sticky profile card (`Hero.tsx`, `lg:sticky lg:top-24`). The footer card (`Footer.tsx`) is a permitted exception to this ban: it carries its own `overflow-hidden` to crop `FooterWordmark`, but it is not an ancestor of the profile card, so nothing above breaks.

Each section in `src/components/` is a self-contained `<section>` that owns its own heading and spacing - there is no layout wrapper beyond the chrome above, and no state management.

**Section contract** - every section follows the same shape, and new sections must match it:

- an `id` with a Turkish slug, lowercase, no diacritics (`hakkimda`, `projeler`, `ozgecmis`, `yetenekler`, `iletisim` - the last is documentation of the naming convention only; the İletişim section itself no longer exists, see "What this is" above)
- a scroll margin (`scroll-mt-8`) so an anchor jump does not land the heading flush against the viewport top
- `border-t border-line-subtle` between sections (Hero omits it, being first)
- a bare `data-reveal` on the section heading (see "Reveal on load and on scroll"), so a new section arrives the same way every existing one does
- `py-16` section padding, and a single top-margin utility carrying the heading-to-body gap (there is no intermediate element between the heading and the body block; `ui-agent` owns the value)

**Type scale** - one scale across both routes, three steps, each a clear step down from the last (measured: 36/48px, 30/36px, 20/24px):

| Level | Utilities | Used by |
| --- | --- | --- |
| `h1` | `text-4xl font-bold sm:text-5xl` | Hakkımda; a project's title on its detail page |
| `h2` | `text-3xl font-bold sm:text-4xl` | every section heading (Projeler, Özgeçmiş, Yetenekler, Ekranlar) |
| `h3` | `text-xl font-bold sm:text-2xl` | subsection headings inside a section (Eğitim, Deneyim) |

Özgeçmiş renders its two groups **side by side from `md:` up** - Eğitim left, Deneyim right (owner's request), stacked below that; `Resume.test.tsx` pins the grid and the column order. A subsection heading must stay visibly **smaller** than the section heading above it - the owner asked for the step back after a round where `h3` matched `h2` and the hierarchy read flat; `src/components/Resume.test.tsx` pins it. Smaller labels inside a card (`Skills.tsx`'s group names, `ProjectTechnologies.tsx`'s `<dt>`) are deliberately outside this scale: they are labels, not headings in the page's outline, and use `text-xs`/`text-sm` uppercase instead. Never change a heading's **level** to get a size - the level carries the document outline a screen reader navigates by.

**Adding a section requires two edits**: render it in `src/pages/HomePage.tsx` *and* add its anchor to `NAV_LINKS` in `src/data/navigation.ts`. `NAV_LINKS` is the single source of truth for section navigation; its only consumer is `FooterNav.tsx` (there is no navbar - it was removed at the owner's request, five-owner-changes Task 4). Removing a section is the same two edits in reverse: delete the render in `HomePage.tsx` **and** delete the entry from `NAV_LINKS`, or the footer keeps a dead anchor. `src/pages/HomePage.test.tsx` enforces set-equality between the rendered section ids and `NAV_LINKS`, so a section added in only one place fails the suite instead of shipping silently. This rule is about **sections** specifically; adding a *project* needs neither edit (see "Adding a project" below), and project detail routes are deliberately not linked from navigation - the grid in Projeler is the only entry point.

`Footer.tsx` is rendered outside `<Routes>` but inside its own `max-w-7xl` wrapper, so it aligns with the content column without being part of the scroll sections and appears identically on `/` and every `/projects/<slug>` page. It is a meta strip on the bare page ground (konum from `CONTACT_ITEMS`, and the copyright line - relocated here from the card, five-owner-changes Task 5) followed by a rounded gradient card. The card holds `FooterNav.tsx` (one centred row of `NAV_LINKS`, no headings - the "Projeler" column was dropped, since the project grid is the only entry point to a project), `FooterLinkRow.tsx` (LinkedIn / GitHub / E-posta only, hrefs resolved from `SOCIAL_LINKS`/`CONTACT_ITEMS` - the row is links, no buttons; the "Yukarı çık" `BackToTopButton` was removed at the owner's request and `FooterLinkRow.test.tsx` asserts the row contains zero buttons so it does not creep back), and `FooterWordmark.tsx` (oversized, its bottom half cropped by the card's own `overflow-hidden` - see the `PageBackdrop` warning above for why this is a permitted exception). `<main>` (in both `HomePage` and `ProjectDetailPage`) and the footer wrapper share one width token (`max-w-7xl`) and one horizontal-padding ramp (`px-6 sm:px-8 lg:px-10 xl:px-12`) - changing one without the others misaligns the page, and `src/App.test.tsx` enforces the invariant; the footer wrapper stays inside it rather than going full-bleed for exactly this reason.

## Yetenekler

`src/data/skills.ts` + `src/components/Skills.tsx`, the last section before the footer. **Every entry must already be vouched for elsewhere in the repo** - in `ABOUT_PARAGRAPHS` or in a project's repo-sourced `technologies`/`description`. `src/components/Skills.test.tsx` enforces exactly that and fails on a skill invented here and nowhere else (`Git` is the one allowlisted exception, evidenced by the repos themselves). It caught a stray `REST API` on the first run - that is the test working, not a nuisance.

**No proficiency levels, ever** - no percentages, bars, star ratings, or "N years' experience". The owner has supplied no such figure, so any of them would be a number this repo made up. The reference design the owner shared had percentage bars and they were deliberately not reproduced; a test asserts none appear.

**No intro paragraph**, and the six group labels are **English** (`Languages & Frameworks`, `Architecture & Patterns`, `Data & Caching`, `Messaging & Background Jobs`, `Frontend`, `Testing & DevOps`) - both at the owner's request, and both pinned by `Skills.test.tsx` so a later "restore the Turkish copy" pass has to be a deliberate decision. This is the one sanctioned exception to the Turkish-copy rule in "What this is"; the section heading itself stays *Yetenekler*.

Each label `<h3>` carries **`lang="en"`, and that attribute is load-bearing**: the document is `lang="tr"`, CSS `text-transform: uppercase` is locale-aware, and Turkish maps `i` -> `İ` - so an untagged "Architecture" renders as **ARCHİTECTURE**. Removing the attribute silently reintroduces the dotted capital I in three of the six labels. It also stops a screen reader pronouncing the labels as Turkish.

## Adding a project

1. **Data** - add a `src/data/projects/<slug>.ts` file exporting one `ProjectInput` and register it in `PROJECT_INPUTS` in `src/data/projects/index.ts`: `slug` (lowercase, no diacritics), `title`, `subtitle`, `liveUrl` (optional - the project's public demo, `https`, no trailing slash; omit it and the detail page simply renders no demo button), `description` (Turkish, **an array of paragraphs**; `description[0]` must stand alone as a summary of the whole project, because `RouteMeta` trims it into the route's meta description), `technologies` (a `TechGroup[]` - `{ label, items }`, grouped **Backend / Frontend / Test / Deployment** in that order; see below), `screens` (`{ name, caption }[]`, one entry per screenshot, `caption` Turkish and verbatim from the owner, in narration order). `imageOrder` no longer exists - `screens[].name` is both the caption key and the narration order.

   **The demo link lives only on the detail page.** `liveUrl` is rendered as one accent button under the subtitle in `ProjectDetailPage.tsx`, `target="_blank"` + `rel="noopener noreferrer"`. It is deliberately **not** on the home-page mosaic card: the whole card is already one `<Link>`, and a second anchor inside it would nest interactive elements - invalid HTML, and a keyboard trap in the card's tab order.

   **`technologies` and `description` have their own sourcing rule.** These are the two project fields not taken verbatim from the owner's chat prose: at the owner's request both are written from that project's own GitHub repo under `github.com/EnsarAslannn` - the README (its "Kullanılan Teknolojiler" section, its feature and architecture prose) cross-checked against the real manifests (`*.csproj` `PackageReference`, `package.json` dependencies, `.github/workflows/*`). Each project file carries a `// Source:` comment naming exactly what was read. The READMEs are themselves owner-written, which is what makes this sourcing legitimate rather than invention - it does not extend to anything the repo does not say. **Never infer an entry from what a project of that kind usually uses**; if it is not in the repo, it does not go in the list. Groups render through `src/components/ProjectTechnologies.tsx` as a `<dl>` (label → entries), so a new group label needs no component change - but `src/data/projects/index.test.ts` pins the four labels and their order, so adding a fifth is a deliberate edit there too.
2. **Images** - create `src/assets/<slug>/` and drop the raw PNG screenshots in, then run `node scripts/optimize-images.mjs --delete` from the repo root. That resizes to 1600px wide, converts to WebP, prints a PSNR figure per file, and removes the originals. **Only `.webp` is globbed** - a leftover PNG is invisible to the site. **The folder name must equal the slug, lowercase** - `import.meta.glob` keys off it, and Linux build hosts (Vercel) are case-sensitive even though Windows is not. Never hardcode a filename anywhere.
3. **Cover image** - add `src/assets/profile<Slug>.webp`, flat in `src/assets/` (deliberately **outside** `src/assets/<slug>/`, so the screenshot glob pattern `'../assets/*/*.webp'` in `src/data/projectImages.ts`, which requires exactly one intervening directory, never picks it up). Register it in `src/data/projectCovers.ts` with its **true measured** `width`/`height` - covers are outside the sanctioned nominal-dimensions exception (see Images below). The cover is both the home-page mosaic card image and the detail page's LCP image; screenshots are the narrated walkthrough underneath and no longer serve either role.
4. **Ordering** - `screens[].name` are filename stems without the extension, in narration order - this is the detail-page walkthrough order only, not a cover/LCP designation. Every other image in the folder that has no matching `screens` entry is silently dropped from the walkthrough (graceful at runtime; caught loudly at test time - see step 7).
5. **Route** - nothing to do. `/projects/:slug` is dynamic and looks up the project by slug; an unknown slug redirects to `/`.
6. **`App.tsx` / `NAV_LINKS`** - nothing to do. The two-edit rule above applies to sections, not projects; the nav is a section list, not a project list.
7. **Display order** - the order of `PROJECT_INPUTS` is the home-page grid order. Route lookup is by slug, so reordering never changes a URL. `src/components/Projects.test.tsx` asserts the expected order, so update it deliberately when you reorder. **The mosaic is asymmetric, not uniform**: index 0 occupies the tall featured left cell (spanning two rows at `md:`+); indices 1..n stack in the right column, so a fourth project becomes a third right-column cell with no layout change needed. **Index 0's cover must be portrait (~3:4)** - not because the silhouette dictates the layout (it no longer does - see Images below), but because the featured cell is roughly two rows tall, so a landscape cover centre-cropped into it would lose almost everything; every other cover should be landscape-to-square. Moving a project to index 0 without a portrait cover fails the portrait assertion in `src/data/projectCovers.test.ts`.
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
- **No `motion`/`framer-motion`, no `lucide-react`.** Neither is installed, and this is deliberate, not an oversight - a future agent adapting a third-party component (e.g. `FooterWordmark.tsx`'s cursor-tracking effect) should not quietly reach for them. The repo's motion needs are met with plain CSS transitions and, where a value must change every animation frame (the wordmark's cursor-following mask), an imperative `ref.current.style.setProperty(...)` call in a `pointermove` listener - zero React re-renders, and no dependency for what a `@property`-registered custom property plus a CSS `transition` already does. The one shared motion primitive is the reveal system below. Icons are the five-plus local inline SVGs in `src/components/icons/`, matching `MailIcon.tsx`'s convention (`viewBox="0 0 24 24"`, `stroke="currentColor"`, `aria-hidden="true"`, `focusable="false"`) - add a new one there rather than installing an icon package.

## Reveal on load and on scroll

The page fades and lifts its content in as you arrive at it - on first paint for anything above the fold, and on scroll for everything below. Two pieces, and no library:

- `src/lib/useReveal.ts` decides **when**. `useReveal()` returns a ref for a *container*; the effect finds every `[data-reveal]` inside it and flips each to `data-reveal="in"` once its top passes 92% of the viewport height. One hook call covers a whole route, which is why it is mounted on `<main>` in both pages and on `<footer>` in `Footer.tsx` (the footer renders outside `<Routes>`, so a page's ref never reaches it).
- The `[data-reveal]` rules in `src/index.css` decide **what** - opacity + `translateY`, one 600ms transition, and the `prefers-reduced-motion` opt-out. Per-element timing is a utility, `[--reveal-delay:160ms]`; `revealDelayClass(index)` returns those literals for mapped lists (staggering the mosaic cards, the two Özgeçmiş columns, the six Yetenekler cards).

**Do not swap the scroll sweep back to an `IntersectionObserver`.** It was one, and it was wrong: an observer only fires when an element's intersection *state changes*, so jumping from the top of the page to the bottom in a single frame - a footer anchor, the End key, a flung touchpad - takes everything in between from below the fold to above it without ever intersecting, and its callback never runs. Measured before the fix: **8 of 17 elements permanently invisible** after one such jump. The sweep asks "has this been reached yet?" instead of "is it on screen right now?", which is the question the page actually cares about. It is passive, coalesced into one animation frame, and removes its own listeners once nothing is pending.

Two details that look incidental and are not: the first sweep waits **two** animation frames (one is not enough - both `useEffect` and a single `rAF` still run before the first paint, so the hidden state would never be painted and above-the-fold content would snap in with no animation), and the fallback in a browser or test environment without the APIs **fails open**, revealing everything, because the hidden state lives in CSS and failing closed means a blank page.

**Adding a revealed element**: put a bare `data-reveal` on it and make sure some ancestor calls `useReveal()` - nothing else. Never put it on an ancestor of the sticky profile card (it applies a `transform`; see the `PageBackdrop` warning above), which is why `Hero.tsx` marks `ProfileCard`'s own root rather than the `lg:sticky` wrapper around it.

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

**Project cover images are explicitly outside this exception.** `src/data/projectCovers.ts` is a small hand-maintained table (three entries, one per project) carrying each cover's **true measured** `width`/`height`, not a nominal shared constant - there are few enough covers, and added rarely enough, that a per-file table does not rot the way it would for screenshots. Covers keep their true measured `width`/`height` in that table - it is still hand-maintained and still outside the nominal-dimensions exception. Below the mosaic breakpoint (`md:`) a cover renders at its natural ratio, uncropped. At `md:` and up the mosaic grid (`Projects.tsx`) defines two explicit equal rows and every cover fills its cell with `object-cover` (`ProjectCard.tsx`), so every cover is cropped: the mosaic's cell geometry is now load-bearing, not the covers' silhouettes. CLS is prevented by the grid's definite row height (an `aspect-[]` utility on the `<ul>`), which reserves space from CSS before any image loads - the intrinsic `width`/`height` attributes are retained for the natural-ratio mobile rendering and for the detail page's LCP figure, where they still do the reserving. Covers still never use `aspect-project-cover`: that token is the screenshot ratio (~1.82:1) and has nothing to do with the mosaic cell ratio.

## Accessibility

- **Semantic HTML first**: `<section>`, `<nav>`, `<header>`, `<main>`, `<footer>`, `<ul>`/`<li>` for lists. `<a>` navigates, `<button>` acts - a clickable `<div>` is never acceptable.
- **Headings**: exactly one `<h1>` on the page (the Hero). Section titles are `<h2>`, subsections `<h3>`. Never skip a level to get a font size; that is what classes are for.
- **Alt text**: descriptive for meaningful images, `alt=""` for decorative ones. Never restate the filename or start with "resim" / "image of".
- **Contrast**: body text must clear WCAG AA 4.5:1; large text and UI borders 3:1. The page ground is not a single flat color in the first viewport - `PageBackdrop` paints a gradient from `backdrop-from` to `backdrop-to` - so measure text against **both gradient extremes**, not just `surface-base`. `ink-muted` clears 4.5:1 against `surface-base`/`surface-raised` but **fails** against `backdrop-from` (the gradient's bluest point, ~3.90:1) - use it only inside an opaque `surface-raised` container (a card) or below the gradient band, never as text sitting directly on the bare page ground within the first viewport.
- **Keyboard**: every interactive element is reachable and shows a visible focus ring (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus`). `focus` is a token decoupled from `accent-base` specifically so the ring's contrast can be tuned without dragging every accent-colored link along with it. Never remove an outline without replacing it.
- **Icon-only links** (social icons) need an accessible name via `aria-label` or visually hidden text.
- Do not add ARIA where native HTML already conveys the semantics - redundant ARIA is a defect, not a safety net.
- Touch targets should be at least ~44px in effective height.
- The footer wordmark (`FooterWordmark.tsx`) is deliberately low-contrast and `aria-hidden`. It is pure decoration and duplicates the owner's name, which appears as real text in the footer's meta strip - WCAG 1.4.3's decorative-text exemption applies. Do not "fix" its contrast.

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
