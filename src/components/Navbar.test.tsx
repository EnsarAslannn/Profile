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

  describe('active section underline', () => {
    it('reserves the underline on every link, so switching cannot shift the row', () => {
      const { container } = renderWithRouter(<Navbar />)
      const links = Array.from(container.querySelectorAll('nav a'))

      expect(links.length).toBeGreaterThan(0)
      for (const link of links) {
        expect(link.className).toMatch(/\bborder-b-2\b/)
        expect(link.className).toMatch(/\bborder-transparent\b/)
      }
    })

    it('marks no section current away from the home route', () => {
      for (const route of ['/hakkimda', '/projects/dolfin']) {
        const { container, unmount } = renderWithRouter(<Navbar />, route)
        expect(container.querySelectorAll('nav a[aria-current]')).toHaveLength(0)
        unmount()
      }
    })

    it('uses aria-current="location" and never "page" on a section link', () => {
      const { container } = renderWithRouter(<Navbar />)
      for (const link of Array.from(container.querySelectorAll('nav a'))) {
        expect(link.getAttribute('aria-current')).not.toBe('page')
      }
    })
  })
})
