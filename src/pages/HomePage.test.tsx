import { describe, expect, it } from 'vitest'
import HomePage from './HomePage'
import { renderWithRouter } from '../test/renderWithRouter'
import { CONTENT_CONTAINER } from '../lib/layout'

describe('HomePage', () => {
  it('renders the sections in the reference design order', () => {
    const { container } = renderWithRouter(<HomePage />, '/')
    const ids = Array.from(container.querySelectorAll('section[id]')).map((section) => section.id)
    // `iletisim` is deliberately absent: it is site chrome, rendered by
    // App.tsx outside <Routes> so every route ends the same way. App.test.tsx
    // is what proves the full NAV_LINKS.tr set resolves.
    expect(ids).toEqual(['anasayfa', 'hakkimda', 'projeler', 'ozgecmis', 'yetenekler'])
  })

  // The reference design prints a [001]-style index above every heading. It
  // was reproduced and then removed at the owner's request, so no section may
  // carry one.
  it('prints no section index above any heading', () => {
    const { container } = renderWithRouter(<HomePage />, '/')
    expect(container.textContent).not.toMatch(/\[\d{3}]/)
  })

  // Every section is a full-bleed BAND that paints its own ground, so <main>
  // carries no width cap and no padding - the column moved INSIDE each
  // section, as that section's first child. It has to be the same column in
  // every one of them, or two neighbouring bands would sit on different left
  // edges, which is exactly the drift a shared constant exists to prevent.
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

  // The alternating light/dark rhythm is a design decision, not an accident of
  // section order, and it is invisible in jsdom - there is no layout and no
  // computed colour here, so a band that lost its ground would look perfectly
  // healthy in every other test. This pins which sections are dark and which
  // are light, in order, so reordering or restyling one cannot quietly break
  // the cream -> green -> cream -> green -> cream cadence.
  //
  // Stacks was the light neutral for one round and is now cream, matching
  // İletişim at the owner's request; the neutral belongs to the two Marquee
  // strips alone, which makes both of them the same thing - a seam between a
  // deep-green band and a cream one.
  //
  // `iletisim` is absent for the same reason it is absent above: App.tsx
  // renders it, and it closes the rhythm on cream.
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

  // A dark band inverts the role tokens for its whole subtree (see the
  // [data-tone='dark'] block in src/index.css). That only works while the
  // attribute sits on the section itself - moved to an inner wrapper it would
  // stop painting the band, and the section's own padding would show cream.
  it('marks the dark bands on the section element itself', () => {
    const { container } = renderWithRouter(<HomePage />, '/')
    for (const toned of Array.from(container.querySelectorAll('[data-tone]'))) {
      expect(toned.tagName).toBe('SECTION')
    }
  })
})
