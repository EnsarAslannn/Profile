import type { Project } from '../data/projects'
import type { Language } from '../i18n/language'
import { withLanguage } from '../i18n/localizedPath'
import { SITE_NAME, SITE_URL, firstSentence } from './siteMeta'

export type JsonLd = Record<string, unknown>

const absolute = (basePath: string, language: Language) =>
  `${SITE_URL}${withLanguage(basePath, language)}`

export function projectJsonLd(project: Project, language: Language, image: string): JsonLd {
  const url = absolute(`/projects/${project.slug}`, language)

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.title,
    alternateName: project.subtitle,
    description: firstSentence(project.description[0]),
    url,
    image,
    inLanguage: language,
    keywords: project.technologies.flatMap((group) => [...group.items]).join(', '),
    author: {
      '@type': 'Person',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    ...(project.repoUrl ? { codeRepository: project.repoUrl } : {}),
    ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
  }
}

export function projectBreadcrumbJsonLd(project: Project, language: Language): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: SITE_NAME,
        item: absolute('/', language),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: project.title,
        item: absolute(`/projects/${project.slug}`, language),
      },
    ],
  }
}
