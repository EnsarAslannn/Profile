import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProjectCard from './ProjectCard'
import { renderWithRouter } from '../test/renderWithRouter'
import { getProjectBySlug } from '../data/projects'

// Looked up by slug, not by index: the PROJECTS.tr array order is the home-page
// grid display order and is expected to change without breaking this test.
const dolfin = getProjectBySlug('dolfin')!

describe('ProjectCard', () => {
  it('renders an h3 named after the project title', () => {
    renderWithRouter(
      <ul>
        <ProjectCard project={dolfin} index={1} />
      </ul>,
    )
    expect(screen.getByRole('heading', { level: 3, name: 'DOLFIN' })).toBeInTheDocument()
  })

  it('contains exactly one link pointing at the project route', () => {
    renderWithRouter(
      <ul>
        <ProjectCard project={dolfin} index={1} />
      </ul>,
    )
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', '/projects/dolfin')
  })

  it("the link's accessible name contains the project title", () => {
    renderWithRouter(
      <ul>
        <ProjectCard project={dolfin} index={1} />
      </ul>,
    )
    expect(screen.getByRole('link')).toHaveAccessibleName(/DOLFIN/)
  })

  it('renders the cover image with the true intrinsic attributes', () => {
    const { container } = renderWithRouter(
      <ul>
        <ProjectCard project={dolfin} index={1} />
      </ul>,
    )
    const img = container.querySelector('img')!
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img).toHaveAttribute('decoding', 'async')
    expect(img).toHaveAttribute('width', '1600')
    expect(img).toHaveAttribute('height', '2161')
    expect(img).toHaveAttribute('alt', '')
    expect(img.getAttribute('fetchpriority')).toBeNull()
  })

  it('the cover image fills its mosaic cell at md: with an object-fit utility', () => {
    const { container } = renderWithRouter(
      <ul>
        <ProjectCard project={dolfin} index={1} />
      </ul>,
    )
    const img = container.querySelector('img')!
    expect(img.className).toMatch(/md:object-cover/)
  })

  it('does not render the subtitle as visible text, but keeps it in the accessible name', () => {
    renderWithRouter(
      <ul>
        <ProjectCard project={dolfin} index={1} />
      </ul>,
    )
    expect(screen.queryByText(dolfin.subtitle)).not.toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAccessibleName(`${dolfin.title} - ${dolfin.subtitle}`)
  })

  it('never renders the description on the card', () => {
    renderWithRouter(
      <ul>
        <ProjectCard project={dolfin} index={1} />
      </ul>,
    )
    for (const paragraph of dolfin.description) {
      expect(screen.queryByText(paragraph)).not.toBeInTheDocument()
    }
  })

  it('keeps the title in the DOM and the accessibility tree with no hover or focus simulated', () => {
    renderWithRouter(
      <ul>
        <ProjectCard project={dolfin} index={1} />
      </ul>,
    )
    const heading = screen.getByRole('heading', { level: 3, name: 'DOLFIN' })
    expect(heading).toBeInTheDocument()
    expect(heading).not.toHaveAttribute('aria-hidden')
  })

  it('the bar reveal is gated on group-hover and group-focus-visible variants', () => {
    const { container } = renderWithRouter(
      <ul>
        <ProjectCard project={dolfin} index={1} />
      </ul>,
    )
    const bar = container.querySelector('[data-card-bar]')!
    expect(bar.className).toMatch(/group-hover:/)
    expect(bar.className).toMatch(/group-focus-visible:/)
  })

  it('gates the hide/reveal rules behind a hover-capable-pointer media query, so touch devices see the bar unconditionally', () => {
    const { container } = renderWithRouter(
      <ul>
        <ProjectCard project={dolfin} index={1} />
      </ul>,
    )
    const bar = container.querySelector('[data-card-bar]')!
    expect(bar.className).toMatch(/opacity-100/)
    expect(bar.className).toMatch(/\[@media\(hover:hover\)\]:/)
  })

  it('renders exactly one decorative arrow icon that is not announced, and keeps the accessible name exact', () => {
    renderWithRouter(
      <ul>
        <ProjectCard project={dolfin} index={1} />
      </ul>,
    )
    const svgs = screen.getAllByRole('link')[0].querySelectorAll('svg')
    // one cover-adjacent icon (the arrow); the cover itself is an <img>, not an svg
    expect(svgs).toHaveLength(1)
    expect(svgs[0]).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('link')).toHaveAccessibleName(`${dolfin.title} - ${dolfin.subtitle}`)
  })

  it('gives index 0 the tall featured cell and later cards the right column', () => {
    const { container: featuredContainer } = renderWithRouter(
      <ul>
        <ProjectCard project={dolfin} index={0} />
      </ul>,
    )
    const { container: plainContainer } = renderWithRouter(
      <ul>
        <ProjectCard project={dolfin} index={1} />
      </ul>,
    )
    const featuredLi = featuredContainer.querySelector('li')
    const plainLi = plainContainer.querySelector('li')
    expect(featuredLi!.className).toMatch(/md:row-span-2/)
    expect(plainLi!.className).not.toMatch(/md:row-span-2/)
    expect(plainLi!.className).toMatch(/md:col-start-2/)
  })
})
