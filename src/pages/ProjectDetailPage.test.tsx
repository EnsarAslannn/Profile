import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { getProjectBySlug } from '../data/projects'
import { renderWithRouter } from '../test/renderWithRouter'

describe('ProjectDetailPage', () => {
  it('renders the dolfin project at /projects/dolfin', () => {
    const { container } = renderWithRouter(<App />, '/projects/dolfin')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'DOLFIN' })).toBeInTheDocument()
    expect(screen.getByText('Finansal Portföy Yönetim Platformu')).toBeInTheDocument()
    // 5 screenshots + 1 cover. getAllByRole('img') would miss the cover,
    // whose alt="" removes it from the accessibility tree by design (the
    // link/figure around it already carries the accessible name) - so the
    // total is counted directly via querySelectorAll instead.
    expect(container.querySelectorAll('img')).toHaveLength(6)
    expect(
      screen.getByText(
        'Kullanıcıların sanal cüzdanla hisse senedi alıp satabildiği full-stack bir finansal portföy yönetim platformu. .NET ve PostgreSQL ile geliştirildi. JWT ve CSRF korumalı kimlik doğrulama ile güvenli kullanıcı girişi sağlandı, Redis ile performans artırıcı önbellekleme yapıldı. xUnit ve Playwright ile test edildi, Docker ve GitHub Actions ile CI/CD sürecine entegre edildi.',
      ),
    ).toBeInTheDocument()
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

    // DOM position: the cover node precedes the h1 node.
    expect(firstImage.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    expect(firstImage).toHaveAttribute('loading', 'eager')
    expect(firstImage).toHaveAttribute('fetchpriority', 'high')
    expect(firstImage).toHaveAttribute('alt', '')
    expect(firstImage).toHaveAttribute('width', '1600')
    expect(firstImage).toHaveAttribute('height', '2161')
  })

  it('renders the technologies list with the accessible name and items in order, for dolfin', () => {
    renderWithRouter(<App />, '/projects/dolfin')
    const list = screen.getByRole('list', { name: 'Kullanılan teknolojiler' })
    const items = list.querySelectorAll('li')
    expect(items).toHaveLength(6)
    expect([...items].map((li) => li.textContent?.replace('·', '').trim())).toEqual([
      '.NET',
      'PostgreSQL',
      'Redis',
      'JWT',
      'Playwright',
      'Docker',
    ])
  })

  it('has exactly one h2, named Ekranlar', () => {
    renderWithRouter(<App />, '/projects/dolfin')
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 2, name: 'Ekranlar' })).toBeInTheDocument()
  })

  it('renders five figcaptions for dolfin, with the companyProfile caption verbatim', () => {
    const { container } = renderWithRouter(<App />, '/projects/dolfin')
    expect(container.querySelectorAll('figcaption')).toHaveLength(5)
    expect(
      screen.getByText(
        'Şirket profili; fiyat, değişim, piyasa değeri ve beta bilgisinin yanında şirketin ne yaptığı ve son on iki ayın temel metrikleri; gelir tablosu, bilanço ve nakit akışı ayrı sekmelerde.',
      ),
    ).toBeInTheDocument()
  })

  it('has a "Projelere dön" link back to the section', () => {
    renderWithRouter(<App />, '/projects/dolfin')
    const link = screen.getByRole('link', { name: 'Projelere dön' })
    expect(link).toHaveAttribute('href', '/#projeler')
  })

  it('does not also mount the home page hero', () => {
    renderWithRouter(<App />, '/projects/dolfin')
    expect(screen.queryByRole('heading', { level: 1, name: 'Hakkımda' })).not.toBeInTheDocument()
  })

  it('redirects an unknown slug to the home page', () => {
    renderWithRouter(<App />, '/projects/bilinmeyen')
    expect(screen.getByRole('heading', { level: 1, name: 'Hakkımda' })).toBeInTheDocument()
  })

  it('points og:image at the project cover, not the first screenshot', () => {
    // The cover became the LCP image and the social-preview art in this round.
    // Without this assertion a regression back to screens[0] would be silent:
    // the data test only proves cover.src differs from screens[0].src, not
    // that the page actually wires the cover into RouteMeta.
    renderWithRouter(<App />, '/projects/dolfin')

    const ogImage = document.head.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content
    const dolfin = getProjectBySlug('dolfin')!

    expect(ogImage).toBeTruthy()
    expect(ogImage).toContain(dolfin.cover!.src)
    expect(ogImage).not.toContain(dolfin.screens[0].src)
  })
})
