import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ContactList from './ContactList'

describe('ContactList', () => {
  it('renders the e-posta row as a mailto link', () => {
    render(<ContactList />)
    const link = screen.getByRole('link', { name: 'ensaraslannn@gmail.com' })
    expect(link).toHaveAttribute('href', 'mailto:ensaraslannn@gmail.com')
  })

  it('renders the telefon row as a tel link with an E.164 href', () => {
    render(<ContactList />)
    const link = screen.getByRole('link', { name: '+90 538 053 1778' })
    expect(link).toHaveAttribute('href', 'tel:+905380531778')
  })

  it('renders konum as plain text, not a link', () => {
    render(<ContactList />)
    expect(screen.getByText('Türkiye / Kocaeli')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Türkiye / Kocaeli' })).toBeNull()
  })

  it('exposes a Turkish label for every row', () => {
    render(<ContactList />)
    expect(screen.getByText('E-posta')).toBeInTheDocument()
    expect(screen.getByText('Telefon')).toBeInTheDocument()
    expect(screen.getByText('Konum')).toBeInTheDocument()
  })

  it('renders exactly three rows as list items', () => {
    render(<ContactList />)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
})
