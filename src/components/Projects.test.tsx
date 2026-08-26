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
    expect(hrefs).toEqual(['/projects/takeauction', '/projects/altitudelog', '/projects/dolfin'])
  })

  it('no longer renders the placeholder text', () => {
    renderWithRouter(<Projects />)
    expect(screen.queryByText('Placeholder: proje kartları buraya gelecek.')).not.toBeInTheDocument()
  })
})
