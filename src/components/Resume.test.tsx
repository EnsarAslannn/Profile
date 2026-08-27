import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Resume from './Resume'

describe('Resume', () => {
  it('keeps the section anchor the navbar links to', () => {
    const { container } = render(<Resume />)
    expect(container.querySelector('section#ozgecmis')).not.toBeNull()
  })

  it('renders Özgeçmiş as an h2 and the two group headings as h3', () => {
    render(<Resume />)
    expect(screen.getByRole('heading', { level: 2, name: 'Özgeçmiş' })).toBeInTheDocument()
    const h3s = screen.getAllByRole('heading', { level: 3 })
    expect(h3s.map((h) => h.textContent)).toEqual(['Eğitim', 'Deneyim'])
  })

  it('renders two entries in each group as list items', () => {
    render(<Resume />)
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('renders every entry title and organization verbatim', () => {
    render(<Resume />)
    expect(screen.getByText('Bilgisayar Mühendisliği (%100 İngilizce)')).toBeInTheDocument()
    expect(screen.getByText('Karabük Üniversitesi')).toBeInTheDocument()
    expect(screen.getByText('Computer Science - Erasmus+ Program')).toBeInTheDocument()
    expect(screen.getByText('University of Bielsko-Biala')).toBeInTheDocument()
    expect(screen.getAllByText('Stajyer')).toHaveLength(2)
    expect(
      screen.getByText('Brisa Bridgestone Sabancı Lastik Sanayi ve Ticaret A.Ş.'),
    ).toBeInTheDocument()
    expect(screen.getByText('AZR Bilişim Eğitim Mühendislik ve Danışmanlık')).toBeInTheDocument()
  })

  it('renders each date range as two time elements with machine-readable months', () => {
    const { container } = render(<Resume />)
    const times = container.querySelectorAll('time')
    expect(times).toHaveLength(8)
    expect(Array.from(times).map((t) => t.getAttribute('datetime'))).toEqual([
      '2020-08',
      '2025-08',
      '2023-02',
      '2023-06',
      '2024-08',
      '2024-09',
      '2025-06',
      '2025-07',
    ])
    expect(times[0].textContent).toBe('08/2020')
  })

  it('no longer renders a skills placeholder', () => {
    render(<Resume />)
    expect(screen.queryByText(/Yetenekler/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Placeholder/)).not.toBeInTheDocument()
  })
})
