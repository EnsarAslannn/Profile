import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import About from './About'
import { renderWithRouter } from '../test/renderWithRouter'
import { ABOUT_PARAGRAPHS, ABOUT_TEASER } from '../data/about'
import { SITE_NAME, SITE_ROLE } from '../lib/siteMeta'

describe('About', () => {
  it('carries the hakkimda anchor the navbar links to', () => {
    const { container } = renderWithRouter(<About />)
    expect(container.querySelector('section#hakkimda')).not.toBeNull()
    expect(screen.getByRole('heading', { level: 2, name: 'Hakkımda' })).toBeInTheDocument()
    // The reference design's [001] kicker was reproduced and then removed at
    // the owner's request. Asserting its absence keeps a later "the reference
    // had numbers" pass from reinstating it by eye.
    expect(container.textContent).not.toMatch(/\[\d{3}]/)
  })

  it('opens with the statement, rendered as one continuous sentence', () => {
    const { container } = renderWithRouter(<About />)
    expect(container.textContent).toContain(
      'Full Stack .NET Developer olarak ölçeklenebilir, performanslı ve sürdürülebilir sistemler kuruyorum.',
    )
  })

  it('teases one paragraph and no more', () => {
    renderWithRouter(<About />)
    expect(screen.getByText(ABOUT_TEASER.text)).toBeInTheDocument()
    // The other three belong to /hakkimda. Showing them here would make
    // "Tam metni oku" lead to a page the visitor has already read.
    for (const paragraph of ABOUT_PARAGRAPHS) {
      if (paragraph.id === ABOUT_TEASER.id) continue
      expect(screen.queryByText(paragraph.text)).not.toBeInTheDocument()
    }
  })

  it('sends "Tam metni oku" to the full About route', () => {
    renderWithRouter(<About />)
    expect(screen.getByRole('link', { name: /Tam metni oku/ })).toHaveAttribute(
      'href',
      '/hakkimda',
    )
  })

  it('shows the identity card with the name and role from one source', () => {
    const { container } = renderWithRouter(<About />)
    expect(container.textContent).toContain(SITE_NAME)
    expect(container.textContent).toContain(SITE_ROLE)
  })

  // The portrait is the same photo the profile card uses, at thumbnail size,
  // next to the name in text. It carries no information of its own here.
  it('renders the portrait as decoration, with layout-stable dimensions', () => {
    const { container } = renderWithRouter(<About />)
    const image = container.querySelector('img')!
    expect(image.getAttribute('alt')).toBe('')
    expect(image.getAttribute('width')).toBe('640')
    expect(image.getAttribute('height')).toBe('853')
    expect(image.getAttribute('loading')).toBe('lazy')
    expect(image.getAttribute('decoding')).toBe('async')
  })
})
