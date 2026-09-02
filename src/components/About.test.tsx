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
    expect(screen.getByText(ABOUT_TEASER.tr.text)).toBeInTheDocument()
    for (const paragraph of ABOUT_PARAGRAPHS.tr) {
      if (paragraph.id === ABOUT_TEASER.tr.id) continue
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
