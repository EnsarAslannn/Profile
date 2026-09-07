import { describe, expect, it } from 'vitest'
import App from '../App'
import { renderWithRouter } from '../test/renderWithRouter'

function internalHrefs(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href]'))
    .map((anchor) => anchor.getAttribute('href') ?? '')
    .filter((href) => href.startsWith('/') && !href.startsWith('//'))
    .filter((href) => !href.endsWith('.pdf'))
}

describe('carrying the /en prefix across internal links', () => {
  for (const route of ['/en', '/en/hakkimda', '/en/projects/dolfin']) {
    it(`keeps every internal link under /en from ${route}`, () => {
      const { container } = renderWithRouter(<App />, route)
      const hrefs = internalHrefs(container)

      expect(hrefs.length).toBeGreaterThan(5)
      for (const href of hrefs) {
        expect(href, `${href} fell back to the Turkish address`).toMatch(/^\/en(\/|#|$)/)
      }
    })
  }

  it('puts the prefix before the fragment, not inside it', () => {
    const { container } = renderWithRouter(<App />, '/en')
    const hashLinks = internalHrefs(container).filter((href) => href.includes('#'))

    expect(hashLinks.length).toBeGreaterThan(0)
    for (const href of hashLinks) {
      expect(href).toMatch(/^\/en#[a-z]+$/)
    }
  })

  it('never stacks the prefix on a link built from an already-English path', () => {
    for (const route of ['/en', '/en/hakkimda', '/en/projects/dolfin']) {
      const { container, unmount } = renderWithRouter(<App />, route)
      for (const href of internalHrefs(container)) {
        expect(href).not.toContain('/en/en')
      }
      unmount()
    }
  })

  it('adds nothing to the links of the Turkish original', () => {
    const { container } = renderWithRouter(<App />, '/')
    const hrefs = internalHrefs(container)

    expect(hrefs.length).toBeGreaterThan(5)
    for (const href of hrefs) {
      expect(href).not.toMatch(/^\/en(\/|#|$)/)
    }
  })
})
