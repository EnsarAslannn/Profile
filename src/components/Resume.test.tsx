import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Resume from './Resume'

describe('Resume', () => {
  it('keeps the section anchor the footer links to', () => {
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

  // Removed at the owner's request: each internship is now title +
  // organization + dates only. Asserting their absence keeps them from
  // creeping back in a later edit.
  it('renders no prose description under any entry', () => {
    const { container } = render(<Resume />)
    expect(container.querySelectorAll('p[data-resume-description]')).toHaveLength(0)
    expect(screen.queryByText(/Agile iş akışları/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Uzaktan çalışma modelinde/)).not.toBeInTheDocument()
  })

  it('draws each entry as a timeline row: one accent dot, hidden from screen readers', () => {
    const { container } = render(<Resume />)
    const items = container.querySelectorAll('li')
    expect(items).toHaveLength(4)
    for (const item of items) {
      const dots = item.querySelectorAll('span[aria-hidden="true"]')
      expect(dots).toHaveLength(1)
      // Decoration only - it must carry no text a screen reader would read
      // out between the entry title and its organization.
      expect(dots[0].textContent).toBe('')
    }
  })

  it('gives each group an aria-hidden icon, so the heading text stays the only accessible name', () => {
    const { container } = render(<Resume />)
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings.map((h) => h.textContent)).toEqual(['Eğitim', 'Deneyim'])
    const icons = container.querySelectorAll('svg[aria-hidden="true"]')
    expect(icons).toHaveLength(2)
  })

  it('keeps the group headings visually smaller than the section heading', () => {
    render(<Resume />)
    const h2 = screen.getByRole('heading', { level: 2, name: 'Özgeçmiş' })
    const h3 = screen.getByRole('heading', { level: 3, name: 'Deneyim' })
    // jsdom does not do layout, so this compares the utilities that set the
    // size rather than measured pixels. The owner asked for a visible step
    // down from Özgeçmiş to Eğitim/Deneyim; equal classes would erase it.
    expect(h2.className).toMatch(/\btext-3xl\b/)
    expect(h2.className).toMatch(/\bsm:text-4xl\b/)
    expect(h3.className).toMatch(/\btext-xl\b/)
    expect(h3.className).toMatch(/\bsm:text-2xl\b/)
    expect(h3.className).not.toMatch(/\btext-3xl\b/)
  })
})
