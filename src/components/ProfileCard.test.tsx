import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProfileCard from './ProfileCard'

describe('ProfileCard', () => {
  it('renders the profile photo with intrinsic dimensions and LCP hints', () => {
    render(<ProfileCard />)
    const photo = screen.getByRole('img', { name: 'Ensar Aslan' })
    expect(photo).toHaveAttribute('width', '640')
    expect(photo).toHaveAttribute('height', '853')
    expect(photo).toHaveAttribute('loading', 'eager')
    expect(photo).toHaveAttribute('fetchpriority', 'high')
    expect(photo).toHaveAttribute('decoding', 'async')
  })

  it('renders the name and role as text, not as headings', () => {
    render(<ProfileCard />)
    expect(screen.getByText('Ensar Aslan')).toBeInTheDocument()
    expect(screen.getByText('Full Stack .NET Developer')).toBeInTheDocument()
    expect(screen.queryAllByRole('heading')).toHaveLength(0)
  })

  it('composes the contact rows and the social links', () => {
    render(<ProfileCard />)
    expect(screen.getByRole('link', { name: 'ensaraslannn@gmail.com' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'GitHub profili' })).toBeInTheDocument()
  })
})
