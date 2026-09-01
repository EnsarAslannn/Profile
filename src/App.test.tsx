import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'
import { renderWithRouter } from './test/renderWithRouter'
import { NAV_LINKS } from './data/navigation'
import { CONTENT_CONTAINER } from './lib/layout'

describe('App', () => {
  it('has exactly one h1 on the page', () => {
    renderWithRouter(<App />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  // The two-edit rule, made self-enforcing. NAV_LINKS.tr is the single source of
  // truth for section navigation; a section added to only one of the two
  // places that render sections (HomePage for the five body sections, App
  // itself for `iletisim`) fails here instead of shipping a dead nav link.
  it('renders exactly one section per NAV_LINKS.tr anchor, in order', () => {
    const { container } = renderWithRouter(<App />)
    const ids = Array.from(container.querySelectorAll('section[id]')).map((section) => section.id)
    expect(ids).toEqual(NAV_LINKS.tr.map((link) => link.anchor))
  })

  it('links every navbar anchor to a section that exists', () => {
    // Navbar renders router Links with absolute-to-home hash hrefs
    // (`/#hakkimda`), so this reads the fragment after `/#`.
    const { container } = renderWithRouter(<App />)
    const anchors = Array.from(container.querySelectorAll('nav a[href^="/#"]'))
    expect(anchors.length).toBe(NAV_LINKS.tr.length)
    for (const anchor of anchors) {
      const id = anchor.getAttribute('href')?.slice(2)
      expect(container.querySelector(`section#${id}`)).not.toBeNull()
    }
  })

  // Every content column on every route is the same constant, so there is
  // nothing to drift - this asserts the constant is actually what reaches the
  // DOM, on the home route and on a detail route alike.
  //
  // The footer is checked by SEARCHING it rather than by reaching for
  // `footer > div`: it is now two full-bleed bands (a cream İletişim section
  // and the deep-green closing bar), each carrying the column inside itself,
  // so its direct children are the bands and not the columns. Asserting that
  // every column found is the constant, and that there is more than one,
  // survives that restructure and still catches a band that forgot the column
  // or invented its own width.
  it('lays the navbar, the body and the contact block on one content column', () => {
    for (const route of ['/', '/projects/dolfin', '/hakkimda']) {
      const { container, unmount } = renderWithRouter(<App />, route)

      expect(container.querySelector('header > div')?.className).toContain(CONTENT_CONTAINER)

      const footerColumns = Array.from(
        container.querySelectorAll('footer div[class*="max-w-"]'),
      )
      expect(footerColumns.length).toBeGreaterThan(1)
      for (const column of footerColumns) {
        expect(column.className).toBe(CONTENT_CONTAINER)
      }

      expect(CONTENT_CONTAINER).toContain('max-w-7xl')
      unmount()
    }
  })

  it('keeps the sticky navbar clear of the anchors it scrolls to', () => {
    const { container } = renderWithRouter(<App />)
    // A sticky header covers the top of the viewport, so every anchor target
    // needs a scroll margin bigger than the header - otherwise a nav click
    // lands the heading underneath the bar.
    for (const section of Array.from(container.querySelectorAll('section[id]'))) {
      expect(section.className).toMatch(/\bscroll-mt-24\b/)
    }
  })

  it('redirects an unknown path back to the home page', () => {
    const { container } = renderWithRouter(<App />, '/nosuchpage')
    expect(container.querySelector('section#anasayfa')).not.toBeNull()
  })

  it('routes /hakkimda to the full About page', () => {
    renderWithRouter(<App />, '/hakkimda')
    expect(screen.getByRole('heading', { level: 1, name: 'Hakkımda' })).toBeInTheDocument()
  })

  // The sticky navbar puts nine tab stops (two language buttons, the wordmark
  // and six section links) in front of the content on EVERY route, which is
  // exactly the situation a skip link exists for. Asserting it is FIRST is
  // the part worth pinning: a skip link that is not the first focusable
  // element is decoration.
  describe('skip link', () => {
    for (const route of ['/', '/hakkimda', '/projects/dolfin']) {
      it(`is the first focusable element on ${route} and targets its main`, () => {
        const { container } = renderWithRouter(<App />, route)

        const focusable = Array.from(
          container.querySelectorAll<HTMLElement>('a[href], button, [tabindex]'),
        )
        const first = focusable[0]
        expect(first.tagName).toBe('A')
        expect(first.getAttribute('href')).toBe('#main')
        expect(first.textContent).toBe('İçeriğe geç')

        // A fragment link moves focus into its target only if the target can
        // hold focus, so the <main> it points at has to be tabbable
        // programmatically.
        const main = container.querySelector('main#main')
        expect(main).not.toBeNull()
        expect(main?.getAttribute('tabindex')).toBe('-1')
      })
    }

    // Hidden but reachable. display:none and visibility:hidden both remove an
    // element from the focus order entirely, which would make the link
    // unusable by the only people who can use it.
    it('is visually hidden until focused, without leaving the focus order', () => {
      const { container } = renderWithRouter(<App />)
      const link = container.querySelector<HTMLElement>('a[href="#main"]')
      expect(link?.className).toMatch(/\bsr-only\b/)
      expect(link?.className).toMatch(/\bfocus:not-sr-only\b/)
      expect(link?.className).not.toMatch(/\bhidden\b/)
    })

    // A cascade trap that jsdom cannot see, because jsdom has no cascade.
    //
    // Tailwind's `not-sr-only` resets `padding: 0` as part of undoing
    // `sr-only`, and it arrives through a `focus:` variant - so it lands
    // LATER in the stylesheet than an unscoped `px-5 py-3` and wins. Written
    // that way the pill rendered 20px tall with its label against the edges;
    // focus-scoping the padding puts it back to 44px, measured in a browser.
    // Only the class names are visible from here, so the class names are what
    // this pins.
    it('scopes its padding to :focus, so not-sr-only cannot flatten the pill', () => {
      const { container } = renderWithRouter(<App />)
      const classes = container.querySelector('a[href="#main"]')?.className.split(/\s+/) ?? []

      const padding = classes.filter((name) => /(^|:)p[xytrbl]?-/.test(name))
      expect(padding.length).toBeGreaterThan(0)
      for (const name of padding) {
        expect(name, `${name} is reset to 0 by focus:not-sr-only`).toMatch(/^focus:/)
      }
    })
  })
})
