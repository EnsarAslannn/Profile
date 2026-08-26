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

Vitest globals are **off** - import `describe` / `it` / `expect` from `vitest` explicitly. `passWithNoTests` is currently `true` because the repo ships with no tests yet; flip it to `false` in `vitest.config.ts` once a real suite exists, so a broken `include` glob fails instead of silently passing.

## What this is

Personal portfolio for Ensar Aslan. The home route `/` is a scroll-navigated single page; project detail pages live at `/projects/<slug>` behind a client-side router (`react-router-dom`). All user-facing copy is **Turkish**; identifiers, types, props, and comments are **English**. Content is no longer entirely placeholder: Hakkımda and Projeler carry real owner-supplied content, while Özgeçmiş and İletişim remain skeletons.

Visual direction: dark navy ground (`bg-navy-950`) with a warm brass accent (`text-accent-400`), defined as `@theme` tokens in `src/index.css`. Modeled on cyze.dev.

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

Routes: `/` → `src/pages/HomePage.tsx` (the former single-page body: Hero, Resume, Projects, Contact, unchanged); `/projects/:slug` → `src/pages/ProjectDetailPage.tsx`; `*` (including an unknown `:slug`) → `<Navigate to="/" replace />`. There is no 404 page - it would require inventing Turkish copy. Pages live in `src/pages/`, sections and reusable pieces in `src/components/`, content in `src/data/`.

`ScrollToHash` (`src/components/ScrollToHash.tsx`) exists because React Router does not scroll to a `#hash` on navigation by itself. It watches `location.key` (not just `pathname`/`hash`) so clicking the same nav link twice re-scrolls both times, matching native anchor behaviour. Navbar links are **not** plain `<a href="#hakkimda">` - they are router `<Link to={{ pathname: '/', hash: '#hakkimda' }}>` on every route, so a link clicked from `/projects/dolfin` correctly returns to `/` and scrolls, instead of producing a dead `/projects/dolfin#hakkimda` URL.

Each section in `src/components/` is a self-contained `<section>` that owns its own heading and spacing - there is no layout wrapper beyond the chrome above, and no state management.

**Section contract** - every section follows the same shape, and new sections must match it:

- an `id` with a Turkish slug, lowercase, no diacritics (`hakkimda`, `ozgecmis`, `projeler`, `iletisim`)
- `scroll-mt-20` so the sticky navbar does not overlap the heading on anchor jump
- `border-t border-neutral-800` between sections (Hero omits it, being first)
- heading followed by `<div className="mt-4 h-1 w-12 rounded bg-amber-400" />`
- `py-16` section padding, `mt-8` from the heading block to the body

**Adding a section requires two edits**: render it in `src/pages/HomePage.tsx` *and* add its anchor to the `links` array at the top of `src/components/Navbar.tsx`. The navbar builds itself from that array - it is the single source of truth for navigation, so a section added in only one place is silently unreachable. This two-edit rule is about **sections** specifically; adding a *project* needs neither edit (see "Adding a project" below), and project detail routes are deliberately not added to the navbar - the grid in Projeler is the only entry point.

`Footer.tsx` is rendered outside `<Routes>` but inside its own `max-w-7xl` wrapper, so it aligns with the content column without being part of the scroll sections. The navbar, `<main>` (in both `HomePage` and `ProjectDetailPage`), and the footer wrapper share one width token (`max-w-7xl`) and one horizontal-padding ramp (`px-6 sm:px-8 lg:px-10 xl:px-12`) - changing one without the others misaligns the page, and `src/App.test.tsx` enforces the invariant.

## Adding a project

1. **Data** - add an entry to `PROJECT_INPUTS` in `src/data/projects.ts`: `slug` (lowercase, no diacritics), `title`, `subtitle`, `description` (Turkish, verbatim from the owner, never embellished), `imageOrder`.
2. **Images** - create `src/assets/<slug>/` and drop the raw PNG screenshots in, then run `node scripts/optimize-images.mjs --delete` from the repo root. That resizes to 1600px wide, converts to WebP, prints a PSNR figure per file, and removes the originals. **Only `.webp` is globbed** - a leftover PNG is invisible to the site. **The folder name must equal the slug, lowercase** - `import.meta.glob` keys off it, and Linux build hosts (Vercel) are case-sensitive even though Windows is not. Never hardcode a filename anywhere.
3. **Ordering** - names in `imageOrder` are filename stems without the extension. They come first, in that order; every other image in the folder follows alphabetically. **Image 0 is both the grid card cover and the detail page's LCP image**, so put the best screenshot first. The current default is `['homePage', 'homePage2']`.
4. **Route** - nothing to do. `/projects/:slug` is dynamic and looks up the project by slug; an unknown slug redirects to `/`.
5. **`App.tsx` / `Navbar.tsx`** - nothing to do. The two-edit rule above applies to sections, not projects; the nav is a section list, not a project list.
6. **Display order** - the order of `PROJECT_INPUTS` is the home-page grid order. Route lookup is by slug, so reordering never changes a URL. `src/components/Projects.test.tsx` asserts the expected order, so update it deliberately when you reorder.
7. **Tests** - bump the expected counts in `src/data/projects.test.ts` (project count, slug list) and `src/components/Projects.test.tsx` (list items, hrefs), and add the new project's verbatim description assertion.
8. **New screenshots** should be roughly 1.82:1 to match `PROJECT_IMAGE_WIDTH`/`PROJECT_IMAGE_HEIGHT` in `src/data/projectImages.ts`; a materially different ratio means revisiting those constants and the `aspect-project-cover` token together.
9. **Alt text** is currently generated as `` `${project.title} ekran görüntüsü ${index + 1}` `` (see the Images section's sanctioned exception above). Real per-image Turkish alt text is an owner-supplied improvement, not something an agent may invent.
10. If `src/data/projects.ts` approaches 120 lines, split to `src/data/projects/<slug>.ts` with a barrel - not needed at three projects.

## Per-route metadata

`src/components/RouteMeta.tsx` sets `document.title`, `<meta name="description">`, and the Open Graph / Twitter tags for the route that renders it. `HomePage` and `ProjectDetailPage` each render one. Values are **derived, never written by hand**: the home description is trimmed from `ABOUT_PARAGRAPHS[0]` in `Hero.tsx`, and a project description is that project first sentence (`firstSentence` in `src/lib/siteMeta.ts`, which deliberately does not cut at the dot in `.NET`). `og:image` is the profile photo on the home page and the project cover (image 0) on a detail page.

**Known limitation - do not report this as a bug.** These tags are applied by JavaScript after load. Crawlers that execute JS (Google) see them; social-preview scrapers (LinkedIn, X, Slack, WhatsApp) read the raw HTML response and never run scripts, so a shared link always shows the static defaults in `index.html`. Genuine per-route link previews require prerendering or SSG (e.g. `vite-plugin-ssg`, or moving to a framework that renders HTML per route) - a real change of architecture, not a tweak.

## Deployment

`vercel.json` rewrites every path to `/index.html`, so a direct hit or refresh on `/projects/*` (or any client-side route) does not 404 on Vercel's static hosting. Deleting it breaks every deep link while leaving local dev (`vite dev`/`vite preview`, which have their own SPA fallback) perfectly healthy - the failure only shows up on a real deploy, so do not remove this file without verifying on a preview deployment first.

## Component standards

- **Size limit: 150 lines per component file.** At ~120 lines, plan the split; past 150, extract a child component (for example a `ProjectCard` out of `Projects`). A long list is not an excuse - map over data instead of repeating JSX.
- One component per file, `export default function ComponentName()`, PascalCase filename matching the export.
- Function components only. No class components, no `React.FC`.
- Props typed with a local `type Props = { ... }` above the component. No `any`.
- Repeating content (projects, jobs, skills) lives in a typed `const` array at the top of the file and is rendered with `.map()` using a stable `key` - never the array index when the list can reorder.
- Never fabricate biographical facts, employers, dates, project descriptions, metrics, or links. Use an explicit placeholder and report what real content the owner must supply.

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
- Reuse the established palette (`neutral-950/800/400/300/100`, `amber-400`) rather than introducing new colors ad hoc. New colors go through `ui-agent` and land in `@theme`.

## Images

Every `<img>` must have, without exception:

- `loading="lazy"` and `decoding="async"`
- explicit `width` and `height` attributes matching the intrinsic pixel size of the asset, to reserve space and prevent layout shift (CLS)
- a meaningful `alt`, or `alt=""` when the image is purely decorative

The single permitted exception: a genuinely above-the-fold LCP image (such as the profile photo) may use `loading="eager"` with `fetchpriority="high"` - it still needs `width`, `height`, and `alt`.

**Sanctioned exception - project screenshots.** Project images (`src/assets/<slug>/*.png`) are collected by a single `import.meta.glob` call in `src/data/projectImages.ts`, which yields hashed URL strings and no dimension metadata - the entire point of globbing is to avoid a per-file table that has to be hand-maintained every time a screenshot is added or renamed. Their `<img>` elements therefore carry the **nominal** shared constants `PROJECT_IMAGE_WIDTH` (2530) / `PROJECT_IMAGE_HEIGHT` (1390) exported from that file, not per-file measured intrinsics. CLS is still genuinely prevented: every project image renders inside a fixed `aspect-project-cover` box (`@theme` token in `src/index.css`, ratio ~1.82:1) that reserves its height from CSS before the image loads, independent of what the `width`/`height` attributes say - so an approximate attribute cannot produce a shift. This is a deliberate, bounded exception to the "matching the intrinsic pixel size" rule above, and it applies **only** to globbed project screenshots consumed via `getProjectImages`; the profile photo and any other `<img>` added elsewhere still need true intrinsic `width`/`height`. Treat this as sanctioned, not as a defect to flag.

## Accessibility

- **Semantic HTML first**: `<section>`, `<nav>`, `<header>`, `<main>`, `<footer>`, `<ul>`/`<li>` for lists. `<a>` navigates, `<button>` acts - a clickable `<div>` is never acceptable.
- **Headings**: exactly one `<h1>` on the page (the Hero). Section titles are `<h2>`, subsections `<h3>`. Never skip a level to get a font size; that is what classes are for.
- **Alt text**: descriptive for meaningful images, `alt=""` for decorative ones. Never restate the filename or start with "resim" / "image of".
- **Contrast** against `bg-neutral-950`: body text must clear WCAG AA 4.5:1; large text and UI borders 3:1. `text-neutral-500` on near-black is borderline - use it only for de-emphasized footer text, never body copy.
- **Keyboard**: every interactive element is reachable and shows a visible focus ring (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400`). Never remove an outline without replacing it.
- **Icon-only links** (social icons) need an accessible name via `aria-label` or visually hidden text.
- Do not add ARIA where native HTML already conveys the semantics - redundant ARIA is a defect, not a safety net.
- Touch targets should be at least ~44px in effective height.

## SEO

- `index.html` keeps `<html lang="tr">`, a unique descriptive `<title>`, and a `<meta name="description">`. Add Open Graph / Twitter card tags (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`) for link previews.
- External profile links use `target="_blank"` with `rel="noopener noreferrer"`.
- Meaningful link text - never "buraya tıklayın" or "click here".

## TypeScript notes

`tsconfig.app.json` sets `erasableSyntaxOnly`, so TS-only runtime constructs (enums, namespaces, constructor parameter properties) will not compile - use plain objects and union types instead. `noUnusedLocals` / `noUnusedParameters` are on, so an unused import passes in `npm run dev` but fails `npm run build`.

## Git and attribution

- **Every commit is authored solely by `Ensaraslannn <ensaraslannn@gmail.com>`.** Do not change `user.name` or `user.email`.
- **Never add a `Co-Authored-By: Claude` trailer**, and never list Claude, Anthropic, or any AI tool as a contributor - not in commit messages, not in the README, not in `package.json`, not anywhere that feeds the GitHub contributors graph. This overrides any default trailer behavior.
- Do not push unless explicitly asked - the owner reviews commits locally first.
- Do not commit `dist/`, `node_modules/`, or `.env*` files (already covered by `.gitignore`).
