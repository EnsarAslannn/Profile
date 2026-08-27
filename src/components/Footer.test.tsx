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

  it("renders the owner's name as text", () => {
    renderWithRouter(<Footer />)
    expect(screen.getAllByText(SITE_NAME).length).toBeGreaterThan(0)
  })

  it('resolves the mailto and tel links to the values in CONTACT_ITEMS', () => {
    renderWithRouter(<Footer />)
    const email = CONTACT_ITEMS.find((item) => item.id === 'email')!
    const phone = CONTACT_ITEMS.find((item) => item.id === 'phone')!
    expect(screen.getByRole('link', { name: email.value })).toHaveAttribute('href', email.href)
    expect(screen.getByRole('link', { name: phone.value })).toHaveAttribute('href', phone.href)
  })

  it('opens both social links safely in a new tab', () => {
    renderWithRouter(<Footer />)
    for (const social of SOCIAL_LINKS) {
      const link = screen.getByRole('link', { name: social.label })
      expect(link).toHaveAttribute('target', '_blank')
      expect(link.getAttribute('rel')).toContain('noopener')
      expect(link.getAttribute('rel')).toContain('noreferrer')
    }
  })

  it('shows the current year in the copyright line', () => {
    renderWithRouter(<Footer />)
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument()
  })

  it('ships no fabricated third-party marketing copy', () => {
    const { container } = renderWithRouter(<Footer />)
    const text = container.textContent ?? ''
    for (const banned of ['Nur/ui', 'nurui', 'Sylhet', 'Facebook', 'Twitter', 'Dribbble', 'Live Chat', 'Placeholder']) {
      expect(text).not.toContain(banned)
    }
  })
})
