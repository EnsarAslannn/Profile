import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import FooterNav from './FooterNav'
import { renderWithRouter } from '../test/renderWithRouter'
import { NAV_LINKS } from '../data/navigation'
import { PROJECTS } from '../data/projects'

describe('FooterNav', () => {
  it('renders both column headings', () => {
    renderWithRouter(<FooterNav />)
    expect(screen.getByRole('heading', { level: 3, name: 'Bölümler' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Projeler' })).toBeInTheDocument()
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

  it("the projects column's hrefs match PROJECTS exactly", () => {
    renderWithRouter(<FooterNav />)
    for (const project of PROJECTS) {
      expect(screen.getByRole('link', { name: project.title })).toHaveAttribute(
        'href',
        `/projects/${project.slug}`,
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
