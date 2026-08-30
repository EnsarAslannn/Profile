import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AboutPage from './AboutPage'
import { renderWithRouter } from '../test/renderWithRouter'
import { ABOUT_PARAGRAPHS } from '../data/about'

describe('AboutPage', () => {
  it('is the page "Tam metni oku" promises: every paragraph, in order', () => {
    const { container } = renderWithRouter(<AboutPage />, '/hakkimda')
    const rendered = Array.from(container.querySelectorAll('p[data-about-paragraph]')).map(
      (p) => p.textContent,
    )
    expect(rendered).toEqual(ABOUT_PARAGRAPHS.tr.map((paragraph) => paragraph.text))
  })

  it('titles itself Hakkımda as the route h1', () => {
    renderWithRouter(<AboutPage />, '/hakkimda')
    expect(screen.getByRole('heading', { level: 1, name: 'Hakkımda' })).toBeInTheDocument()
  })

  it('renders the profile card beside the prose, in two grid columns', () => {
    const { container } = renderWithRouter(<AboutPage />, '/hakkimda')
    // The card carries the contact rows, which is the reason it is on this
    // page at all - the redesign's home page has no room for them.
    expect(screen.getByText('ensaraslannn@gmail.com')).toBeInTheDocument()
    expect(screen.getByText('+90 538 053 1778')).toBeInTheDocument()
    const grid = container.querySelector('.lg\\:grid')!
    expect(grid.className).toMatch(/lg:grid-cols-\[288px_minmax\(0,1fr\)\]/)
    // Without min-w-0 the long paragraphs refuse to shrink and blow the
    // second track past its share of the row.
    expect(grid.querySelector('.lg\\:min-w-0')).not.toBeNull()
  })

  it('offers a way back to the home page', () => {
    renderWithRouter(<AboutPage />, '/hakkimda')
    expect(screen.getByRole('link', { name: /Geri/ })).toHaveAttribute('href', '/')
  })

  // The sticky card must never sit inside a revealed element: [data-reveal]
  // applies a transform and a filter, and either one makes the nearest
  // ancestor the containing block, which silently kills position: sticky.
  it('keeps the sticky wrapper out of every reveal target', () => {
    const { container } = renderWithRouter(<AboutPage />, '/hakkimda')
    const sticky = container.querySelector('.lg\\:sticky')!
    expect(sticky).not.toBeNull()
    expect(sticky.closest('[data-reveal]')).toBeNull()
  })
})
