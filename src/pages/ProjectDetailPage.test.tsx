import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { renderWithRouter } from '../test/renderWithRouter'

describe('ProjectDetailPage', () => {
  it('renders the dolfin project at /projects/dolfin', () => {
    renderWithRouter(<App />, '/projects/dolfin')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'DOLFIN' })).toBeInTheDocument()
    expect(screen.getByText('Finansal Portföy Yönetim Platformu')).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(5)
    expect(
      screen.getByText(
        'Kullanıcıların sanal cüzdanla hisse senedi alıp satabildiği full-stack bir finansal portföy yönetim platformu. .NET ve PostgreSQL ile geliştirildi. JWT ve CSRF korumalı kimlik doğrulama ile güvenli kullanıcı girişi sağlandı, Redis ile performans artırıcı önbellekleme yapıldı. xUnit ve Playwright ile test edildi, Docker ve GitHub Actions ile CI/CD sürecine entegre edildi.',
      ),
    ).toBeInTheDocument()
  })

  it('renders the takeauction project at /projects/takeauction', () => {
    renderWithRouter(<App />, '/projects/takeauction')
    expect(screen.getByRole('heading', { level: 1, name: 'TakeAuction' })).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(4)
  })

  it('renders the altitudelog project at /projects/altitudelog', () => {
    renderWithRouter(<App />, '/projects/altitudelog')
    expect(screen.getByRole('heading', { level: 1, name: 'AltitudELog' })).toBeInTheDocument()
    expect(screen.getAllByRole('img')).toHaveLength(6)
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
})
