import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HeroGallery from './HeroGallery'
import { HERO_IMAGES } from '../data/hero'

const columns = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('[class*="animate-drift"]')).map((track) =>
    Array.from(track.querySelectorAll('img')).map((img) => {
      const src = img.getAttribute('src')
      return HERO_IMAGES.find((image) => image.src === src)!.id
    }),
  )

describe('HeroGallery', () => {
  it('runs the left column in the owner-specified order', () => {
    const { container } = render(<HeroGallery />)
    const [left] = columns(container)
    expect(left.slice(0, HERO_IMAGES.length)).toEqual([
      'portrait',
      'takeauction',
      'erasmus',
      'dolfin',
      'brisa',
      'altitudelog',
    ])
  })

  it('renders every image, in both columns, exactly twice each', () => {
    const { container } = render(<HeroGallery />)
    const [left, right] = columns(container)
    for (const image of HERO_IMAGES) {
      expect(left.filter((id) => id === image.id)).toHaveLength(2)
      expect(right.filter((id) => id === image.id)).toHaveLength(2)
    }
  })

  it('never places the same image at the same position in both columns', () => {
    const { container } = render(<HeroGallery />)
    const [left, right] = columns(container)
    expect(left).toHaveLength(right.length)
    for (const [index, id] of left.entries()) {
      expect(right[index], `position ${index}`).not.toBe(id)
    }
  })

  it('gives the two columns opposite drift directions', () => {
    const { container } = render(<HeroGallery />)
    expect(container.querySelector('.animate-drift-up')).not.toBeNull()
    expect(container.querySelector('.animate-drift-down')).not.toBeNull()
  })
})
