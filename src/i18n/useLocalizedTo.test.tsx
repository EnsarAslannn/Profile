import { describe, expect, it } from 'vitest'
import App from '../App'
import { renderWithRouter } from '../test/renderWithRouter'

function internalHrefs(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href]'))
    .map((anchor) => anchor.getAttribute('href') ?? '')
    .filter((href) => href.startsWith('/') && !href.startsWith('//'))
    .filter((href) => !href.endsWith('.pdf'))
}

describe('carrying ?lang= across internal links', () => {
  for (const route of ['/?lang=en', '/hakkimda?lang=en', '/projects/dolfin?lang=en']) {
    it(`keeps lang=en on every internal link from ${route}`, () => {
      const { container } = renderWithRouter(<App />, route)
      const hrefs = internalHrefs(container)

      expect(hrefs.length).toBeGreaterThan(5)
      for (const href of hrefs) {
        expect(href, `${href} lost ?lang=en`).toContain('lang=en')
      }
    })
  }

  it('puts the parameter before the fragment, not inside it', () => {
    const { container } = renderWithRouter(<App />, '/?lang=en')
    const hashLinks = internalHrefs(container).filter((href) => href.includes('#'))

    expect(hashLinks.length).toBeGreaterThan(0)
    for (const href of hashLinks) {
      expect(href).toMatch(/^\/\?lang=en#[a-z]+$/)
    }
  })

  it('adds nothing to a URL that does not already carry the parameter', () => {
    const { container } = renderWithRouter(<App />, '/')
    for (const href of internalHrefs(container)) {
      expect(href).not.toContain('lang=')
    }
  })

  it('carries an explicit lang=tr just as it carries lang=en', () => {
    const { container } = renderWithRouter(<App />, '/?lang=tr')
    const hrefs = internalHrefs(container)

    expect(hrefs.length).toBeGreaterThan(5)
    for (const href of hrefs) {
      expect(href).toContain('lang=tr')
    }
  })
})
