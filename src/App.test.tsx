import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'
import { renderWithRouter } from './test/renderWithRouter'

describe('App', () => {
  it('has exactly one h1 on the page', () => {
    renderWithRouter(<App />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('links every navbar anchor to a section that exists', () => {
    // Navbar renders router Links with absolute-to-home hash hrefs
    // (`/#hakkimda`), so this reads the fragment after `/#`.
    const { container } = renderWithRouter(<App />)
    const anchors = Array.from(container.querySelectorAll('nav a[href^="/#"]'))
    expect(anchors.length).toBeGreaterThan(0)
    for (const anchor of anchors) {
      const id = anchor.getAttribute('href')?.slice(2)
      expect(container.querySelector(`section#${id}`)).not.toBeNull()
    }
  })

  it('aligns navbar, main and footer on one container width', () => {
    const { container } = renderWithRouter(<App />)
    const nav = container.querySelector('nav')
    const main = container.querySelector('main')
    const footerWrapper = container.querySelector('footer')?.parentElement
    const widthOf = (el: Element | null | undefined) =>
      el?.className.split(' ').find((token) => token.startsWith('max-w-'))
    const paddingOf = (el: Element | null | undefined) =>
      el?.className.split(' ').find((token) => token === 'px-6' || token.startsWith('px-6'))
    expect(widthOf(nav)).toBeDefined()
    expect(widthOf(nav)).toEqual(widthOf(main))
    expect(widthOf(main)).toEqual(widthOf(footerWrapper))
    expect(paddingOf(nav)).toEqual(paddingOf(main))
    expect(paddingOf(main)).toEqual(paddingOf(footerWrapper))
  })

  it('uses the max-w-7xl container width', () => {
    const { container } = renderWithRouter(<App />)
    const main = container.querySelector('main')
    const token = main?.className.split(' ').find((t) => t.startsWith('max-w-'))
    expect(token).toBe('max-w-7xl')
  })

  it('redirects an unknown path back to the home page', () => {
    renderWithRouter(<App />, '/nosuchpage')
    expect(screen.getByRole('heading', { level: 1, name: 'Hakkımda' })).toBeInTheDocument()
  })
})
