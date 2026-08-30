// Content here is owner-supplied and verbatim (Turkish project copy). Do not
// edit, embellish, or add fields (dates, repo links, metrics) without the
// owner - see CLAUDE.md's no-fabrication rule.
//
// `technologies` is the one field with a second sanctioned source: the
// owner asked for it to be filled from their own GitHub repos, so each entry
// traces to that repo's README plus its real manifests. That is still not a
// licence to infer - see the TechGroup comment below.
//
// Split into one file per project (this barrel plus <slug>.ts) once the data
// crossed the ~120-line threshold that a single projects.ts file allowed -
// see CLAUDE.md's "Adding a project" step 10. Importers still write
// `from '../data/projects'`, which resolves to this index.ts unchanged.
import { DEFAULT_LANGUAGE, type Language, type Localized } from '../../i18n/language'
import { getProjectImages } from '../projectImages'
import { getProjectCover, type ProjectCover } from '../projectCovers'
import { takeauction } from './takeauction'
import { altitudelog } from './altitudelog'
import { dolfin } from './dolfin'

// One screenshot's filename stem (no extension) plus its owner-supplied
// Turkish caption, in narration order - the order this array is written in
// IS the walkthrough order on the detail page.
export type ProjectScreenInput = {
  name: string
  caption: Localized<string>
}

export type ProjectScreen = {
  name: string
  src: string
  caption: string | undefined
}

// A project's stack, grouped the way the project's own README groups it
// (Backend / Frontend / Test / Deployment). Grouped rather than one flat array
// because the full stack of these projects runs past twenty entries, and a
// single dot-separated run of twenty names is a wall, not a list.
//
// Every entry is verified against that repo: the README's own
// "Kullanılan Teknolojiler" section plus the real manifests (*.csproj
// PackageReference, package.json dependencies, .github/workflows). Nothing
// here is inferred from what a project of this kind usually uses - if it is
// not in the repo, it does not go in this list.
export type TechGroup = {
  label: string
  items: readonly string[]
}

export type Project = {
  slug: string
  title: string
  subtitle: string
  liveUrl: string | undefined
  description: readonly string[]
  technologies: readonly TechGroup[]
  cover: ProjectCover | undefined
  screens: ProjectScreen[]
}

// What translates and what does not, in one place:
//
//  - `title` does not. DOLFIN, TakeAuction and AltitudELog are product names.
//  - `slug` and `liveUrl` do not. They are addresses.
//  - `technologies` does not. Every entry is a proper noun taken from the
//    project's own repo, and translating "Entity Framework Core" would be
//    inventing a product that does not exist. The four group labels
//    (Backend / Frontend / Test / Deployment) are already English and read
//    the same to a Turkish developer.
//  - `subtitle`, `description` and each screen's `caption` do. They are the
//    prose.
export type ProjectInput = {
  slug: string
  title: string
  subtitle: Localized<string>
  liveUrl?: string
  description: Localized<readonly string[]>
  technologies: readonly TechGroup[]
  screens: readonly ProjectScreenInput[]
}

// Array order is the GRID DISPLAY order on the home page. Route lookup is by
// slug (getProjectBySlug), so reordering here never affects any URL.
//
// The asset folder name under src/assets/ equals `slug` - one identifier,
// one thing to get right when adding a project. See "Adding a project" in
// CLAUDE.md.
//
// Index 0 is the tall, featured left cell in the mosaic (Projects.tsx /
// ProjectCard.tsx) and REQUIRES a portrait cover (src/data/projectCovers.ts
// guards this - see the portrait assertion in projectCovers.test.ts).
// dolfin's cover is portrait, so it leads; the others stack in the right
// column in this order.
const PROJECT_INPUTS: ProjectInput[] = [dolfin, takeauction, altitudelog]

/**
 * Resolves a project's screen inputs (name + caption, narration order)
 * against the images actually found on disk. A caption whose image was
 * renamed or deleted silently vanishes (getProjectImages already drops
 * unknown preferredOrder names); an image with no matching caption still
 * renders, just without a <figcaption>. src/data/projects/index.test.ts'
 * set-equality assertion is what turns either mismatch into a loud,
 * build-time failure instead of a silent content gap.
 */
function buildScreens(
  slug: string,
  inputs: readonly ProjectScreenInput[],
  language: Language,
): ProjectScreen[] {
  const captionsByName = new Map(inputs.map((input) => [input.name, input.caption[language]]))
  const images = getProjectImages(
    slug,
    inputs.map((input) => input.name),
  )
  return images.map((image) => ({
    name: image.name,
    src: image.src,
    caption: captionsByName.get(image.name),
  }))
}

// Both languages are resolved once, at module load, rather than on each
// render: the work is a handful of array maps over static data, and a
// component that reads PROJECTS[language] then needs no memo of its own.
const resolve = (language: Language): Project[] =>
  PROJECT_INPUTS.map((input) => ({
    slug: input.slug,
    title: input.title,
    subtitle: input.subtitle[language],
    liveUrl: input.liveUrl,
    description: input.description[language],
    technologies: input.technologies,
    cover: getProjectCover(input.slug),
    screens: buildScreens(input.slug, input.screens, language),
  }))

export const PROJECTS: Localized<Project[]> = {
  tr: resolve('tr'),
  en: resolve('en'),
}

// The language defaults rather than being required, so a caller that has no
// business knowing about languages - a test asserting a slug, say - does not
// have to pass one. Route lookup is by slug in both languages: the URLs are
// identical, and only the copy inside changes.
export function getProjectBySlug(
  slug: string | undefined,
  language: Language = DEFAULT_LANGUAGE,
): Project | undefined {
  if (!slug) return undefined
  return PROJECTS[language].find((project) => project.slug === slug)
}
