import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import FooterLinkRow from './FooterLinkRow'
import { renderWithRouter } from '../test/renderWithRouter'
import { CONTACT_ITEMS } from '../data/contact'
import { SOCIAL_LINKS } from '../data/social'

describe('FooterLinkRow', () => {
  it('renders LinkedIn, GitHub and E-posta links in that order, plus the back-to-top button as a 4th item', () => {
    const { container } = renderWithRouter(<FooterLinkRow />)
    const items = container.querySelectorAll('li')
    expect(items).toHaveLength(4)
    const links = screen.getAllByRole('link')
    expect(links.map((link) => link.textContent)).toEqual(['LinkedIn', 'GitHub', 'E-posta'])
    expect(screen.getByRole('button', { name: 'Yukarı çık' })).toBeInTheDocument()
  })

  it('resolves the LinkedIn and GitHub hrefs from SOCIAL_LINKS and opens them safely in a new tab', () => {
    renderWithRouter(<FooterLinkRow />)
    const linkedin = SOCIAL_LINKS.find((s) => s.id === 'linkedin')!
    const github = SOCIAL_LINKS.find((s) => s.id === 'github')!
    const linkedinLink = screen.getByRole('link', { name: 'LinkedIn' })
    const githubLink = screen.getByRole('link', { name: 'GitHub' })
    expect(linkedinLink).toHaveAttribute('href', linkedin.href)
    expect(githubLink).toHaveAttribute('href', github.href)
    for (const link of [linkedinLink, githubLink]) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link.getAttribute('rel')).toContain('noopener')
      expect(link.getAttribute('rel')).toContain('noreferrer')
    }
  })

  it('resolves the E-posta href from CONTACT_ITEMS and carries no target', () => {
    renderWithRouter(<FooterLinkRow />)
    const email = CONTACT_ITEMS.find((item) => item.id === 'email')!
    const emailLink = screen.getByRole('link', { name: 'E-posta' })
    expect(emailLink).toHaveAttribute('href', email.href)
    expect(emailLink).not.toHaveAttribute('target')
  })

  it('carries no aria-label anywhere - the visible text is the accessible name', () => {
    const { container } = renderWithRouter(<FooterLinkRow />)
    const links = container.querySelectorAll('a')
    for (const link of links) {
      expect(link).not.toHaveAttribute('aria-label')
    }
  })
})
