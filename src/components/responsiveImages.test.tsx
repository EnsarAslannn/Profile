import { describe, expect, it } from 'vitest'
import App from '../App'
import { renderWithRouter } from '../test/renderWithRouter'

const ROUTES = ['/', '/hakkimda', '/projects/dolfin']

describe('responsive images', () => {
  it('pairs every srcset with a sizes attribute, or the browser assumes 100vw', () => {
    for (const route of ROUTES) {
      const { container, unmount } = renderWithRouter(<App />, route)
      const images = Array.from(container.querySelectorAll('img'))
      expect(images.length, route).toBeGreaterThan(0)

      for (const image of images) {
        if (!image.getAttribute('srcset')) continue
        expect(image.getAttribute('sizes'), `${route} ${image.getAttribute('src')}`).toBeTruthy()
      }
      unmount()
    }
  })

  it('offers a smaller candidate than the layout box for the photographs on the home page', () => {
    const { container } = renderWithRouter(<App />, '/')
    const withSrcSet = Array.from(container.querySelectorAll('img')).filter((image) =>
      image.getAttribute('srcset'),
    )

    expect(withSrcSet.length).toBeGreaterThan(5)
    for (const image of withSrcSet) {
      const widths = (image.getAttribute('srcset') ?? '')
        .split(', ')
        .map((candidate) => Number(candidate.split(' ')[1].replace('w', '')))
      expect(widths.length).toBeGreaterThan(1)
      expect(Math.min(...widths)).toBeLessThanOrEqual(400)
    }
  })

  it('keeps the width, height, loading and decoding attributes every image already had', () => {
    const { container } = renderWithRouter(<App />, '/')

    for (const image of Array.from(container.querySelectorAll('img'))) {
      expect(image.getAttribute('width')).toBeTruthy()
      expect(image.getAttribute('height')).toBeTruthy()
      expect(image.getAttribute('decoding')).toBe('async')
      expect(['lazy', 'eager']).toContain(image.getAttribute('loading'))
    }
  })
})
