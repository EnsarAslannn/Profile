import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Projects from './Projects'
import { renderWithRouter } from '../test/renderWithRouter'

describe('Projects', () => {
  it('renders the projeler section', () => {
    const { container } = renderWithRouter(<Projects />)
    expect(container.querySelector('section#projeler')).not.toBeNull()
  })

  it('has one h2 named Projeler and no h1 in its subtree', () => {
    const { container } = renderWithRouter(<Projects />)
    expect(screen.getByRole('heading', { level: 2, name: 'Projeler' })).toBeInTheDocument()
    expect(container.querySelectorAll('h1')).toHaveLength(0)
  })

  it('renders three project list items', () => {
    renderWithRouter(<Projects />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('links to each project route in the expected display order', () => {
    renderWithRouter(<Projects />)
    const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'))
    expect(hrefs).toEqual(['/projects/dolfin', '/projects/takeauction', '/projects/altitudelog'])
  })

  it('no longer renders the placeholder text', () => {
    renderWithRouter(<Projects />)
    expect(screen.queryByText('Placeholder: proje kartları buraya gelecek.')).not.toBeInTheDocument()
  })

  it('renders exactly one ul in the subtree - the mosaic must not become nested lists', () => {
    const { container } = renderWithRouter(<Projects />)
    expect(container.querySelectorAll('ul')).toHaveLength(1)
  })

  it('the first li in DOM order is the dolfin (featured) card', () => {
    renderWithRouter(<Projects />)
    const firstLink = screen.getAllByRole('link')[0]
    expect(firstLink).toHaveAttribute('href', '/projects/dolfin')
  })

  it("the ul's class list contains a grid utility", () => {
    const { container } = renderWithRouter(<Projects />)
    const ul = container.querySelector('ul')!
    expect(ul.className).toMatch(/\bgrid\b/)
  })

  it("the ul's class list defines an explicit md: row-sizing mechanism for the mosaic", () => {
    const { container } = renderWithRouter(<Projects />)
    const ul = container.querySelector('ul')!
    expect(ul.className).toMatch(/md:(grid-rows|auto-rows|h-|aspect-)/)
  })
})
