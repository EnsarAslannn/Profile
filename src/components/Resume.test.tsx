import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Resume from './Resume'
import { RESUME_GROUPS, ROADMAP_ENTRIES } from '../data/resume'

describe('Resume', () => {
  it('keeps the section anchor the navbar links to', () => {
    const { container } = render(<Resume />)
    expect(container.querySelector('section#ozgecmis')).not.toBeNull()
  })

  it('renders Özgeçmiş as an h2, with no section index above it', () => {
    const { container } = render(<Resume />)
    expect(screen.getByRole('heading', { level: 2, name: 'Özgeçmiş' })).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/\[\d{3}]/)
  })

  // Owner-supplied photograph per year, keyed by year in src/data/resume.ts.
  // Decoration: alt="" and aria-hidden, because the year it illustrates is
  // right there as text and the photo says nothing a screen reader needs.
  it('paints each card with its own year photo, as decoration', () => {
    const { container } = render(<Resume />)
    const images = Array.from(container.querySelectorAll('img'))
    expect(images).toHaveLength(ROADMAP_ENTRIES.length)
    for (const [index, image] of images.entries()) {
      const entry = ROADMAP_ENTRIES[index]
      expect(image.getAttribute('src')).toBe(entry.background!.src)
      expect(image.getAttribute('alt')).toBe('')
      expect(image.getAttribute('aria-hidden')).toBe('true')
      expect(image.getAttribute('width')).toBe(String(entry.background!.width))
      expect(image.getAttribute('height')).toBe(String(entry.background!.height))
      expect(image.getAttribute('loading')).toBe('lazy')
    }
    // Four distinct photographs, not the same one four times.
    expect(new Set(images.map((i) => i.getAttribute('src'))).size).toBe(images.length)
  })

  // A roadmap is a timeline, so the two Özgeçmiş groups interleave by date
  // rather than standing as two columns. Losing that ordering would turn the
  // spine into a meaningless zig-zag, which is why it is pinned here.
  it('lists every entry once, oldest first, as an ordered list', () => {
    const { container } = render(<Resume />)
    expect(container.querySelector('ol')).not.toBeNull()
    const totalEntries = RESUME_GROUPS.reduce((sum, group) => sum + group.entries.length, 0)
    expect(container.querySelectorAll('li')).toHaveLength(totalEntries)
    expect(ROADMAP_ENTRIES.map((entry) => entry.year)).toEqual(['2020', '2023', '2024', '2025'])
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

  // Flattening the two groups must not lose which group an entry came from -
  // that is the entire information content of the old two-column layout.
  it('keeps the group of every entry visible as a chip', () => {
    render(<Resume />)
    expect(screen.getAllByText('Eğitim')).toHaveLength(2)
    expect(screen.getAllByText('Deneyim')).toHaveLength(2)
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

  // The reference design's roadmap cards carry a prose paragraph. This site's
  // entries deliberately have none - the owner had the internship
  // descriptions removed - and this asserts none was invented to fill the
  // slot the reference leaves open.
  it('renders no prose description under any entry', () => {
    const { container } = render(<Resume />)
    expect(container.querySelectorAll('p[data-resume-description]')).toHaveLength(0)
    expect(screen.queryByText(/Agile iş akışları/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Uzaktan çalışma modelinde/)).not.toBeInTheDocument()
  })

  // One dot and one background photo per card, both decoration.
  it('hides the timeline decoration from screen readers', () => {
    const { container } = render(<Resume />)
    const items = container.querySelectorAll('li')
    expect(items).toHaveLength(4)
    for (const item of Array.from(items)) {
      expect(item.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2)
    }
  })
})
