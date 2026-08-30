import { describe, expect, it } from 'vitest'
import HomePage from './HomePage'
import { renderWithRouter } from '../test/renderWithRouter'
import { CONTENT_CONTAINER } from '../lib/layout'

describe('HomePage', () => {
  it('renders the sections in the reference design order', () => {
    const { container } = renderWithRouter(<HomePage />, '/')
    const ids = Array.from(container.querySelectorAll('section[id]')).map((section) => section.id)
    // `iletisim` is deliberately absent: it is site chrome, rendered by
    // App.tsx outside <Routes> so every route ends the same way. App.test.tsx
    // is what proves the full NAV_LINKS.tr set resolves.
    expect(ids).toEqual(['anasayfa', 'hakkimda', 'projeler', 'ozgecmis', 'yetenekler'])
  })

  // The reference design prints a [001]-style index above every heading. It
  // was reproduced and then removed at the owner's request, so no section may
  // carry one.
  it('prints no section index above any heading', () => {
    const { container } = renderWithRouter(<HomePage />, '/')
    expect(container.textContent).not.toMatch(/\[\d{3}]/)
  })

  // The Marquee strips are full-bleed by design, so <main> itself carries no
  // width cap - the padded column moved to the blocks around them. Each of
  // those blocks must still be the SAME column, or the sections above and
  // below a strip would sit on different left edges.
  it('wraps every section block in the one shared content column', () => {
    const { container } = renderWithRouter(<HomePage />, '/')
    const main = container.querySelector('main')!
    expect(main.className).not.toMatch(/max-w-/)
    const columns = Array.from(main.children).filter((child) => child.querySelector('section'))
    expect(columns.length).toBeGreaterThan(1)
    for (const column of columns) {
      expect(column.className).toBe(CONTENT_CONTAINER)
    }
  })
})
