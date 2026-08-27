import { describe, expect, it } from 'vitest'
import { getProjectBySlug, PROJECTS } from './index'
import { getProjectImages } from '../projectImages'

const DOLFIN_DESCRIPTION =
  'Kullanıcıların sanal cüzdanla hisse senedi alıp satabildiği full-stack bir finansal portföy yönetim platformu. .NET ve PostgreSQL ile geliştirildi. JWT ve CSRF korumalı kimlik doğrulama ile güvenli kullanıcı girişi sağlandı, Redis ile performans artırıcı önbellekleme yapıldı. xUnit ve Playwright ile test edildi, Docker ve GitHub Actions ile CI/CD sürecine entegre edildi.'

const TAKEAUCTION_DESCRIPTION =
  'Gerçek zamanlı, yüksek trafikli bir online açık artırma sistemi. .NET ve Vertical Slice Architecture ile geliştirildi, PostgreSQL üzerinde çalışıyor. RabbitMQ ile olay tabanlı mesajlaşma, Hangfire ile otomatik lot kapanışı, SignalR ile anlık teklif bildirimleri sağlandı. JWT ile kimlik doğrulama yapıldı; xUnit, Testcontainers ve Playwright ile test edildi, Docker ve GitHub Actions ile CI/CD sürecine entegre edildi.'

const ALTITUDELOG_DESCRIPTION =
  'Pilotların uçuş kaydı tutup mürettebat atayabildiği bir uçuş ve mürettebat yönetim sistemi. Clean Architecture ve CQRS (MediatR) prensipleriyle, .NET ve PostgreSQL üzerinde geliştirildi. Hangfire ile arka planda çalışan işler sayesinde dış hava durumu servisinden otomatik veri entegrasyonu yapıldı, Redis ile önbellekleme uygulandı. JWT ile rol bazlı yetkilendirme sağlandı; xUnit ve Testcontainers ile test edildi, Docker üzerinden CI/CD sürecine entegre edilip canlıya alındı.'

describe('PROJECTS', () => {
  it('has three entries in the owner-specified mosaic order: dolfin, takeauction, altitudelog', () => {
    expect(PROJECTS).toHaveLength(3)
    expect(PROJECTS.map((p) => p.slug)).toEqual(['dolfin', 'takeauction', 'altitudelog'])
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

  it('no description contains a digit-only year or an http substring', () => {
    for (const project of PROJECTS) {
      expect(project.description).not.toMatch(/\b(19|20)\d{2}\b/)
      expect(project.description).not.toMatch(/http/i)
    }
  })
})

describe('technologies', () => {
  it('has the exact owner-supplied technology list per project', () => {
    expect(PROJECTS.find((p) => p.slug === 'dolfin')?.technologies).toEqual([
      '.NET',
      'PostgreSQL',
      'Redis',
      'JWT',
      'Playwright',
      'Docker',
    ])
    expect(PROJECTS.find((p) => p.slug === 'takeauction')?.technologies).toEqual([
      '.NET',
      'PostgreSQL',
      'RabbitMQ',
      'SignalR',
      'Hangfire',
      'JWT',
      'Docker',
    ])
    expect(PROJECTS.find((p) => p.slug === 'altitudelog')?.technologies).toEqual([
      '.NET',
      'PostgreSQL',
      'Redis',
      'Hangfire',
      'MediatR',
      'JWT',
      'Docker',
    ])
  })
})

describe('screens', () => {
  it('has the expected screen counts: 4 takeauction, 6 altitudelog, 5 dolfin', () => {
    const counts = Object.fromEntries(PROJECTS.map((p) => [p.slug, p.screens.length]))
    expect(counts).toEqual({ takeauction: 4, altitudelog: 6, dolfin: 5 })
  })

  it('narrates in the exact owner-specified order per project', () => {
    expect(PROJECTS.find((p) => p.slug === 'takeauction')?.screens.map((s) => s.name)).toEqual([
      'homePage',
      'homePage2',
      'auctions',
      'auction',
    ])
    expect(PROJECTS.find((p) => p.slug === 'altitudelog')?.screens.map((s) => s.name)).toEqual([
      'homePage',
      'homePage2',
      'newFlight',
      'dashboard',
      'profile',
      'statistics',
    ])
    expect(PROJECTS.find((p) => p.slug === 'dolfin')?.screens.map((s) => s.name)).toEqual([
      'homePage',
      'homePage2',
      'searchPage',
      'walletPage',
      'companyProfile',
    ])
  })

  it('the set of screen names exactly matches the set of image names on disk, per project', () => {
    for (const project of PROJECTS) {
      const screenNames = [...project.screens.map((s) => s.name)].sort()
      const imageNames = getProjectImages(project.slug, [])
        .map((i) => i.name)
        .sort()
      expect(screenNames).toEqual(imageNames)
    }
  })

  it('every screen has a non-empty caption and a non-empty src', () => {
    for (const project of PROJECTS) {
      for (const screen of project.screens) {
        expect(screen.caption?.length).toBeGreaterThan(0)
        expect(screen.src.length).toBeGreaterThan(0)
      }
    }
  })

  it('spot-checks three captions verbatim, one per project', () => {
    const takeauctionAuction = PROJECTS.find((p) => p.slug === 'takeauction')?.screens.find(
      (s) => s.name === 'auction',
    )
    expect(takeauctionAuction?.caption).toBe(
      'Parça detayında açıklama, güncel teklif ve kalan süre bulunuyor. Kullanıcı görünmeyen bir üst limit belirleyerek teklif veriyor; sistem yalnızca önde kalmaya yetecek kadar artırıyor.',
    )

    const altitudelogNewFlight = PROJECTS.find((p) => p.slug === 'altitudelog')?.screens.find(
      (s) => s.name === 'newFlight',
    )
    expect(altitudelogNewFlight?.caption).toBe(
      'Yeni uçuş oluşturma formu; kalkış ve varış ICAO kodu, tarih, uçuş süresi ve uçak tipi giriliyor. METAR bilgisi uçuş kaydedildikten sonra sistem tarafından otomatik olarak alınıyor.',
    )

    const dolfinCompanyProfile = PROJECTS.find((p) => p.slug === 'dolfin')?.screens.find(
      (s) => s.name === 'companyProfile',
    )
    expect(dolfinCompanyProfile?.caption).toBe(
      'Şirket profili; fiyat, değişim, piyasa değeri ve beta bilgisinin yanında şirketin ne yaptığı ve son on iki ayın temel metrikleri; gelir tablosu, bilanço ve nakit akışı ayrı sekmelerde.',
    )
  })
})

describe('cover', () => {
  it('is defined for all three projects and is a genuinely different asset from screen 0', () => {
    for (const project of PROJECTS) {
      expect(project.cover).toBeDefined()
      expect(project.cover?.src).not.toBe(project.screens[0]?.src)
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
