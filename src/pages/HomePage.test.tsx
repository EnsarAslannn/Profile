import { describe, expect, it } from 'vitest'
import HomePage from './HomePage'
import { renderWithRouter } from '../test/renderWithRouter'
import { NAV_LINKS } from '../data/navigation'

describe('HomePage', () => {
  it('renders the sections in the owner-specified order', () => {
    const { container } = renderWithRouter(<HomePage />, '/')
    const ids = Array.from(container.querySelectorAll('section[id]')).map((section) => section.id)
    expect(ids).toEqual(['hakkimda', 'projeler', 'ozgecmis'])
  })

  // This is what makes the two-edit rule (CLAUDE.md: HomePage.tsx + NAV_LINKS)
  // self-enforcing - a section added in only one place fails this test instead
  // of shipping an unreachable section or a dead footer anchor.
  it('exposes one section per NAV_LINKS anchor', () => {
    const { container } = renderWithRouter(<HomePage />, '/')
    const sectionIds = new Set(
      Array.from(container.querySelectorAll('section[id]')).map((section) => section.id),
    )
    const anchorIds = new Set(NAV_LINKS.map((link) => link.anchor))
    expect(sectionIds).toEqual(anchorIds)
  })
})
