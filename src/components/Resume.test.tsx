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
  // alt="" because it is decorative - the year it illustrates, the role and
  // the organisation are all beside it as real text, and no owner-supplied
  // description of these photographs exists to use instead.
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
    // Four distinct photographs, not the same one four times.
    expect(new Set(images.map((i) => i.getAttribute('src'))).size).toBe(images.length)
  })

  // The photo and the copy are SIBLINGS across the timeline spine - the photo
  // in one grid column, the text in the other, swapping sides each entry
  // (owner's example.png). This has been got wrong twice: once with the text
  // laid over the photo, once with it in a second column INSIDE the card,
  // which reads as a caption rather than as the entry itself. Both look
  // plausible in a diff, so the arrangement is pinned rather than described.
  it('puts the photo and the text on opposite sides of the spine, alternating', () => {
    const { container } = render(<Resume />)
    const items = Array.from(container.querySelectorAll('li'))
    expect(items).toHaveLength(4)

    for (const [index, item] of items.entries()) {
      const image = item.querySelector('img')!
      const copy = item.querySelector('time')!.closest('div')!

      // Neither contains the other: they are two halves of one row.
      expect(image.contains(copy)).toBe(false)
      expect(copy.contains(image)).toBe(false)
      expect(image.parentElement).toBe(copy.parentElement)

      // ...and they swap columns every entry, so the timeline zig-zags.
      const photoLeft = index % 2 === 0
      expect(image.className).toContain(photoLeft ? 'md:col-start-1' : 'md:col-start-2')
      expect(copy.className).toContain(photoLeft ? 'md:col-start-2' : 'md:col-start-1')
    }
  })

  // The photographs are shown at FULL strength beside the text, not washed out
  // behind it (owner's request). The old layout dimmed them to 22-45% and
  // absolutely positioned them under the copy, which forced every line on the
  // card onto a single ink to survive the contrast budget. Both halves of that
  // are pinned here, because a re-introduced opacity or an absolute position
  // would look like a small styling tweak and would quietly cost the card its
  // colour hierarchy again.
  it('shows the photos at full strength beside the text, not washed out behind it', () => {
    const { container } = render(<Resume />)
    for (const image of Array.from(container.querySelectorAll('img'))) {
      expect(image.className).not.toMatch(/opacity-/)
      expect(image.className).not.toMatch(/saturate-/)
      expect(image.className).not.toMatch(/absolute/)
    }
  })

  // A roadmap is a timeline, so the two Özgeçmiş groups interleave by date
  // rather than standing as two columns. Losing that ordering would turn the
  // spine into a meaningless zig-zag, which is why it is pinned here.
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

  // One aria-hidden element per card - the spine dot. The photo used to carry
  // aria-hidden too, back when it was a decorative background layer; now that
  // it is an ordinary <img alt=""> in its own column the attribute would be
  // redundant ARIA, which CLAUDE.md counts as a defect rather than a safety
  // net. alt="" already removes it from the accessibility tree.
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
