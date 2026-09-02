import { DEFAULT_LANGUAGE, type Language, type Localized } from '../../i18n/language'
import { getProjectImages } from '../projectImages'
import { getProjectCover, type ProjectCover } from '../projectCovers'
import { takeauction } from './takeauction'
import { altitudelog } from './altitudelog'
import { dolfin } from './dolfin'

export type ProjectScreenInput = {
  name: string
  caption: Localized<string>
}

export type ProjectScreen = {
  name: string
  src: string
  caption: string | undefined
}

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

export type ProjectInput = {
  slug: string
  title: string
  subtitle: Localized<string>
  liveUrl?: string
  description: Localized<readonly string[]>
  technologies: readonly TechGroup[]
  screens: readonly ProjectScreenInput[]
}

const PROJECT_INPUTS: ProjectInput[] = [dolfin, takeauction, altitudelog]

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

export function getProjectBySlug(
  slug: string | undefined,
  language: Language = DEFAULT_LANGUAGE,
): Project | undefined {
  if (!slug) return undefined
  return PROJECTS[language].find((project) => project.slug === slug)
}
