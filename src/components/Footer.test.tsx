import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Footer from './Footer'
import { renderWithRouter } from '../test/renderWithRouter'
import { CONTACT_ITEMS } from '../data/contact'
import { SOCIAL_LINKS } from '../data/social'
import { SITE_NAME } from '../lib/siteMeta'

describe('Footer', () => {
  it('renders exactly one footer element', () => {
    const { container } = renderWithRouter(<Footer />)
    expect(container.querySelectorAll('footer')).toHaveLength(1)
  })

  it("renders the owner's name as text - in the copyright line and the decorative wordmark", () => {
    const { container } = renderWithRouter(<Footer />)
    expect(screen.getAllByText(new RegExp(SITE_NAME)).length).toBeGreaterThan(0)
    const wordmarkTexts = container.querySelectorAll('text')
    expect(wordmarkTexts).toHaveLength(2)
    for (const text of wordmarkTexts) {
      expect(text.textContent).toBe(SITE_NAME)
    }
  })

  it('resolves the E-posta link to the value in CONTACT_ITEMS', () => {
    renderWithRouter(<Footer />)
    const email = CONTACT_ITEMS.find((item) => item.id === 'email')!
    expect(screen.getByRole('link', { name: 'E-posta' })).toHaveAttribute('href', email.href)
  })

  it('opens both social links safely in a new tab, and never puts a target on the mailto link', () => {
    renderWithRouter(<Footer />)
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
    const emailLink = screen.getByRole('link', { name: 'E-posta' })
    expect(emailLink).not.toHaveAttribute('target')
  })

  it('shows the current year in the copyright line', () => {
    renderWithRouter(<Footer />)
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument()
  })

  it('reads the location from CONTACT_ITEMS in the meta strip', () => {
    renderWithRouter(<Footer />)
    const location = CONTACT_ITEMS.find((item) => item.id === 'location')!
    expect(screen.getByText(location.value)).toBeInTheDocument()
  })

  it('ships no fabricated third-party marketing copy', () => {
    const { container } = renderWithRouter(<Footer />)
    const text = container.textContent ?? ''
    for (const banned of [
      'Nur/ui',
      'nurui',
      'Sylhet',
      'Facebook',
      'Twitter',
      'Dribbble',
      'Live Chat',
      'Placeholder',
      'Made in',
      'Ontario',
      'Canada',
    ]) {
      expect(text).not.toContain(banned)
    }
  })
})
