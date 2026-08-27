import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProjectScreens from './ProjectScreens'
import { renderWithRouter } from '../test/renderWithRouter'
import type { ProjectScreen } from '../data/projects'

const SCREENS: ProjectScreen[] = [
  { name: 'homePage', src: '/homePage.webp', caption: 'İlk ekran açıklaması.' },
  { name: 'homePage2', src: '/homePage2.webp', caption: undefined },
  { name: 'searchPage', src: '/searchPage.webp', caption: 'Arama ekranı açıklaması.' },
]

describe('ProjectScreens', () => {
  it('renders one li and one figure per screen, and three images', () => {
    const { container } = renderWithRouter(<ProjectScreens screens={SCREENS} projectTitle="DOLFIN" />)
    expect(container.querySelectorAll('li')).toHaveLength(3)
    expect(container.querySelectorAll('figure')).toHaveLength(3)
    expect(screen.getAllByRole('img')).toHaveLength(3)
  })

  it('renders exactly two figcaptions - the caption-less screen has none and does not throw', () => {
    const { container } = renderWithRouter(<ProjectScreens screens={SCREENS} projectTitle="DOLFIN" />)
    expect(container.querySelectorAll('figcaption')).toHaveLength(2)
  })

  it('renders both captions verbatim as text', () => {
    renderWithRouter(<ProjectScreens screens={SCREENS} projectTitle="DOLFIN" />)
    expect(screen.getByText('İlk ekran açıklaması.')).toBeInTheDocument()
    expect(screen.getByText('Arama ekranı açıklaması.')).toBeInTheDocument()
  })

  it('every image is loading=lazy with no fetchpriority, including index 0 - the cover is the LCP now', () => {
    renderWithRouter(<ProjectScreens screens={SCREENS} projectTitle="DOLFIN" />)
    for (const img of screen.getAllByRole('img')) {
      expect(img).toHaveAttribute('loading', 'lazy')
      expect(img.getAttribute('fetchpriority')).toBeNull()
    }
  })

  it('gives every image decoding=async and the nominal shared width/height', () => {
    renderWithRouter(<ProjectScreens screens={SCREENS} projectTitle="DOLFIN" />)
    for (const img of screen.getAllByRole('img')) {
      expect(img).toHaveAttribute('decoding', 'async')
      expect(img).toHaveAttribute('width', '1600')
      expect(img).toHaveAttribute('height', '879')
    }
  })

  it('builds alt text from the project title and image position', () => {
    renderWithRouter(<ProjectScreens screens={SCREENS} projectTitle="DOLFIN" />)
    expect(screen.getByAltText('DOLFIN ekran görüntüsü 1')).toBeInTheDocument()
    expect(screen.getByAltText('DOLFIN ekran görüntüsü 2')).toBeInTheDocument()
    expect(screen.getByAltText('DOLFIN ekran görüntüsü 3')).toBeInTheDocument()
  })

  it('never duplicates the caption text into an alt attribute', () => {
    renderWithRouter(<ProjectScreens screens={SCREENS} projectTitle="DOLFIN" />)
    expect(screen.queryByAltText('İlk ekran açıklaması.')).not.toBeInTheDocument()
  })
})
