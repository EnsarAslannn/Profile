import { describe, expect, it } from 'vitest'
import App from '../App'
import { renderWithRouter } from '../test/renderWithRouter'

// Every internal <Link> on the site used to drop ?lang=, which cost the
// parameter both of the jobs it exists for: a URL copied mid-visit opened in
// Turkish for whoever it was sent to, and a crawler - which has no
// localStorage and no memory between requests - fell back to Turkish on the
// first click, leaving the whole English site uncrawlable past the landing
// page.
//
// These assertions read the rendered hrefs rather than testing the hook in
// isolation, because the failure mode is a call site that forgot to use it,
// not a hook that computes the wrong string.
function internalHrefs(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href]'))
    .map((anchor) => anchor.getAttribute('href') ?? '')
    // Off-site links (LinkedIn, GitHub, a project's demo), the mailto and the
    // CV download are not router destinations and must not be touched. The
    // skip link's bare fragment is not one either.
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

  // The parameter lands before the fragment. '/#projeler?lang=en' would make
  // "projeler?lang=en" the fragment id, so the anchor would match nothing and
  // the query would never be read.
  it('puts the parameter before the fragment, not inside it', () => {
    const { container } = renderWithRouter(<App />, '/?lang=en')
    const hashLinks = internalHrefs(container).filter((href) => href.includes('#'))

    expect(hashLinks.length).toBeGreaterThan(0)
    for (const href of hashLinks) {
      expect(href).toMatch(/^\/\?lang=en#[a-z]+$/)
    }
  })

  // Turkish is the default and its URLs stay clean: nothing appends
  // ?lang=tr to an address that already means Turkish.
  it('adds nothing to a URL that does not already carry the parameter', () => {
    const { container } = renderWithRouter(<App />, '/')
    for (const href of internalHrefs(container)) {
      expect(href).not.toContain('lang=')
    }
  })

  // The rule is "carry what is there", not "carry en" - a reader who switched
  // back to Turkish gets ?lang=tr, which has to survive a click too, or the
  // next page would silently resolve from localStorage instead.
  it('carries an explicit lang=tr just as it carries lang=en', () => {
    const { container } = renderWithRouter(<App />, '/?lang=tr')
    const hrefs = internalHrefs(container)

    expect(hrefs.length).toBeGreaterThan(5)
    for (const href of hrefs) {
      expect(href).toContain('lang=tr')
    }
  })
})
