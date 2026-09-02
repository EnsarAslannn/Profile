import { DEFAULT_LANGUAGE, type Language } from '../i18n/language'
import { UI } from '../i18n/ui'

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

export function getProjectImageAlt(
  projectTitle: string,
  index: number,
  language: Language = DEFAULT_LANGUAGE,
): string {
  return UI[language].projectScreenshot(projectTitle, index + 1)
}
