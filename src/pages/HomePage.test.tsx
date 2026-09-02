import { describe, expect, it } from 'vitest'
import HomePage from './HomePage'
import { renderWithRouter } from '../test/renderWithRouter'
import { CONTENT_CONTAINER } from '../lib/layout'

describe('HomePage', () => {
  it('renders the sections in the reference design order', () => {
    const { container } = renderWithRouter(<HomePage />, '/')
    const ids = Array.from(container.querySelectorAll('section[id]')).map((section) => section.id)
    expect(ids).toEqual(['anasayfa', 'hakkimda', 'projeler', 'ozgecmis', 'yetenekler'])
  })

  it('prints no section index above any heading', () => {
    const { container } = renderWithRouter(<HomePage />, '/')
    expect(container.textContent).not.toMatch(/\[\d{3}]/)
  })

  it('opens every section band with the one shared content column', () => {
    const { container } = renderWithRouter(<HomePage />, '/')
    const main = container.querySelector('main')!
    expect(main.className).not.toMatch(/max-w-/)
    expect(main.className).not.toMatch(/px-/)

    const sections = Array.from(main.querySelectorAll('section[id]'))
    expect(sections.length).toBeGreaterThan(1)
    for (const section of sections) {
      expect(section.querySelector(':scope > div')?.className).toBe(CONTENT_CONTAINER)
    }
  })

  it('alternates the light and deep-green section bands', () => {
    const { container } = renderWithRouter(<HomePage />, '/')
    const bands = Array.from(container.querySelectorAll('section[id]')).map((section) => [
      section.id,
      section.getAttribute('data-tone') === 'dark'
        ? 'dark'
        : /bg-surface-sunken/.test(section.className)
          ? 'neutral'
          : 'cream',
    ])
    expect(bands).toEqual([
      ['anasayfa', 'cream'],
      ['hakkimda', 'dark'],
      ['projeler', 'cream'],
      ['ozgecmis', 'dark'],
      ['yetenekler', 'cream'],
    ])
  })

  it('marks the dark bands on the section element itself', () => {
    const { container } = renderWithRouter(<HomePage />, '/')
    for (const toned of Array.from(container.querySelectorAll('[data-tone]'))) {
      expect(toned.tagName).toBe('SECTION')
    }
  })
})
