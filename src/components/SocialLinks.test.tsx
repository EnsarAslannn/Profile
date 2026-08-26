import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SocialLinks from './SocialLinks'

describe('SocialLinks', () => {
  it('gives the LinkedIn icon link an accessible Turkish name and the exact href', () => {
    render(<SocialLinks />)
    const link = screen.getByRole('link', { name: 'LinkedIn profili' })
    expect(link).toHaveAttribute('href', 'https://linkedin.com/in/ensaraslannn')
  })

  it('gives the GitHub icon link an accessible Turkish name and the exact href', () => {
    render(<SocialLinks />)
    const link = screen.getByRole('link', { name: 'GitHub profili' })
    expect(link).toHaveAttribute('href', 'https://github.com/EnsarAslannn')
  })

  it('opens external profiles safely in a new tab', () => {
    render(<SocialLinks />)
    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  it('renders exactly two social links', () => {
    render(<SocialLinks />)
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })
})
