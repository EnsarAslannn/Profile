import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LanguageProvider from '../i18n/LanguageProvider'
import LanguageToggle from './LanguageToggle'
import { describe, expect, it } from 'vitest'
import Hero from './Hero'
import { renderWithRouter } from '../test/renderWithRouter'
import { CV_FILE, HERO_IMAGES, HERO_PARAGRAPH, HERO_TITLE_LINES } from '../data/hero'

describe('Hero', () => {
  it('carries the anasayfa anchor the navbar links to', () => {
    const { container } = renderWithRouter(<Hero />)
    expect(container.querySelector('section#anasayfa')).not.toBeNull()
  })

  it('renders the wordmark as the page h1, one line per element', () => {
    const { container } = renderWithRouter(<Hero />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(Array.from(h1.querySelectorAll('span')).map((s) => s.textContent)).toEqual([
      ...HERO_TITLE_LINES.tr,
    ])
    expect(container.querySelectorAll('h1')).toHaveLength(1)
  })

  it('offers the three calls to action, the first two as router links', () => {
    renderWithRouter(<Hero />)
    expect(screen.getByRole('link', { name: /İletişime geç/ })).toHaveAttribute('href', '/#iletisim')
    expect(screen.getByRole('link', { name: /Projeleri keşfet/ })).toHaveAttribute(
      'href',
      '/#projeler',
    )
  })

  // A plain <a download>, not a router link: the CV is a static file in
  // public/, and without the download attribute the browser would navigate
  // the tab to a PDF viewer instead of saving it.
  it('offers the CV as a download rather than a navigation', () => {
    renderWithRouter(<Hero />)
    const cv = screen.getByRole('link', { name: /CV indir/ })
    expect(cv).toHaveAttribute('href', CV_FILE.tr)
    expect(cv).toHaveAttribute('download')
    expect(cv.getAttribute('target')).toBeNull()
  })

  // An English reader must not be handed the Turkish CV. They are two
  // different documents (see hero.test.ts), so the button has to follow the
  // language and not merely the label.
  it('serves the English CV when the page is in English', () => {
    render(
      <MemoryRouter>
        <LanguageProvider>
          <LanguageToggle />
          <Hero />
        </LanguageProvider>
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    const cv = screen.getByRole('link', { name: /Download CV/ })
    expect(cv).toHaveAttribute('href', CV_FILE.en)
    expect(cv).toHaveAttribute('download')
  })

  // The paragraph is the owner's own Hakkımda opening, split for emphasis.
  // Rendering it segment-by-segment must still read as one continuous
  // sentence - a stray space or a dropped fragment would only show up here.
  it('reads out as the owner-supplied paragraph, uninterrupted', () => {
    const { container } = renderWithRouter(<Hero />)
    const paragraph = container.querySelector('p')
    expect(paragraph?.textContent).toBe(HERO_PARAGRAPH.tr)
  })

  it('renders each gallery image twice, so the drift loop can wrap seamlessly', () => {
    const { container } = renderWithRouter(<Hero />)
    const sources = Array.from(container.querySelectorAll('img')).map((img) =>
      img.getAttribute('src'),
    )
    for (const image of HERO_IMAGES) {
      // Two columns, two copies each - but the columns hold different
      // subsets, so the guarantee is "at least twice", never "exactly once".
      expect(sources.filter((src) => src === image.src).length).toBeGreaterThanOrEqual(2)
    }
  })

  // The whole collage is decoration; the owner's name is the h1 and both
  // screenshots are real content in Projeler. Every tile is also rendered
  // twice, so exposing them would mean hearing the same list through twice.
  it('hides the decorative gallery from screen readers and gives no image an alt text', () => {
    const { container } = renderWithRouter(<Hero />)
    const images = Array.from(container.querySelectorAll('img'))
    expect(images.length).toBeGreaterThan(0)
    for (const image of images) {
      expect(image.getAttribute('alt')).toBe('')
      expect(image.closest('[aria-hidden="true"]')).not.toBeNull()
    }
  })

  it('gives every image the CLS-preventing width, height and lazy attributes', () => {
    const { container } = renderWithRouter(<Hero />)
    for (const image of Array.from(container.querySelectorAll('img'))) {
      expect(image.getAttribute('width')).toBeTruthy()
      expect(image.getAttribute('height')).toBeTruthy()
      expect(image.getAttribute('loading')).toBe('lazy')
      expect(image.getAttribute('decoding')).toBe('async')
    }
  })
})
