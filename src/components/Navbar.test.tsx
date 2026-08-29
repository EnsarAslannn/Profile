import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Navbar from './Navbar'
import { renderWithRouter } from '../test/renderWithRouter'
import { NAV_LINKS } from '../data/navigation'
import { SITE_NAME } from '../lib/siteMeta'

describe('Navbar', () => {
  it('renders one link per NAV_LINKS entry, in order', () => {
    renderWithRouter(<Navbar />)
    const nav = screen.getByRole('navigation', { name: 'Bölüm gezinmesi' })
    const links = Array.from(nav.querySelectorAll('a'))
    expect(links.map((link) => link.textContent)).toEqual(NAV_LINKS.map((link) => link.label))
  })

  // Not `href="#projeler"`. Clicked from /projects/dolfin, a bare hash would
  // resolve against the current path and produce the dead URL
  // /projects/dolfin#projeler; the absolute-to-home form goes back to / and
  // scrolls, which is what ScrollToHash is there to finish.
  it('points every section link at the home route, not the current one', () => {
    renderWithRouter(<Navbar />, '/projects/dolfin')
    const nav = screen.getByRole('navigation', { name: 'Bölüm gezinmesi' })
    for (const [index, link] of Array.from(nav.querySelectorAll('a')).entries()) {
      expect(link.getAttribute('href')).toBe(`/#${NAV_LINKS[index].anchor}`)
    }
  })

  it('links the wordmark home', () => {
    renderWithRouter(<Navbar />, '/projects/dolfin')
    expect(screen.getByRole('link', { name: SITE_NAME })).toHaveAttribute('href', '/')
  })

  // The reference design carries a language switcher and a theme toggle. This
  // site has neither i18n nor a dark theme, and a control that does nothing
  // is worse than no control - so the navbar must stay links-only.
  it('adds no control that does not do anything', () => {
    const { container } = renderWithRouter(<Navbar />)
    expect(container.querySelectorAll('button')).toHaveLength(0)
    expect(container.querySelectorAll('select')).toHaveLength(0)
  })

  it('sticks to the top of the viewport', () => {
    const { container } = renderWithRouter(<Navbar />)
    const header = container.querySelector('header')!
    expect(header.className).toMatch(/\bsticky\b/)
    expect(header.className).toMatch(/\btop-0\b/)
  })
})
