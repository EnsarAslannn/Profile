import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import FooterNav from './FooterNav'
import { renderWithRouter } from '../test/renderWithRouter'
import { NAV_LINKS } from '../data/navigation'

describe('FooterNav', () => {
  it('renders no heading - it is a single centred row, not headed columns', () => {
    const { container } = renderWithRouter(<FooterNav />)
    expect(container.querySelectorAll('h3')).toHaveLength(0)
  })

  it('renders exactly NAV_LINKS.length links', () => {
    renderWithRouter(<FooterNav />)
    expect(screen.getAllByRole('link')).toHaveLength(NAV_LINKS.length)
  })

  it("the sections column's hrefs match NAV_LINKS exactly, absolute-to-home", () => {
    renderWithRouter(<FooterNav />)
    for (const link of NAV_LINKS) {
      expect(screen.getByRole('link', { name: link.label })).toHaveAttribute(
        'href',
        `/#${link.anchor}`,
      )
    }
  })

  it('never renders a bare #-prefixed href', () => {
    const { container } = renderWithRouter(<FooterNav />)
    const anchors = Array.from(container.querySelectorAll('a'))
    expect(anchors.length).toBeGreaterThan(0)
    for (const anchor of anchors) {
      expect(anchor.getAttribute('href')?.startsWith('#')).toBe(false)
    }
  })
})
