import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Navbar from './Navbar'
import { renderWithRouter } from '../test/renderWithRouter'
import { NAV_LINKS } from '../data/navigation'
import { SITE_NAME } from '../lib/siteMeta'

describe('Navbar', () => {
  it('renders one link per NAV_LINKS.tr entry, in order', () => {
    renderWithRouter(<Navbar />)
    const nav = screen.getByRole('navigation', { name: 'Bölüm gezinmesi' })
    const links = Array.from(nav.querySelectorAll('a'))
    expect(links.map((link) => link.textContent)).toEqual(NAV_LINKS.tr.map((link) => link.label))
  })

  // Not `href="#projeler"`. Clicked from /projects/dolfin, a bare hash would
  // resolve against the current path and produce the dead URL
  // /projects/dolfin#projeler; the absolute-to-home form goes back to / and
  // scrolls, which is what ScrollToHash is there to finish.
  it('points every section link at the home route, not the current one', () => {
    renderWithRouter(<Navbar />, '/projects/dolfin')
    const nav = screen.getByRole('navigation', { name: 'Bölüm gezinmesi' })
    for (const [index, link] of Array.from(nav.querySelectorAll('a')).entries()) {
      expect(link.getAttribute('href')).toBe(`/#${NAV_LINKS.tr[index].anchor}`)
    }
  })

  it('links the wordmark home', () => {
    renderWithRouter(<Navbar />, '/projects/dolfin')
    expect(screen.getByRole('link', { name: SITE_NAME })).toHaveAttribute('href', '/')
  })

  // The reference design carries a language switcher and a theme toggle. This
  // site has neither i18n nor a dark theme, and a control that does nothing
  // is worse than no control - so the navbar must stay links-only.
  // The reference design carries a language switcher and a theme toggle.
  // This used to assert zero buttons, because neither did anything here and a
  // control that does nothing is worse than no control. The language switcher
  // is now real, so the rule is not "no buttons" - it is "no button that does
  // nothing": exactly the two language controls, and no theme toggle.
  it('carries the language controls and no other, non-functional control', () => {
    const { container } = renderWithRouter(<Navbar />)
    const buttons = [...container.querySelectorAll('button')]
    expect(buttons.map((b) => b.textContent)).toEqual(['TRTürkçe', 'ENEnglish'])
    expect(container.querySelectorAll('select')).toHaveLength(0)
  })

  it('sticks to the top of the viewport', () => {
    const { container } = renderWithRouter(<Navbar />)
    const header = container.querySelector('header')!
    expect(header.className).toMatch(/\bsticky\b/)
    expect(header.className).toMatch(/\btop-0\b/)
  })

  // The active-section underline. jsdom reports every rect as zero, so which
  // link is current cannot be exercised here - useActiveSection.test.ts covers
  // the choice and a browser covers the measuring. What IS checkable from
  // here is the part that would silently regress: the reserved space, and the
  // rule that nothing is marked current off the home route.
  describe('active section underline', () => {
    it('reserves the underline on every link, so switching cannot shift the row', () => {
      const { container } = renderWithRouter(<Navbar />)
      const links = Array.from(container.querySelectorAll('nav a'))

      expect(links.length).toBeGreaterThan(0)
      for (const link of links) {
        // Painted or not, the 2px has to occupy space - otherwise the whole
        // navbar jumps two pixels each time the reader scrolls into the next
        // section.
        expect(link.className).toMatch(/\bborder-b-2\b/)
        expect(link.className).toMatch(/\bborder-transparent\b/)
      }
    })

    it('marks no section current away from the home route', () => {
      for (const route of ['/hakkimda', '/projects/dolfin']) {
        const { container, unmount } = renderWithRouter(<Navbar />, route)
        // Off the home route these six links navigate AWAY rather than
        // describing where the reader is, so none of them is "current" -
        // including İletişim, whose section the chrome renders on every route.
        expect(container.querySelectorAll('nav a[aria-current]')).toHaveLength(0)
        unmount()
      }
    })

    // "page" would tell a screen reader the six links are six different
    // pages. They are one page and six positions in it.
    it('uses aria-current="location" and never "page" on a section link', () => {
      const { container } = renderWithRouter(<Navbar />)
      for (const link of Array.from(container.querySelectorAll('nav a'))) {
        expect(link.getAttribute('aria-current')).not.toBe('page')
      }
    })
  })
})
