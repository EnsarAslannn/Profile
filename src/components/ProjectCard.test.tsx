import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProjectCard from './ProjectCard'
import { renderWithRouter } from '../test/renderWithRouter'
import { getProjectBySlug } from '../data/projects'

// Looked up by slug, not by index: the PROJECTS array order is the home-page
// grid display order and is expected to change without breaking this test.
const dolfin = getProjectBySlug('dolfin')!

describe('ProjectCard', () => {
  it('renders an h3 named after the project title', () => {
    renderWithRouter(
      <ul>
        <ProjectCard project={dolfin} />
      </ul>,
    )
    expect(screen.getByRole('heading', { level: 3, name: 'DOLFIN' })).toBeInTheDocument()
  })

  it('contains exactly one link pointing at the project route', () => {
    renderWithRouter(
      <ul>
        <ProjectCard project={dolfin} />
      </ul>,
    )
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', '/projects/dolfin')
  })

  it("the link's accessible name contains the project title", () => {
    renderWithRouter(
      <ul>
        <ProjectCard project={dolfin} />
      </ul>,
    )
    expect(screen.getByRole('link')).toHaveAccessibleName(/DOLFIN/)
  })

  it('renders the cover image with the sanctioned attributes', () => {
    renderWithRouter(
      <ul>
        <ProjectCard project={dolfin} />
      </ul>,
    )
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img).toHaveAttribute('decoding', 'async')
    expect(img).toHaveAttribute('width', '1600')
    expect(img).toHaveAttribute('height', '879')
    expect(img).toHaveAttribute('alt', 'DOLFIN ekran görüntüsü 1')
    expect(img.getAttribute('fetchpriority')).toBeNull()
  })

  it('renders the verbatim description text', () => {
    renderWithRouter(
      <ul>
        <ProjectCard project={dolfin} />
      </ul>,
    )
    expect(screen.getByText(dolfin.description)).toBeInTheDocument()
  })
})
