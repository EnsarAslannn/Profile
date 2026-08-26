import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProjectGallery from './ProjectGallery'
import { renderWithRouter } from '../test/renderWithRouter'
import type { ProjectImage } from '../data/projectImages'

const IMAGES: ProjectImage[] = [
  { name: 'homePage', src: '/homePage.webp' },
  { name: 'homePage2', src: '/homePage2.webp' },
  { name: 'searchPage', src: '/searchPage.webp' },
]

describe('ProjectGallery', () => {
  it('renders one list item per image', () => {
    const { container } = renderWithRouter(<ProjectGallery images={IMAGES} projectTitle="DOLFIN" />)
    expect(container.querySelectorAll('li')).toHaveLength(3)
  })

  it('marks only the first image eager with high fetch priority', () => {
    renderWithRouter(<ProjectGallery images={IMAGES} projectTitle="DOLFIN" />)
    const imgs = screen.getAllByRole('img')
    expect(imgs[0]).toHaveAttribute('loading', 'eager')
    expect(imgs[0].getAttribute('fetchpriority')).toBe('high')
    expect(imgs[1]).toHaveAttribute('loading', 'lazy')
    expect(imgs[1].getAttribute('fetchpriority')).toBeNull()
    expect(imgs[2]).toHaveAttribute('loading', 'lazy')
    expect(imgs[2].getAttribute('fetchpriority')).toBeNull()
  })

  it('gives every image decoding=async and nominal width/height', () => {
    renderWithRouter(<ProjectGallery images={IMAGES} projectTitle="DOLFIN" />)
    for (const img of screen.getAllByRole('img')) {
      expect(img).toHaveAttribute('decoding', 'async')
      expect(img).toHaveAttribute('width', '1600')
      expect(img).toHaveAttribute('height', '879')
    }
  })

  it('builds alt text from the project title and image position', () => {
    renderWithRouter(<ProjectGallery images={IMAGES} projectTitle="DOLFIN" />)
    expect(screen.getByAltText('DOLFIN ekran görüntüsü 1')).toBeInTheDocument()
    expect(screen.getByAltText('DOLFIN ekran görüntüsü 2')).toBeInTheDocument()
    expect(screen.getByAltText('DOLFIN ekran görüntüsü 3')).toBeInTheDocument()
  })

  it('renders exactly the number of images given', () => {
    renderWithRouter(<ProjectGallery images={IMAGES} projectTitle="DOLFIN" />)
    expect(screen.getAllByRole('img')).toHaveLength(3)
  })
})
