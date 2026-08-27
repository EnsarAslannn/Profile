import { describe, expect, it } from 'vitest'
import HomePage from './HomePage'
import { renderWithRouter } from '../test/renderWithRouter'
import Navbar from '../components/Navbar'

describe('HomePage', () => {
  it('renders the sections in the owner-specified order', () => {
    const { container } = renderWithRouter(<HomePage />, '/')
    const ids = Array.from(container.querySelectorAll('section[id]')).map((section) => section.id)
    expect(ids).toEqual(['hakkimda', 'projeler', 'ozgecmis'])
  })

  it('exposes one section per navbar anchor', () => {
    const { container } = renderWithRouter(<HomePage />, '/')
    const sectionIds = new Set(
      Array.from(container.querySelectorAll('section[id]')).map((section) => section.id),
    )
    const { container: navContainer } = renderWithRouter(<Navbar />, '/')
    const anchorIds = new Set(
      Array.from(navContainer.querySelectorAll('nav a[href^="/#"]')).map((a) =>
        a.getAttribute('href')!.slice(2),
      ),
    )
    expect(sectionIds).toEqual(anchorIds)
  })
})
