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

  // The two-edit rule, made self-enforcing. NAV_LINKS is the single source of
  // truth for section navigation; a section added to only one of the two
  // places that render sections (HomePage for the five body sections, App
  // itself for `iletisim`) fails here instead of shipping a dead nav link.
  it('renders exactly one section per NAV_LINKS anchor, in order', () => {
    const { container } = renderWithRouter(<App />)
    const ids = Array.from(container.querySelectorAll('section[id]')).map((section) => section.id)
    expect(ids).toEqual(NAV_LINKS.map((link) => link.anchor))
  })

  it('links every navbar anchor to a section that exists', () => {
    // Navbar renders router Links with absolute-to-home hash hrefs
    // (`/#hakkimda`), so this reads the fragment after `/#`.
    const { container } = renderWithRouter(<App />)
    const anchors = Array.from(container.querySelectorAll('nav a[href^="/#"]'))
    expect(anchors.length).toBe(NAV_LINKS.length)
    for (const anchor of anchors) {
      const id = anchor.getAttribute('href')?.slice(2)
      expect(container.querySelector(`section#${id}`)).not.toBeNull()
    }
  })

  // Every content column on every route is the same constant, so there is
  // nothing to drift - this asserts the constant is actually what reaches the
  // DOM, on the home route and on a detail route alike.
  it('lays the navbar, the body and the contact block on one content column', () => {
    for (const route of ['/', '/projects/dolfin', '/hakkimda']) {
      const { container, unmount } = renderWithRouter(<App />, route)
      const columns = [
        container.querySelector('header > div'),
        container.querySelector('footer > div'),
      ]
      for (const column of columns) {
        expect(column?.className).toContain(CONTENT_CONTAINER)
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
})
