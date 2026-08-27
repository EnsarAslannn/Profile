// Project screenshots are collected with a single import.meta.glob call
// instead of one import per file, so dropping a new WebP into
// src/assets/<slug>/ never requires a code change here.
//
// The glob only yields hashed URL strings, not image dimensions, so the two
// exported dimension constants below are NOMINAL (1600x879), not measured
// per file. CLS is actually reserved by the fixed aspect-ratio wrapper
// (--aspect-project-cover in src/index.css), which does not depend on the
// image at all - this is the sanctioned exception documented in CLAUDE.md's
// Images section.
export type ProjectImage = {
  name: string
  src: string
}

export const PROJECT_IMAGE_WIDTH = 1600
export const PROJECT_IMAGE_HEIGHT = 879

const IMAGE_MODULES = import.meta.glob<string>('../assets/*/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

type ImagesByFolder = Record<string, ProjectImage[]>

function collectImagesByFolder(): ImagesByFolder {
  const grouped: ImagesByFolder = {}
  for (const [path, src] of Object.entries(IMAGE_MODULES)) {
    const match = /\.\.\/assets\/([^/]+)\/([^/.]+)\.webp$/.exec(path)
    if (!match) continue
    const [, folder, name] = match
    grouped[folder] ??= []
    grouped[folder].push({ name, src })
  }
  for (const images of Object.values(grouped)) {
    images.sort((a, b) => a.name.localeCompare(b.name))
  }
  return grouped
}

const IMAGES_BY_FOLDER = collectImagesByFolder()

export function getProjectImages(folder: string, preferredOrder: readonly string[]): ProjectImage[] {
  const images = IMAGES_BY_FOLDER[folder]
  if (!images) return []

  const byName = new Map(images.map((image) => [image.name, image]))
  const ordered: ProjectImage[] = []
  const used = new Set<string>()

  for (const name of preferredOrder) {
    const image = byName.get(name)
    if (image && !used.has(name)) {
      ordered.push(image)
      used.add(name)
    }
  }

  for (const image of images) {
    if (!used.has(image.name)) {
      ordered.push(image)
      used.add(image.name)
    }
  }

  return ordered
}

// Alt text for a screenshot. One call site: ProjectScreens (the detail-page
// walkthrough). Index is zero-based; the rendered text is 1-based. Interim
// until the owner supplies real per-screenshot Turkish alt text. Project
// covers do not use this - they are decorative (alt="") because the card
// link carries the accessible name.
export function getProjectImageAlt(projectTitle: string, index: number): string {
  return `${projectTitle} ekran görüntüsü ${index + 1}`
}
