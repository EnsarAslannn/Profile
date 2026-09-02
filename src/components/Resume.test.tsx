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

  it('gives each card its own year photo', () => {
    const { container } = render(<Resume />)
    const images = Array.from(container.querySelectorAll('img'))
    expect(images).toHaveLength(ROADMAP_ENTRIES.tr.length)
    for (const [index, image] of images.entries()) {
      const entry = ROADMAP_ENTRIES.tr[index]
      expect(image.getAttribute('src')).toBe(entry.photo!.src)
      expect(image.getAttribute('alt')).toBe('')
      expect(image.getAttribute('width')).toBe(String(entry.photo!.width))
      expect(image.getAttribute('height')).toBe(String(entry.photo!.height))
      expect(image.getAttribute('loading')).toBe('lazy')
    }
    expect(new Set(images.map((i) => i.getAttribute('src'))).size).toBe(images.length)
  })

  it('puts the photo and the text on opposite sides of the spine, alternating', () => {
    const { container } = render(<Resume />)
    const items = Array.from(container.querySelectorAll('li'))
    expect(items).toHaveLength(4)

    for (const [index, item] of items.entries()) {
      const image = item.querySelector('img')!
      const copy = item.querySelector('time')!.closest('div')!

      expect(image.contains(copy)).toBe(false)
      expect(copy.contains(image)).toBe(false)
      expect(image.parentElement).toBe(copy.parentElement)

      const photoLeft = index % 2 === 0
      expect(image.className).toContain(photoLeft ? 'md:col-start-1' : 'md:col-start-2')
      expect(copy.className).toContain(photoLeft ? 'md:col-start-2' : 'md:col-start-1')
    }
  })

  it('shows the photos at full strength beside the text, not washed out behind it', () => {
    const { container } = render(<Resume />)
    for (const image of Array.from(container.querySelectorAll('img'))) {
      expect(image.className).not.toMatch(/opacity-/)
      expect(image.className).not.toMatch(/saturate-/)
      expect(image.className).not.toMatch(/absolute/)
    }
  })

  it('lists every entry once, oldest first, as an ordered list', () => {
    const { container } = render(<Resume />)
    expect(container.querySelector('ol')).not.toBeNull()
    const totalEntries = RESUME_GROUPS.tr.reduce((sum, group) => sum + group.entries.length, 0)
    expect(container.querySelectorAll('li')).toHaveLength(totalEntries)
    expect(ROADMAP_ENTRIES.tr.map((entry) => entry.year)).toEqual(['2020', '2023', '2024', '2025'])
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

  it('renders no prose description under any entry', () => {
    const { container } = render(<Resume />)
    expect(container.querySelectorAll('p[data-resume-description]')).toHaveLength(0)
    expect(screen.queryByText(/Agile iş akışları/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Uzaktan çalışma modelinde/)).not.toBeInTheDocument()
  })

  it('hides the timeline decoration from screen readers', () => {
    const { container } = render(<Resume />)
    const items = container.querySelectorAll('li')
    expect(items).toHaveLength(4)
    for (const item of Array.from(items)) {
      expect(item.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1)
      expect(item.querySelector('[aria-hidden="true"]')?.tagName).toBe('SPAN')
      expect(item.querySelector('img')?.hasAttribute('aria-hidden')).toBe(false)
    }
  })
})
