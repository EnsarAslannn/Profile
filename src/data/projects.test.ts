import { describe, expect, it } from 'vitest'
import { getProjectBySlug, PROJECTS } from './projects'

const DOLFIN_DESCRIPTION =
  'Kullanıcıların sanal cüzdanla hisse senedi alıp satabildiği full-stack bir finansal portföy yönetim platformu. .NET ve PostgreSQL ile geliştirildi. JWT ve CSRF korumalı kimlik doğrulama ile güvenli kullanıcı girişi sağlandı, Redis ile performans artırıcı önbellekleme yapıldı. xUnit ve Playwright ile test edildi, Docker ve GitHub Actions ile CI/CD sürecine entegre edildi.'

const TAKEAUCTION_DESCRIPTION =
  'Gerçek zamanlı, yüksek trafikli bir online açık artırma sistemi. .NET ve Vertical Slice Architecture ile geliştirildi, PostgreSQL üzerinde çalışıyor. RabbitMQ ile olay tabanlı mesajlaşma, Hangfire ile otomatik lot kapanışı, SignalR ile anlık teklif bildirimleri sağlandı. JWT ile kimlik doğrulama yapıldı; xUnit, Testcontainers ve Playwright ile test edildi, Docker ve GitHub Actions ile CI/CD sürecine entegre edildi.'

const ALTITUDELOG_DESCRIPTION =
  'Pilotların uçuş kaydı tutup mürettebat atayabildiği bir uçuş ve mürettebat yönetim sistemi. Clean Architecture ve CQRS (MediatR) prensipleriyle, .NET ve PostgreSQL üzerinde geliştirildi. Hangfire ile arka planda çalışan işler sayesinde dış hava durumu servisinden otomatik veri entegrasyonu yapıldı, Redis ile önbellekleme uygulandı. JWT ile rol bazlı yetkilendirme sağlandı; xUnit ve Testcontainers ile test edildi, Docker üzerinden CI/CD sürecine entegre edilip canlıya alındı.'

describe('PROJECTS', () => {
  it('has three entries in the owner-specified grid order: takeauction, altitudelog, dolfin', () => {
    expect(PROJECTS).toHaveLength(3)
    expect(PROJECTS.map((p) => p.slug)).toEqual(['takeauction', 'altitudelog', 'dolfin'])
  })

  it('has the exact title and subtitle for each project', () => {
    const dolfin = PROJECTS.find((p) => p.slug === 'dolfin')
    const takeauction = PROJECTS.find((p) => p.slug === 'takeauction')
    const altitudelog = PROJECTS.find((p) => p.slug === 'altitudelog')
    expect(dolfin?.title).toBe('DOLFIN')
    expect(dolfin?.subtitle).toBe('Finansal Portföy Yönetim Platformu')
    expect(takeauction?.title).toBe('TakeAuction')
    expect(takeauction?.subtitle).toBe('Gerçek Zamanlı Açık Artırma Sistemi')
    expect(altitudelog?.title).toBe('AltitudELog')
    expect(altitudelog?.subtitle).toBe('Uçuş & Mürettebat Yönetim Sistemi')
  })

  it('has the verbatim Turkish description for each project', () => {
    expect(PROJECTS.find((p) => p.slug === 'dolfin')?.description).toBe(DOLFIN_DESCRIPTION)
    expect(PROJECTS.find((p) => p.slug === 'takeauction')?.description).toBe(TAKEAUCTION_DESCRIPTION)
    expect(PROJECTS.find((p) => p.slug === 'altitudelog')?.description).toBe(ALTITUDELOG_DESCRIPTION)
  })

  it('has the expected image counts, each starting with homePage', () => {
    const counts = Object.fromEntries(PROJECTS.map((p) => [p.slug, p.images.length]))
    expect(counts).toEqual({ dolfin: 5, takeauction: 4, altitudelog: 6 })
    for (const project of PROJECTS) {
      expect(project.images[0]?.name).toBe('homePage')
    }
  })

  it('no description contains a digit-only year or an http substring', () => {
    for (const project of PROJECTS) {
      expect(project.description).not.toMatch(/\b(19|20)\d{2}\b/)
      expect(project.description).not.toMatch(/http/i)
    }
  })
})

describe('getProjectBySlug', () => {
  it('finds a project by slug', () => {
    expect(getProjectBySlug('takeauction')?.title).toBe('TakeAuction')
  })

  it('returns undefined for an unknown or missing slug', () => {
    expect(getProjectBySlug('nope')).toBeUndefined()
    expect(getProjectBySlug(undefined)).toBeUndefined()
  })
})
