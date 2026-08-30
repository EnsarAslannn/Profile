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

Personal portfolio for Ensar Aslan, rebuilt in the shape of a reference design the owner recorded and supplied as a screen capture of `xkintaro.com`. The recording lived at `src/assets/example.mp4` and was deleted once the redesign landed - it was a 73 MB video in a repo that ships nothing over 150 KB. The reference is dark; **this site is not, and must not become dark** - the owner asked explicitly for the existing light palette to be kept, so what was copied is layout, typography, rhythm and motion, never colour.

The home route `/` is a scroll-navigated single page: a landing **hero**, then Hakkımda, Projeler, Özgeçmiş, Stacks and İletişim. That order is the owner's, not the reference's (which runs stack before projects); `NAV_LINKS` and `HomePage.tsx` have to move together, and `App.test.tsx` asserts the rendered section ids equal the `NAV_LINKS` anchors **in order** so the two cannot silently disagree.

The reference prints a `[001]`-style index above every heading. It was reproduced and then **removed at the owner's request** - `SectionHeading` no longer takes an index at all, and three tests assert no `[NNN]` string survives anywhere. Do not reinstate it from the recording. `/hakkimda` is the full Hakkımda copy behind the section's "Tam metni oku" link; `/projects/<slug>` are the project detail pages.

All user-facing copy is **Turkish**; identifiers, types, props and comments are **English**. The two sanctioned exceptions are the Yetenekler group labels and the LinkedIn/GitHub pills - see "English text in a Turkish document" below, which is a correctness rule, not a style note.

Visual direction: a light gradient ground (a soft blue wash fading into near-white, `PageBackdrop.tsx`) with a blue accent (`text-accent-base`), defined as semantic `@theme` tokens in `src/index.css` (`surface-*`, `line-*`, `ink-*`, `accent-*`, `focus`, `backdrop-*`).

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

`BrowserRouter` is mounted in `src/main.tsx`. `src/App.tsx` is the chrome shell: `PageBackdrop` + `ScrollToHash` + `Navbar` + `<Routes>` + `Contact`, with the navbar and the contact block rendered **outside** `<Routes>` so every route opens and ends the same way. **`App` requires a Router ancestor** - it throws if rendered bare, so tests render it (or any component using `<Link>`/`useLocation`) through `src/test/renderWithRouter.tsx`.

Routes: `/` → `src/pages/HomePage.tsx`; `/hakkimda` → `src/pages/AboutPage.tsx`; `/projects/:slug` → `src/pages/ProjectDetailPage.tsx`; `*` (including an unknown `:slug`) → `<Navigate to="/" replace />`. There is no 404 page - it would require inventing Turkish copy.

`Navbar.tsx` was **reinstated** for this redesign after having been removed in five-owner-changes Task 4; the owner asked for it back because the reference design has one. It is `sticky top-0`, links only, and deliberately **translucent**: `bg-surface-base/55` over `backdrop-blur-xl`, so the page ground reads through and the bar takes on whatever is behind it - the blue backdrop wash at the top, plain surface once that fades, a warm tint as a photo scrolls past. Measured at the bar: rgb(233,243,253) at the top, rgb(245,237,232) over the Brisa photo.

**That is also why the links are `ink-strong` and not `ink-body`.** With a translucent bar the text ground is whatever is passing underneath, and a full-page scan found a dark project card dropping `ink-body` to 3.91:1 - a real failure, invisible to the ordinary contrast sweep, which cannot see through a `backdrop-filter`. Scanning every scroll position with the bar text hidden puts the worst ground at rgb(151,151,157) and `ink-strong` at 6.15:1. Lowering the tint or lightening the links means re-running that scan. The reference's language switcher and theme toggle are deliberately **not** reproduced: this site has neither i18n nor a dark theme, and a control that does nothing is worse than no control - `Navbar.test.tsx` asserts the navbar contains zero buttons so neither creeps back as a placeholder. Its links are router `<Link to={{ pathname: '/', hash: '#projeler' }}>`, never bare `<a href="#projeler">`: clicked from `/projects/dolfin` a bare hash would produce the dead URL `/projects/dolfin#projeler`.

Because the navbar is sticky, **every section carries `scroll-mt-24`** (96px > the 65px bar). `scroll-mt-8` was correct only while there was no navbar; `App.test.tsx` pins the new value, because an anchor landing under the bar is invisible in unit tests and easy to miss by eye.

The İletişim rows live in `src/data/contactRows.ts`: e-posta, LinkedIn, GitHub, konum, each with its own icon. Every value is **resolved** from `CONTACT_ITEMS`/`SOCIAL_LINKS`, never re-typed - the profile rows show the handle the owner asked for (`/in/ensaraslannn`, `@EnsarAslannn`) cut from their own hrefs, so a URL changed in `src/data/social.ts` moves the visible text with it and a row can never show one account while linking to another. The phone number stays out (five-owner-changes Task 5 dropped it from the footer; it is on `/hakkimda` in ProfileCard) and `Contact.test.tsx` asserts it.

Two rows carry extras, both driven by data rather than by markup: `copyable` puts a `CopyButton` beside the e-mail address, and `note` prints the owner's remote-working note under konum. The e-mail row's `href` is **null on purpose** - the owner asked for the address to be copyable rather than clickable, so there is no mailto and no arrow button here. `CONTACT_ITEMS` still carries the mailto, which `ProfileCard` uses on `/hakkimda`; dropping it from this row must not drop it there, and a test asserts both halves. **`CopyButton` reports failure.** `navigator.clipboard` is undefined outside a secure context and rejects when permission is denied; both are ordinary, so the button says "kopyalanamadı" instead of showing a tick it did not earn. The outcome is announced through a polite live region, because an icon swap is invisible to a screen reader and a changing `aria-label` is announced unreliably.

The footer bar below the rows is an availability line (a `status-open` dot beside "Yeni fırsatlara açık"; the dot is `aria-hidden` because the sentence says the same thing, and its ping stops under `prefers-reduced-motion`) and a sentence-case copyright. The LinkedIn/GitHub/E-posta pills that used to sit there were removed at the owner's request: they duplicated three of the four rows directly above them.

`Contact.tsx` **replaces the old Footer entirely** - `Footer.tsx`, `FooterNav.tsx`, `FooterLinkRow.tsx` and `FooterWordmark.tsx` were all deleted in this round, the wordmark at the owner's explicit request. It renders a `<footer>` holding the `iletisim` section plus the copyright/social-pill bar. It owns the `iletisim` anchor, which is why `NAV_LINKS`' last entry resolves from any route.

`ScrollToHash` (`src/components/ScrollToHash.tsx`) exists because React Router does not scroll to a `#hash` by itself. It watches `location.key` (not just `pathname`/`hash`) so clicking the same section link twice re-scrolls both times.

`PageBackdrop` is the site's single decorative gradient layer, rendered in `App.tsx` as the first child, outside `<Routes>`. It is `absolute`, not `fixed`, positioned against `App.tsx`'s root `<div>` (`relative isolate`), so the gradient scrolls away with the page. **Never add `overflow-hidden`, `transform`, `filter`, `backdrop-filter` or `contain` to that root `<div>` or to any ancestor of the sticky profile card** (`AboutPage.tsx`, `lg:sticky lg:top-28`) - any of them changes the containing block for `position: sticky`/`absolute` descendants. The navbar's own `backdrop-blur` is fine: it is a sibling of both, never an ancestor.

**The content column is one exported constant**, `CONTENT_CONTAINER` in `src/lib/layout.ts`. It used to be a class string copy-pasted into `<main>` and the footer wrapper with a test comparing the two; the redesign made that untenable, because the `Marquee` strips are full-bleed and `<main>` can no longer be the padded box. Every padded block on every route now renders that one constant, so the alignment invariant is structural rather than asserted - `App.test.tsx` and `HomePage.test.tsx` check that the constant is what actually reaches the DOM.

**Section contract** - every section follows the same shape, and new sections must match it:

- an `id` with a Turkish slug, lowercase, no diacritics (`anasayfa`, `hakkimda`, `yetenekler`, `projeler`, `ozgecmis`, `iletisim`)
- `scroll-mt-24`, so an anchor jump clears the sticky navbar (see above)
- `border-t border-line-subtle` between sections (Hero omits it, being first)
- a `<SectionHeading index="00N" title="..." />` rather than a hand-written `<h2>` - it owns the kicker, the heading size and the optional italic subtitle, and it is why five sections cannot drift apart
- `data-reveal` on anything that should animate in (see "Reveal on load and on scroll")
- `py-20 sm:py-24` section padding

**Type scale** - one scale across every route, rewritten for the reference design's much larger headings:

| Level | Utilities | Used by |
| --- | --- | --- |
| hero `h1` | `text-[clamp(2.5rem,6.2vw,5.5rem)]` | the landing wordmark only |
| page `h1` | `text-4xl font-bold sm:text-5xl` | `/hakkimda`; a project's title on its detail page |
| `h2` | `text-4xl font-bold uppercase sm:text-5xl lg:text-6xl` | every section heading, via `SectionHeading` |
| `h3` | `text-xs font-semibold uppercase tracking-[0.2em]` | the Yetenekler group labels |

The hero wordmark uses a `clamp()` arbitrary value, which is the rare case the built-in scale genuinely cannot express: "ENSAR ASLAN" must stay on **one line** at every width (each line carries `whitespace-nowrap`), and a stepped scale wrapped it mid-name at `xl`. Never change a heading's **level** to get a size - the level carries the document outline a screen reader navigates by.

**Adding a section requires two edits**: render it in `src/pages/HomePage.tsx` *and* add its anchor to `NAV_LINKS` in `src/data/navigation.ts`. `NAV_LINKS` is the single source of truth for section navigation and its only consumer is `Navbar.tsx`. `src/App.test.tsx` asserts that the rendered section ids equal the `NAV_LINKS` anchors **in order**, so a section added in only one place fails the suite. The assertion lives in `App.test.tsx` rather than `HomePage.test.tsx` because `iletisim` is rendered by `App`, not by the page. This rule is about **sections**; adding a *project* needs neither edit.

## Yetenekler

`src/data/skills.ts` + `src/components/Skills.tsx`. The heading reads **Stacks** (owner's request, renamed from Yetenekler) and so does the navbar label, but the anchor stays `#yetenekler`: section slugs are Turkish by the section contract, and changing it would break any link already shared. The heading is the one `h2` on the site carrying `lang="en"`. **Every entry must already be vouched for elsewhere in the repo** - in `ABOUT_PARAGRAPHS` or in a project's repo-sourced `technologies`/`description`. `src/components/Skills.test.tsx` enforces exactly that and fails on a skill invented here and nowhere else (`Git` is the one allowlisted exception, evidenced by the repos themselves). It caught a stray `REST API` on its first run - that is the test working, not a nuisance.

**No proficiency levels, ever** - no percentages, bars, star ratings or "N years' experience". The owner has supplied no such figure, so any of them would be a number this repo made up. A test asserts none appear.

**No intro paragraph**, and the six group labels are **English** (`Languages & Frameworks`, `Architecture & Patterns`, `Data & Caching`, `Messaging & Background Jobs`, `Frontend`, `Testing & DevOps`) - both at the owner's request and both pinned by `Skills.test.tsx`.

The layout is a `<dl>`: the group label sits to the **left** of its technologies from `sm:` up, not above them (owner's request) - which is what a description list means, and the same shape `ProjectTechnologies` already uses on the detail pages. Below `sm:` the pair stacks, because two ~170px columns break "Vertical Slice Architecture" across four lines. **A name shows a real brand logo or nothing.** `src/data/techLogos.ts` maps technology names to the owner-supplied SVGs in `src/assets/icons/`, and `logosFirst()` sorts the ones that have a logo to the front of their group (owner's request; the sort is stable, so everything else keeps its editorial order). An earlier round stood a made-up monogram tile in for the missing logos and the owner had it removed, so **"nothing" must stay an option** - no substitute artwork, no inline SVG drawn from memory. `Skills.test.tsx` allows a single `<img>` child per entry and no `<svg>` at all.

The map is keyed by **exact** name, and that is load-bearing: the stack contains names that contain other names. "Git" is a prefix of "GitHub Actions" and "React Router" starts with "React" - a `startsWith` or substring lookup would put the Git mark on GitHub Actions.

**`react-native-1.svg` is deliberately unused.** It is the React *Native* logo and the words are part of the artwork; beside "React" it would make the page claim a framework the owner lists nowhere. React has no logo until a plain one is supplied, and a test pins that.

The logos render at a fixed height with free width, capped at `max-w-10`. The set runs from square marks to very wide wordmarks (axios is 2500x372): a square box shrinks those to an illegible sliver, and an uncapped width lets them run 160px. Height is what reserves the space, so the `width`/`height` attributes cannot cause a shift.

The reference also shows a floating preview card on hover. It is **not** reproduced: it is hover-only (invisible on touch) and would mean one absolutely-positioned card per entry.

Both the group labels and the technology names carry `lang="en"` - the labels because they are CSS-uppercased, the names because a Turkish speech synthesiser reading "Entity Framework Core" is not what those words are.

## The CV download

`public/EnsarAslanCV.pdf`, linked from the hero's third call to action as a plain `<a href download>` - not a router `<Link>`, and not a Vite import. It is a static file, and bundling it through the asset pipeline would hash the filename, which is the one thing a CV must not have: people expect it to land in their downloads folder called something recognisable.

The path is a literal string in `src/data/hero.ts`, so **neither TypeScript nor Vite can tell you when it breaks**. `src/data/hero.test.ts` reads the file off disk and checks the `%PDF-` magic bytes instead, which is what stops the button quietly becoming a 404.

**Replacing it is a content change, not a file copy.** The version that ships must be the one the owner supplied; an older CV on a portfolio is worse than none, and the two differ in ways that are easy to miss (title, which projects are listed, which technologies). Render page 1 and read it before overwriting.

## Özgeçmiş card backgrounds

Each timeline card carries the owner's photograph for that year (`src/assets/2020.webp` … `2025.webp`), keyed **by year** in `src/data/resume.ts` - not by entry id or array position, so reordering the groups cannot pair 2024's card with 2025's photograph. `background` is optional and `RoadmapCard` renders a plain card without one.

**The 45% opacity plus `saturate(1.7)` is a contrast budget, not a taste setting.** Text sits directly on the wash, so the ceiling is whatever keeps the *darkest pixel the wash can produce* above the floor for every colour on the card. It was measured by sweeping real rendered pixels, never reasoned about from the photo: 0.50 puts the worst pixel at ink-strong 4.40:1, under the floor; 0.45 measures 5.24-5.75:1 across the four cards and carries roughly 2.5x the on-screen colour a first, much fainter 0.14 wash did.

**Every line on the card is `ink-strong`, and that is what bought the opacity.** The organisation line used to be accent-coloured and the dates `ink-body`; at this strength no lighter ink clears 4.5:1, so the hierarchy is carried by size and weight instead. The chip needs its own opaque ground for the same reason. Putting any colour back means lowering the opacity again.

Raising it means re-measuring the **rendered pixels**. The site-wide contrast sweep cannot catch a regression here: it compares text against the parent's `background-color` and knows nothing about an image behind it.

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

`src/components/RouteMeta.tsx` sets `document.title`, `<meta name="description">`, and the Open Graph / Twitter tags for the route that renders it. `HomePage`, `AboutPage` and `ProjectDetailPage` each render one. Values are **derived, never written by hand**: the home and Hakkımda descriptions are trimmed from `ABOUT_PARAGRAPHS[0]`, and a project description is that project first sentence (`firstSentence` in `src/lib/siteMeta.ts`, which deliberately does not cut at the dot in `.NET`). `og:image` is the profile photo on the home page and, on a detail page, the project's **cover asset** from `src/data/projectCovers.ts` (falling back to screenshot 0 if a project has no registered cover).

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
- **No `motion`/`framer-motion`, no `lucide-react`.** Neither is installed, and this is deliberate, not an oversight. This site's motion is a reference-design redesign with a hero gallery, two marquees and a blur-and-lift reveal on every section, and all of it is plain CSS - `@theme --animate-*` keyframes plus one attribute the reveal hook flips. If that much motion did not need an animation library, the next thing does not either. Icons are the five-plus local inline SVGs in `src/components/icons/`, matching `MailIcon.tsx`'s convention (`viewBox="0 0 24 24"`, `stroke="currentColor"`, `aria-hidden="true"`, `focusable="false"`) - add a new one there rather than installing an icon package.

**There is no shadcn/ui in this repo, and adding it is not a small step.** No `components.json`, no `@/` alias, no `clsx`/`tailwind-merge`/`class-variance-authority`, no `lib/utils.ts`. `shadcn init` would install `lucide-react` (banned above), claim `src/index.css` for its own base layer and token set - the file that carries every measured contrast figure on this site - and add a path alias nothing else uses. When a component arrives written for that structure, port the *effect* into this one instead. `GlowButton` (below) is what that looks like in practice.

## The pill CTA

`src/components/ui/GlowButton.tsx` is the site's action button - the hero's "İletişime geç" and "CV indir", and a project's "Projeyi aç". It is the owner-supplied shadcn-style `button-ui.tsx` rewritten for this stack: `"use client"` dropped (a Next.js directive), the dark-theme colours (`bg-white/15`, `bg-gray-900/80`, a white sweep) mapped onto `accent-*`, and the `@keyframes` lifted out of an inline `<style>` tag into the `--animate-glow-spin` `@theme` token, because a `<style>` tag re-declares them once per instance and cannot carry a `motion-reduce:` variant.

**It renders the interactive element itself rather than wrapping one**, and that is structural, not stylistic. The rim needs `overflow-hidden` to clip the rotating sweep, and `overflow: hidden` clips a *descendant's* outline - so a decorative `<div>` wrapped around a `<Link>` would swallow the focus ring. An element's own overflow cannot clip its own outline, so the clipping and the focus ring have to live on the same box. `GlowButton.test.tsx` pins that pairing.

`isolate` is the other load-bearing utility: inside a stacking context an element's own background paints before its negative-z children, so `-z-10` puts the sweep *over* the pale rim and *under* the opaque face. Drop `isolate` and the sweep disappears behind the page.

Applied to the pill CTAs only. Deliberately **not** applied to the text links ("Projeleri keşfet", "Tam metni oku", "Geri"), the navbar (`Navbar.test.tsx` asserts zero buttons), `CopyButton`, or `SocialLinks` - a permanently rotating glow around a 40px icon affordance is noise, and a ring around a bare inline link has no pill to ring.

## Reveal on load and on scroll

The page fades, lifts and un-blurs its content in as you arrive at it - on first paint for anything above the fold, and on scroll for everything below. Two pieces, and no library:

- `src/lib/useReveal.ts` decides **when**. `useReveal()` returns a ref for a *container*; the effect finds every `[data-reveal]` inside it and flips each to `data-reveal="in"` once its top passes 92% of the viewport height. One hook call covers a whole route, which is why it is mounted on `<main>` in all three pages and on `<footer>` in `Contact.tsx` (the contact block renders outside `<Routes>`, so a page's ref never reaches it).
- The `[data-reveal]` rules in `src/index.css` decide **what** - opacity, `translateY`, a 6px blur, one 600ms transition, and the `prefers-reduced-motion` opt-out. Per-element timing is a utility, `[--reveal-delay:160ms]`; `revealDelayClass(index)` returns those literals for mapped lists.

**The revealed state sets `filter: none`, never `blur(0)`.** Any non-none filter value makes the element a containing block for absolutely-positioned and sticky descendants - the same trap `transform` carries - so `blur(0)` would silently and permanently change layout under every revealed element. Interpolating a filter list to `none` is well-defined, so the blur still eases out; it just leaves nothing behind.

**Do not swap the scroll sweep back to an `IntersectionObserver`.** It was one, and it was wrong: an observer only fires when an element's intersection *state changes*, so jumping from the top of the page to the bottom in a single frame - a nav anchor, the End key, a flung touchpad - takes everything in between from below the fold to above it without ever intersecting, and its callback never runs. Measured before the fix: **8 of 17 elements permanently invisible** after one such jump. The sweep asks "has this been reached yet?" instead of "is it on screen right now?". It is passive, coalesced into one animation frame, and removes its own listeners once nothing is pending.

Two details that look incidental and are not: the first sweep waits **two** animation frames (one is not enough - both `useEffect` and a single `rAF` still run before the first paint, so the hidden state would never be painted and above-the-fold content would snap in), and the fallback in an environment without the APIs **fails open**, revealing everything, because the hidden state lives in CSS and failing closed means a blank page.

**Adding a revealed element**: put a bare `data-reveal` on it and make sure some ancestor calls `useReveal()`. Never put it on an ancestor of the sticky profile card - it applies both a transform and a filter - which is why `ProfileCard` marks its own root rather than the `lg:sticky` wrapper around it, and why `AboutPage.test.tsx` asserts the sticky wrapper has no `[data-reveal]` ancestor.

## Marquee and the hero gallery

Two looping animations, both defined as `@theme --animate-*` tokens in `src/index.css` (`animate-marquee-x`, `animate-drift-up`, `animate-drift-down`) so they stay real Tailwind utilities and compose with `motion-reduce:animate-none`.

**Every track renders its content twice and travels exactly 50%.** That is one mechanism, not two independent choices: at -50% the second copy sits precisely where the first started, so the wrap is invisible. Changing the copy count or the distance alone produces a visible jump - `Marquee.test.tsx` pins the doubling for this reason.

`Marquee.tsx` is `aria-hidden` and very low contrast, deliberately: it is duplicated decorative texture, and WCAG 1.4.3's decorative-text exemption applies. **Its words are not slogans someone wrote.** The reference runs the owner's personal mottos there and nobody supplied mottos, so `src/data/marquee.ts` is one line: the Yetenekler technologies, flattened in section order. That is derived, never re-typed - the strip cannot drift out of step with the section it leads into, and it inherits `Skills.test.tsx`'s vouching rule for free, since a technology has to be backed up elsewhere in the repo before it can appear anywhere.

The strip is CSS-uppercased and every entry is an English product name, so it carries `lang="en"`. Without it: ARCHİTECTURE, TESTCONTAİNERS.

`HeroGallery.tsx` is likewise `aria-hidden` with `alt=""` throughout: the owner's name is the page `h1` and both screenshots are real content in Projeler, so the collage adds nothing a screen reader would miss - and every tile appears twice.

Its tiles carry **no fixed aspect ratio and no `object-fit` at all** - each is exactly as tall as its image, so every image fills its card edge to edge with nothing cropped and nothing letterboxed. Tiles therefore differ in height, which the owner asked for explicitly after two rounds: uniform squares with `object-cover` cropped the images, and uniform squares with `object-contain` letterboxed them. The six images run from a 0.75 portrait to a 1.83 screenshot, so **no single box can hold all of them without doing one or the other** - the only way to show them whole and undistorted is to let the box follow the image.

`h-auto` beside the true `width`/`height` attributes is what reserves the right space from the intrinsic ratio before the image decodes, so nothing shifts. A browser check asserts zero rendered-vs-natural aspect-ratio mismatches across all rendered tiles.

The **left column's order is the owner's own**, written by image id rather than by index into `HERO_IMAGES` so reordering that array cannot silently reshuffle the columns. The right column is the same sequence rotated by half its length, which makes the two maximally out of phase: no position holds the same image in both, so a picture never sits beside a copy of itself. `HeroGallery.test.tsx` pins that *property* rather than the literal sequence, so a future reorder is caught instead of quietly lining the columns up.

**Both marquee durations are coupled to their content length.** Each track travels half its own size, so adding tiles or technologies lengthens the track and, at a fixed duration, speeds the animation up. Measure px/s, not seconds, when changing either: the columns run 95s / ~15 px/s and the word strip 115s / ~73 px/s. Both were re-tuned at the owner's request more than once, and both grew longer in the same rounds - the seconds moved much further than the perceived speed did.

## English text in a Turkish document

`index.html` sets `lang="tr"`. CSS `text-transform: uppercase` is **locale-aware**, and Turkish maps `i` → `İ`. So any English string rendered through an `uppercase` utility comes out wrong unless the element declares `lang="en"`:

```
Architecture -> ARCHİTECTURE      LinkedIn -> LİNKEDIN
Testing      -> TESTİNG           GitHub   -> GİTHUB
```

This has shipped twice already (the Yetenekler group labels, then the contact pills) because it is **invisible in jsdom** - there is no layout and no text-transform - and easy to miss in a screenshot. `src/components/englishLabels.test.tsx` now guards it structurally: every English label the UI renders must sit inside a `lang="en"` scope, and every Turkish `h2` must **not**, because "İletişim" → "İLETİŞİM" is correct precisely when the locale is Turkish. `TextSegment` carries an optional `lang` for the same reason.

Add a new English label ⇒ add `lang="en"` **and** add it to `ENGLISH_LABELS` in that test.

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

**Root-level photos.** `scripts/optimize-images.mjs` only sweeps `src/assets/<slug>/` project folders. The timeline photographs and the profile photo live at the root of `src/assets` and are converted by hand to the same standard - 1200px wide, WebP q80, originals deleted. The four timeline PNGs came in at 4.1 MB and left at 282 KB; do not commit a multi-megabyte PNG because the script did not pick it up.

The three README screenshots (`anasayfa`, `projeler`, `deneyim`) are the same rule with one difference: **1600px, not 1200px**, because they are wide UI captures and the navbar and button labels in them have to stay readable. They came in as 3.6 MB of PNG and ship as 153 KB of WebP. Nothing imports them - they are referenced by relative path from `README.md` / `README.en.md`, which is why they sit at the root of `src/assets` rather than in a project folder, and why the `*.webp` glob never sees them. GitHub has rendered WebP since 2022, so the format costs nothing there. Re-shoot them after any visible redesign; a README showing the previous look is worse than one showing none.

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
- Two things are deliberately low-contrast and `aria-hidden`, and WCAG 1.4.3's decorative-text exemption applies to both: the `Marquee` word strip and the ghost year behind each Özgeçmiş card. Each duplicates text that is on the page for real - the marquee's words come from the Hakkımda copy, the ghost year sits behind the same year in ink-strong. Do not "fix" their contrast. Everything else is held to the floor: a full-page contrast sweep of every visible text node on `/`, `/hakkimda` and `/projects/dolfin` must come back clean.

## SEO

- `index.html` keeps `<html lang="tr">`, a unique descriptive `<title>`, and a `<meta name="description">`. Add Open Graph / Twitter card tags (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`) for link previews.
- External profile links use `target="_blank"` with `rel="noopener noreferrer"`.
- Meaningful link text - never "buraya tıklayın" or "click here".

## TypeScript notes

`tsconfig.app.json` sets `erasableSyntaxOnly`, so TS-only runtime constructs (enums, namespaces, constructor parameter properties) will not compile - use plain objects and union types instead. `noUnusedLocals` / `noUnusedParameters` are on, so an unused import passes in `npm run dev` but fails `npm run build`.

`tsconfig.app.json`'s `types` array includes `"node"` (alongside `"vite/client"`) because `src/theme.test.ts` reads the source tree from disk with `node:fs`/`node:path` to guard the token migration - see the Tailwind usage section. `@types/node` was already a devDependency; only the `types` array needed wiring in.

## The two READMEs

`README.md` is Turkish and `README.en.md` is English, and each opens with a flag-emoji switcher linking to the other. They are the same document in two languages - **a change to one is a change to both**, and a reader landing on the English one from the switcher should not find it a version behind.

They are deliberately short: the intro sentence, the live link, three screenshots, and a table of the main technologies. Nothing else. Setup steps, the directory tour and the engineering rationale were all in there once and the owner had them taken out - this file is where that material belongs, and a README that repeats it only gives it a second place to go stale.

## Git and attribution

- **Every commit is authored solely by `Ensaraslannn <ensaraslannn@gmail.com>`.** Do not change `user.name` or `user.email`.
- **Never add a `Co-Authored-By: Claude` trailer**, and never list Claude, Anthropic, or any AI tool as a contributor - not in commit messages, not in the README, not in `package.json`, not anywhere that feeds the GitHub contributors graph. This overrides any default trailer behavior.
- Do not push unless explicitly asked - the owner reviews commits locally first.
- Do not commit `dist/`, `node_modules/`, or `.env*` files (already covered by `.gitignore`).
