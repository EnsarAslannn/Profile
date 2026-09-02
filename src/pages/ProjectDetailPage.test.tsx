import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { PROJECTS, getProjectBySlug } from '../data/projects'
import { getProjectCover } from '../data/projectCovers'
import { renderWithRouter } from '../test/renderWithRouter'

describe('ProjectDetailPage', () => {
  it('renders the dolfin project at /projects/dolfin', () => {
    const { container } = renderWithRouter(<App />, '/projects/dolfin')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'DOLFIN' })).toBeInTheDocument()
    expect(screen.getByText('Finansal Portföy Yönetim Platformu')).toBeInTheDocument()
    expect(container.querySelectorAll('img')).toHaveLength(6)
    const dolfin = getProjectBySlug('dolfin')!
    const paragraphs = [...container.querySelectorAll('main p')].map((p) => p.textContent)
    for (const paragraph of dolfin.description) {
      expect(paragraphs).toContain(paragraph)
    }
    expect(paragraphs.filter((text) => dolfin.description.includes(text ?? ''))).toEqual([
      ...dolfin.description,
    ])
  })

  it('renders the takeauction project at /projects/takeauction', () => {
    const { container } = renderWithRouter(<App />, '/projects/takeauction')
    expect(screen.getByRole('heading', { level: 1, name: 'TakeAuction' })).toBeInTheDocument()
    expect(container.querySelectorAll('img')).toHaveLength(5)
  })

  it('renders the altitudelog project at /projects/altitudelog', () => {
    const { container } = renderWithRouter(<App />, '/projects/altitudelog')
    expect(screen.getByRole('heading', { level: 1, name: 'AltitudELog' })).toBeInTheDocument()
    expect(container.querySelectorAll('img')).toHaveLength(7)
  })

  it('renders the cover as the first image in DOM order, before the h1, as the LCP image', () => {
    const { container } = renderWithRouter(<App />, '/projects/dolfin')
    const images = container.querySelectorAll('img')
    const firstImage = images[0]
    const h1 = screen.getByRole('heading', { level: 1, name: 'DOLFIN' })

    expect(firstImage.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    expect(firstImage).toHaveAttribute('loading', 'eager')
    expect(firstImage).toHaveAttribute('fetchpriority', 'high')
    expect(firstImage).toHaveAttribute('alt', '')
    const cover = getProjectCover('dolfin')!
    expect(firstImage).toHaveAttribute('width', String(cover.width))
    expect(firstImage).toHaveAttribute('height', String(cover.height))
  })

  it('links to the live demo of whichever project is on screen, opened safely', () => {
    for (const slug of ['dolfin', 'takeauction', 'altitudelog']) {
      const { unmount } = renderWithRouter(<App />, `/projects/${slug}`)
      const link = screen.getByRole('link', { name: 'Projeyi aç' })
      expect(link).toHaveAttribute('href', getProjectBySlug(slug)!.liveUrl)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link.getAttribute('rel')).toContain('noopener')
      expect(link.getAttribute('rel')).toContain('noreferrer')
      unmount()
    }
  })

  it('renders the technologies as a labelled description list, one row per group, for dolfin', () => {
    const { container } = renderWithRouter(<App />, '/projects/dolfin')
    const list = container.querySelector('dl[aria-label="Kullanılan teknolojiler"]')
    expect(list).not.toBeNull()

    const dolfin = PROJECTS.tr.find((project) => project.slug === 'dolfin')!
    expect([...list!.querySelectorAll('dt')].map((dt) => dt.textContent)).toEqual(
      dolfin.technologies.map((group) => group.label),
    )

    const values = [...list!.querySelectorAll('dd')].map((dd) =>
      (dd.textContent ?? '')
        .split('·')
        .map((entry) => entry.trim())
        .filter(Boolean),
    )
    expect(values).toEqual(dolfin.technologies.map((group) => [...group.items]))
  })

  it('keeps the dot separators out of the accessibility tree', () => {
    const { container } = renderWithRouter(<App />, '/projects/dolfin')
    const list = container.querySelector('dl[aria-label="Kullanılan teknolojiler"]')!
    const separators = list.querySelectorAll('span[aria-hidden="true"]')
    expect(separators.length).toBeGreaterThan(0)
    for (const separator of separators) {
      expect(separator.textContent?.trim()).toBe('·')
    }
  })

  it('contributes no h2 of its own now that Ekranlar is gone', () => {
    renderWithRouter(<App />, '/projects/dolfin')
    const names = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(names).toEqual(['İletişim'])
    expect(screen.queryByText('Ekranlar')).toBeNull()
  })

  it('still names the screenshot list for a screen reader', () => {
    renderWithRouter(<App />, '/projects/dolfin')
    expect(screen.getByRole('list', { name: 'Ekran görüntüleri' })).toBeInTheDocument()
  })

  it('renders five figcaptions for dolfin, with the companyProfile caption verbatim', () => {
    const { container } = renderWithRouter(<App />, '/projects/dolfin')
    expect(container.querySelectorAll('figcaption')).toHaveLength(5)
    expect(
      screen.getByText(
        'Şirket profilinde fiyat, değişim, piyasa değeri ve beta bilgisinin yanında şirketin ne yaptığı ve son on iki ayın temel metrikleri yer alıyor. Gelir tablosu, bilanço ve nakit akışı ayrı sekmelerde duruyor.',
      ),
    ).toBeInTheDocument()
  })

  it('has a "Projelere dön" link back to the section', () => {
    renderWithRouter(<App />, '/projects/dolfin')
    const link = screen.getByRole('link', { name: 'Projelere dön' })
    expect(link).toHaveAttribute('href', '/#projeler')
  })

  it('has a "Geri" link back to the home page, at the top of the page', () => {
    const { container } = renderWithRouter(<App />, '/projects/dolfin')
    const link = screen.getByRole('link', { name: 'Geri' })
    expect(link).toHaveAttribute('href', '/')

    const h1 = screen.getByRole('heading', { level: 1, name: 'DOLFIN' })
    expect(link.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(container.contains(link)).toBe(true)
  })

  it('coexists with "Projelere dön" - the two back controls target different places', () => {
    renderWithRouter(<App />, '/projects/dolfin')
    const geri = screen.getByRole('link', { name: 'Geri' })
    const backToGrid = screen.getByRole('link', { name: 'Projelere dön' })
    expect(geri).toHaveAttribute('href', '/')
    expect(backToGrid).toHaveAttribute('href', '/#projeler')
  })

  it('does not also mount the home page hero', () => {
    renderWithRouter(<App />, '/projects/dolfin')
    expect(screen.queryByRole('heading', { level: 1, name: 'Hakkımda' })).not.toBeInTheDocument()
  })

  it('redirects an unknown slug to the home page', () => {
    const { container } = renderWithRouter(<App />, '/projects/bilinmeyen')
    expect(container.querySelector('section#anasayfa')).not.toBeNull()
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('ENSAR ASLANPORTFOLYO')
  })

  it('points og:image at the project cover, not the first screenshot', () => {
    renderWithRouter(<App />, '/projects/dolfin')

    const ogImage = document.head.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content
    const dolfin = getProjectBySlug('dolfin')!

    expect(ogImage).toBeTruthy()
    expect(ogImage).toContain(dolfin.cover!.src)
    expect(ogImage).not.toContain(dolfin.screens[0].src)
  })
})
