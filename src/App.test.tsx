import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'
import { renderWithRouter } from './test/renderWithRouter'
import { NAV_LINKS } from './data/navigation'
import { CONTENT_CONTAINER } from './lib/layout'

describe('App', () => {
  it('has exactly one h1 on the page', () => {
    renderWithRouter(<App />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('renders exactly one section per NAV_LINKS.tr anchor, in order', () => {
    const { container } = renderWithRouter(<App />)
    const ids = Array.from(container.querySelectorAll('section[id]')).map((section) => section.id)
    expect(ids).toEqual(NAV_LINKS.tr.map((link) => link.anchor))
  })

  it('links every navbar anchor to a section that exists', () => {
    const { container } = renderWithRouter(<App />)
    const anchors = Array.from(container.querySelectorAll('nav a[href^="/#"]'))
    expect(anchors.length).toBe(NAV_LINKS.tr.length)
    for (const anchor of anchors) {
      const id = anchor.getAttribute('href')?.slice(2)
      expect(container.querySelector(`section#${id}`)).not.toBeNull()
    }
  })

  it('lays the navbar, the body and the contact block on one content column', () => {
    for (const route of ['/', '/projects/dolfin', '/hakkimda']) {
      const { container, unmount } = renderWithRouter(<App />, route)

      expect(container.querySelector('header > div')?.className).toContain(CONTENT_CONTAINER)

      const footerColumns = Array.from(
        container.querySelectorAll('footer div[class*="max-w-"]'),
      )
      expect(footerColumns.length).toBeGreaterThan(1)
      for (const column of footerColumns) {
        expect(column.className).toBe(CONTENT_CONTAINER)
      }

      expect(CONTENT_CONTAINER).toContain('max-w-7xl')
      unmount()
    }
  })

  it('keeps the sticky navbar clear of the anchors it scrolls to', () => {
    const { container } = renderWithRouter(<App />)
    for (const section of Array.from(container.querySelectorAll('section[id]'))) {
      expect(section.className).toMatch(/\bscroll-mt-24\b/)
    }
  })

  it('redirects an unknown path back to the home page', () => {
    const { container } = renderWithRouter(<App />, '/nosuchpage')
    expect(container.querySelector('section#anasayfa')).not.toBeNull()
  })

  it('routes /hakkimda to the full About page', () => {
    renderWithRouter(<App />, '/hakkimda')
    expect(screen.getByRole('heading', { level: 1, name: 'Hakkımda' })).toBeInTheDocument()
  })

  describe('skip link', () => {
    for (const route of ['/', '/hakkimda', '/projects/dolfin']) {
      it(`is the first focusable element on ${route} and targets its main`, () => {
        const { container } = renderWithRouter(<App />, route)

        const focusable = Array.from(
          container.querySelectorAll<HTMLElement>('a[href], button, [tabindex]'),
        )
        const first = focusable[0]
        expect(first.tagName).toBe('A')
        expect(first.getAttribute('href')).toBe('#main')
        expect(first.textContent).toBe('İçeriğe geç')

        const main = container.querySelector('main#main')
        expect(main).not.toBeNull()
        expect(main?.getAttribute('tabindex')).toBe('-1')
      })
    }

    it('is visually hidden until focused, without leaving the focus order', () => {
      const { container } = renderWithRouter(<App />)
      const link = container.querySelector<HTMLElement>('a[href="#main"]')
      expect(link?.className).toMatch(/\bsr-only\b/)
      expect(link?.className).toMatch(/\bfocus:not-sr-only\b/)
      expect(link?.className).not.toMatch(/\bhidden\b/)
    })

    it('scopes its padding to :focus, so not-sr-only cannot flatten the pill', () => {
      const { container } = renderWithRouter(<App />)
      const classes = container.querySelector('a[href="#main"]')?.className.split(/\s+/) ?? []

      const padding = classes.filter((name) => /(^|:)p[xytrbl]?-/.test(name))
      expect(padding.length).toBeGreaterThan(0)
      for (const name of padding) {
        expect(name, `${name} is reset to 0 by focus:not-sr-only`).toMatch(/^focus:/)
      }
    })
  })
})
