import { describe, expect, it } from 'vitest'
import { getProjectBySlug, PROJECTS } from './index'
import { getProjectImages } from '../projectImages'

const DOLFIN_SUMMARY =
  'Kullanıcıların sanal bir cüzdanla hisse senedi alıp satabildiği, portföylerinin dağılımını ve performansını izleyebildiği, hisse sayfalarına yorum bırakabildiği kurumsal odaklı bir finansal yönetim platformu. Uygulama harici bir piyasa verisi servisine bağlı değil. TSLA, NVDA, AAPL, GOOGL ve MSFT için elle hazırlanmış yerel bir veri seti üzerinde çalışıyor.'

const TAKEAUCTION_SUMMARY =
  'Satıcıların lot listelediği, alıcıların gizli tavan değerleriyle yarıştığı, yüksek trafikli ve eşzamanlı çalışan gerçek zamanlı bir açık artırma sistemi. Amaç yalnızca teklif butonu olan bir CRUD uygulaması değil, gerçek rekabet altında eşzamanlılığı, teslimat garantilerini ve kapanış mantığını doğru ele alan uçtan uca bir sistem kurmaktı. Kod yatay katmanlar yerine Vertical Slice Architecture ile örgütlendi. Her özellik kendi isteğini, işleyicisini ve doğrulamasını uçtan uca kendisi taşıyor.'

const ALTITUDELOG_SUMMARY =
  'Pilotların rütbeleriyle sisteme kayıt olduğu, uçuş kaydı oluşturduğu, her uçuşa mürettebat üyelerini görev rolleriyle atadığı ve isteğe bağlı olarak anonim CRM (Crew Resource Management) güvenlik raporu doldurabildiği bir uçuş ve mürettebat yönetim platformu. Hedef basit bir kayıt ekranı değil, rol tabanlı yetkilendirmeyi, arka plan işlerini, önbellek katmanını ve gerçek bir dağıtım sürecini bir araya getiren uçtan uca bir uygulamaydı.'

describe('PROJECTS.tr', () => {
  it('has three entries in the owner-specified mosaic order: dolfin, takeauction, altitudelog', () => {
    expect(PROJECTS.tr).toHaveLength(3)
    expect(PROJECTS.tr.map((p) => p.slug)).toEqual(['dolfin', 'takeauction', 'altitudelog'])
  })

  it('has the exact title and subtitle for each project', () => {
    const dolfin = PROJECTS.tr.find((p) => p.slug === 'dolfin')
    const takeauction = PROJECTS.tr.find((p) => p.slug === 'takeauction')
    const altitudelog = PROJECTS.tr.find((p) => p.slug === 'altitudelog')
    expect(dolfin?.title).toBe('DOLFIN')
    expect(dolfin?.subtitle).toBe('Finansal Portföy Yönetim Platformu')
    expect(takeauction?.title).toBe('TakeAuction')
    expect(takeauction?.subtitle).toBe('Gerçek Zamanlı Açık Artırma Sistemi')
    expect(altitudelog?.title).toBe('AltitudELog')
    expect(altitudelog?.subtitle).toBe('Uçuş & Mürettebat Yönetim Sistemi')
  })

  it('opens each description with the verbatim summary paragraph', () => {
    expect(PROJECTS.tr.find((p) => p.slug === 'dolfin')?.description[0]).toBe(DOLFIN_SUMMARY)
    expect(PROJECTS.tr.find((p) => p.slug === 'takeauction')?.description[0]).toBe(TAKEAUCTION_SUMMARY)
    expect(PROJECTS.tr.find((p) => p.slug === 'altitudelog')?.description[0]).toBe(ALTITUDELOG_SUMMARY)
  })

  it('gives every project a multi-paragraph description whose first paragraph can stand alone', () => {
    for (const project of PROJECTS.tr) {
      expect(project.description.length).toBeGreaterThan(1)
      for (const paragraph of project.description) {
        expect(paragraph.trim()).toBe(paragraph)
        expect(paragraph.length).toBeGreaterThan(80)
      }
    }
  })

  it('uses no semicolon or colon anywhere in the rendered project prose', () => {
    for (const project of PROJECTS.tr) {
      for (const paragraph of project.description) {
        expect(paragraph, `${project.slug} description`).not.toMatch(/[;:]/)
      }
      for (const screen of project.screens) {
        expect(screen.caption, `${project.slug}/${screen.name} caption`).not.toMatch(/[;:]/)
      }
      expect(project.title).not.toMatch(/[;:]/)
      expect(project.subtitle).not.toMatch(/[;:]/)
    }
  })

  it('no description paragraph contains a digit-only year or an http substring', () => {
    for (const project of PROJECTS.tr) {
      for (const paragraph of project.description) {
        expect(paragraph).not.toMatch(/\b(19|20)\d{2}\b/)
        expect(paragraph).not.toMatch(/https?:\/\//i)
        expect(paragraph).not.toMatch(/\bwww\./i)
      }
    }
  })
})

describe('liveUrl', () => {
  it('gives every project an https demo link, with no trailing slash', () => {
    for (const project of PROJECTS.tr) {
      expect(project.liveUrl).toBeDefined()
      expect(project.liveUrl).toMatch(/^https:\/\//)
      expect(project.liveUrl).not.toMatch(/\/$/)
    }
  })

  it('points each project at its own demo', () => {
    const urls = Object.fromEntries(PROJECTS.tr.map((p) => [p.slug, p.liveUrl]))
    expect(urls).toEqual({
      dolfin: 'https://dol-fin.com',
      takeauction: 'https://take-auction.vercel.app',
      altitudelog: 'https://altitudelog.vercel.app',
    })
  })
})

describe('technologies', () => {
  it('groups every project as Backend / Frontend / Test / Deployment, in that order', () => {
    for (const project of PROJECTS.tr) {
      expect(project.technologies.map((group) => group.label)).toEqual([
        'Backend',
        'Frontend',
        'Test',
        'Deployment',
      ])
    }
  })

  it('has no empty group and no repeated entry within a project', () => {
    for (const project of PROJECTS.tr) {
      const all: string[] = []
      for (const group of project.technologies) {
        expect(group.items.length).toBeGreaterThan(0)
        all.push(...group.items)
      }
      expect(new Set(all).size).toBe(all.length)
    }
  })

  it('carries the stack that is actually specific to each repo', () => {
    const items = (slug: string) =>
      PROJECTS.tr.find((p) => p.slug === slug)!.technologies.flatMap((group) => group.items)

    expect(items('takeauction')).toEqual(
      expect.arrayContaining(['RabbitMQ', 'MassTransit', 'SignalR']),
    )
    expect(items('altitudelog')).toEqual(
      expect.arrayContaining(['MediatR', 'Hangfire', 'QuestPDF']),
    )
    expect(items('dolfin')).toEqual(
      expect.arrayContaining(['ASP.NET Core Identity', 'HybridCache', 'Playwright']),
    )
    expect(items('dolfin')).not.toContain('RabbitMQ')
    expect(items('altitudelog')).not.toContain('RabbitMQ')
    expect(items('takeauction')).not.toContain('QuestPDF')
  })

  it('names none of the technologies the owner removed, in a list or in prose', () => {
    const removed = [
      'Prometheus',
      'OpenTelemetry',
      'GSAP',
      'Lenis',
      'NSubstitute',
      'k6',
      'CodeQL',
      'Respawn',
    ]
    for (const project of PROJECTS.tr) {
      const text = [
        ...project.description,
        ...project.technologies.flatMap((group) => group.items),
      ].join(' ')
      for (const name of removed) {
        expect(text, `${project.slug} still names "${name}"`).not.toMatch(
          new RegExp(`\\b${name}\\b`, 'i'),
        )
      }
    }
  })
})

describe('screens', () => {
  it('has the expected screen counts: 4 takeauction, 6 altitudelog, 5 dolfin', () => {
    const counts = Object.fromEntries(PROJECTS.tr.map((p) => [p.slug, p.screens.length]))
    expect(counts).toEqual({ takeauction: 4, altitudelog: 6, dolfin: 5 })
  })

  it('narrates in the exact owner-specified order per project', () => {
    expect(PROJECTS.tr.find((p) => p.slug === 'takeauction')?.screens.map((s) => s.name)).toEqual([
      'homePage',
      'homePage2',
      'auctions',
      'auction',
    ])
    expect(PROJECTS.tr.find((p) => p.slug === 'altitudelog')?.screens.map((s) => s.name)).toEqual([
      'homePage',
      'homePage2',
      'newFlight',
      'dashboard',
      'profile',
      'statistics',
    ])
    expect(PROJECTS.tr.find((p) => p.slug === 'dolfin')?.screens.map((s) => s.name)).toEqual([
      'homePage',
      'homePage2',
      'searchPage',
      'walletPage',
      'companyProfile',
    ])
  })

  it('the set of screen names exactly matches the set of image names on disk, per project', () => {
    for (const project of PROJECTS.tr) {
      const screenNames = [...project.screens.map((s) => s.name)].sort()
      const imageNames = getProjectImages(project.slug, [])
        .map((i) => i.name)
        .sort()
      expect(screenNames).toEqual(imageNames)
    }
  })

  it('every screen has a non-empty caption and a non-empty src', () => {
    for (const project of PROJECTS.tr) {
      for (const screen of project.screens) {
        expect(screen.caption?.length).toBeGreaterThan(0)
        expect(screen.src.length).toBeGreaterThan(0)
      }
    }
  })

  it('spot-checks three captions verbatim, one per project', () => {
    const takeauctionAuction = PROJECTS.tr.find((p) => p.slug === 'takeauction')?.screens.find(
      (s) => s.name === 'auction',
    )
    expect(takeauctionAuction?.caption).toBe(
      'Parça detayında açıklama, güncel teklif ve kalan süre bulunuyor. Kullanıcı görünmeyen bir üst limit belirleyerek teklif veriyor. Sistem yalnızca önde kalmaya yetecek kadar artırıyor.',
    )

    const altitudelogNewFlight = PROJECTS.tr.find((p) => p.slug === 'altitudelog')?.screens.find(
      (s) => s.name === 'newFlight',
    )
    expect(altitudelogNewFlight?.caption).toBe(
      'Yeni uçuş oluşturma formunda kalkış ve varış ICAO kodu, tarih, uçuş süresi ve uçak tipi giriliyor. METAR bilgisi uçuş kaydedildikten sonra sistem tarafından otomatik olarak alınıyor.',
    )

    const dolfinCompanyProfile = PROJECTS.tr.find((p) => p.slug === 'dolfin')?.screens.find(
      (s) => s.name === 'companyProfile',
    )
    expect(dolfinCompanyProfile?.caption).toBe(
      'Şirket profilinde fiyat, değişim, piyasa değeri ve beta bilgisinin yanında şirketin ne yaptığı ve son on iki ayın temel metrikleri yer alıyor. Gelir tablosu, bilanço ve nakit akışı ayrı sekmelerde duruyor.',
    )
  })
})

describe('cover', () => {
  it('is defined for all three projects and is a genuinely different asset from screen 0', () => {
    for (const project of PROJECTS.tr) {
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
