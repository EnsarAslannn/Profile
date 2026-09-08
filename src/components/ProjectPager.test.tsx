import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { renderWithRouter } from '../test/renderWithRouter'
import { PROJECTS, getProjectNeighbours } from '../data/projects'

const pager = () => screen.getByRole('navigation', { name: 'Diğer projeler' })

describe('getProjectNeighbours', () => {
  it('walks the mosaic order, with no wrap-around at either end', () => {
    const [first, middle, last] = PROJECTS.tr

    expect(getProjectNeighbours(first.slug)).toEqual({ previous: undefined, next: middle })
    expect(getProjectNeighbours(middle.slug)).toEqual({ previous: first, next: last })
    expect(getProjectNeighbours(last.slug)).toEqual({ previous: middle, next: undefined })
  })

  it('answers with neither neighbour for a slug that is not a project', () => {
    expect(getProjectNeighbours('yoktur')).toEqual({ previous: undefined, next: undefined })
    expect(getProjectNeighbours(undefined)).toEqual({ previous: undefined, next: undefined })
  })

  it('stays inside one language', () => {
    expect(getProjectNeighbours('dolfin', 'en').next?.subtitle).toBe(PROJECTS.en[1].subtitle)
  })
})

describe('ProjectPager', () => {
  it('offers only the next project on the first project of the mosaic', () => {
    renderWithRouter(<App />, '/projects/dolfin')

    const links = within(pager()).getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', '/projects/takeauction')
    expect(links[0].textContent).toContain('Sonraki proje')
    expect(links[0].textContent).toContain('TakeAuction')
  })

  it('offers both neighbours in the middle of the mosaic, previous first in the tab order', () => {
    renderWithRouter(<App />, '/projects/takeauction')

    const links = within(pager()).getAllByRole('link')
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/projects/dolfin',
      '/projects/altitudelog',
    ])
    expect(links[0].textContent).toContain('Önceki proje')
    expect(links[1].textContent).toContain('Sonraki proje')
  })

  it('offers only the previous project on the last one', () => {
    renderWithRouter(<App />, '/projects/altitudelog')

    const links = within(pager()).getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', '/projects/takeauction')
    expect(links[0].textContent).toContain('Önceki proje')
  })

  it('keeps the reader in their own language', () => {
    renderWithRouter(<App />, '/en/projects/takeauction')

    const links = within(
      screen.getByRole('navigation', { name: 'Other projects' }),
    ).getAllByRole('link')

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/en/projects/dolfin',
      '/en/projects/altitudelog',
    ])
    expect(links[0].textContent).toContain('Previous project')
  })

  it('does not replace the link back to the projects section', () => {
    renderWithRouter(<App />, '/projects/takeauction')

    const back = screen.getByRole('link', { name: 'Projelere dön' })
    expect(back).toHaveAttribute('href', '/#projeler')
    expect(within(pager()).queryByRole('link', { name: 'Projelere dön' })).toBeNull()
  })
})
