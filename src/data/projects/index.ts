// Content here is owner-supplied and verbatim (Turkish project copy). Do not
// edit, embellish, or add fields (tech-stack chips, dates, repo links) without
// the owner - see CLAUDE.md's no-fabrication rule.
//
// Split into one file per project (this barrel plus <slug>.ts) once the data
// crossed the ~120-line threshold that a single projects.ts file allowed -
// see CLAUDE.md's "Adding a project" step 10. Importers still write
// `from '../data/projects'`, which resolves to this index.ts unchanged.
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
  caption: string
}

export type ProjectScreen = {
  name: string
  src: string
  caption: string | undefined
}

export type Project = {
  slug: string
  title: string
  subtitle: string
  description: string
  technologies: readonly string[]
  cover: ProjectCover | undefined
  screens: ProjectScreen[]
}

export type ProjectInput = {
  slug: string
  title: string
  subtitle: string
  description: string
  technologies: readonly string[]
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
function buildScreens(slug: string, inputs: readonly ProjectScreenInput[]): ProjectScreen[] {
  const captionsByName = new Map(inputs.map((input) => [input.name, input.caption]))
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

export const PROJECTS: Project[] = PROJECT_INPUTS.map((input) => ({
  slug: input.slug,
  title: input.title,
  subtitle: input.subtitle,
  description: input.description,
  technologies: input.technologies,
  cover: getProjectCover(input.slug),
  screens: buildScreens(input.slug, input.screens),
}))

export function getProjectBySlug(slug: string | undefined): Project | undefined {
  if (!slug) return undefined
  return PROJECTS.find((project) => project.slug === slug)
}
