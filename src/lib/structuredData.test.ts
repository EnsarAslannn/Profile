import { describe, expect, it } from 'vitest'
import { projectBreadcrumbJsonLd, projectJsonLd } from './structuredData'
import { PROJECTS } from '../data/projects'
import { LANGUAGES } from '../i18n/language'
import { SITE_NAME, SITE_URL } from './siteMeta'

const IMAGE = `${SITE_URL}/og-dolfin.jpg`
const dolfin = () => PROJECTS.tr.find((project) => project.slug === 'dolfin')!

describe('projectJsonLd', () => {
  it('describes the project with the same values the page renders', () => {
    const project = dolfin()
    const data = projectJsonLd(project, 'tr', IMAGE)

    expect(data['@type']).toBe('SoftwareSourceCode')
    expect(data.name).toBe(project.title)
    expect(data.alternateName).toBe(project.subtitle)
    expect(data.url).toBe(`${SITE_URL}/projects/dolfin`)
    expect(data.image).toBe(IMAGE)
    expect(data.codeRepository).toBe(project.repoUrl)
    expect(data.sameAs).toBe(project.liveUrl)
    expect(data.author).toEqual({
      '@type': 'Person',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    })
  })

  it('cuts the description at the first sentence, and not at the dot in .NET', () => {
    for (const project of PROJECTS.tr) {
      const description = projectJsonLd(project, 'tr', IMAGE).description as string
      expect(project.description[0].startsWith(description)).toBe(true)
      expect(description).not.toMatch(/\.NET$/)
    }
  })

  it('names every technology as a keyword, and invents none', () => {
    const project = dolfin()
    const keywords = (projectJsonLd(project, 'tr', IMAGE).keywords as string).split(', ')
    const declared = project.technologies.flatMap((group) => [...group.items])

    expect(keywords).toEqual(declared)
  })

  it('addresses each language version at its own URL and says which language it is', () => {
    for (const language of LANGUAGES) {
      const project = PROJECTS[language].find((p) => p.slug === 'dolfin')!
      const data = projectJsonLd(project, language, IMAGE)

      expect(data.inLanguage).toBe(language)
      expect(data.url).toBe(
        language === 'tr'
          ? `${SITE_URL}/projects/dolfin`
          : `${SITE_URL}/en/projects/dolfin`,
      )
    }
  })

  it('omits a link it does not have rather than emitting an empty one', () => {
    const project = { ...dolfin(), repoUrl: undefined, liveUrl: undefined }
    const data = projectJsonLd(project, 'tr', IMAGE)

    expect('codeRepository' in data).toBe(false)
    expect('sameAs' in data).toBe(false)
  })

  it('serialises to JSON with nothing that could break out of the script tag', () => {
    for (const language of LANGUAGES) {
      for (const project of PROJECTS[language]) {
        const json = JSON.stringify(projectJsonLd(project, language, IMAGE))
        expect(json).not.toContain('</script')
        expect(() => JSON.parse(json)).not.toThrow()
      }
    }
  })
})

describe('projectBreadcrumbJsonLd', () => {
  it('walks from the home page of the same language down to the project', () => {
    const data = projectBreadcrumbJsonLd(dolfin(), 'en')
    expect(data['@type']).toBe('BreadcrumbList')
    expect(data.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_URL}/en` },
      { '@type': 'ListItem', position: 2, name: 'DOLFIN', item: `${SITE_URL}/en/projects/dolfin` },
    ])
  })

  it('never crosses languages inside one trail', () => {
    for (const language of LANGUAGES) {
      const items = projectBreadcrumbJsonLd(dolfin(), language).itemListElement as {
        item: string
      }[]
      const prefixed = items.filter((entry) => entry.item.startsWith(`${SITE_URL}/en`))
      expect(prefixed).toHaveLength(language === 'en' ? items.length : 0)
    }
  })
})
