import { describe, expect, it } from 'vitest'
import { getProjectBySlug, PROJECTS } from './index'
import { getProjectImages } from '../projectImages'

const DOLFIN_SUMMARY =
  'Kullanıcıların sanal bir cüzdanla hisse senedi alıp satabildiği, portföylerinin dağılımını ve performansını izleyebildiği, hisse sayfalarına yorum bırakabildiği kurumsal odaklı bir finansal yönetim platformu. Uygulama harici bir piyasa verisi servisine bağlı değil; TSLA, NVDA, AAPL, GOOGL ve MSFT için elle hazırlanmış yerel bir veri seti üzerinde çalışıyor.'

const TAKEAUCTION_SUMMARY =
  'Satıcıların lot listelediği, alıcıların gizli tavan değerleriyle yarıştığı, yüksek trafikli ve eşzamanlı çalışan gerçek zamanlı bir açık artırma sistemi. Amaç yalnızca teklif butonu olan bir CRUD uygulaması değil; gerçek rekabet altında eşzamanlılığı, teslimat garantilerini ve kapanış mantığını doğru ele alan uçtan uca bir sistem kurmaktı. Kod yatay katmanlar yerine Vertical Slice Architecture ile örgütlendi: her özellik kendi isteğini, işleyicisini ve doğrulamasını uçtan uca kendisi taşıyor.'

const ALTITUDELOG_SUMMARY =
  'Pilotların rütbeleriyle sisteme kayıt olduğu, uçuş kaydı oluşturduğu, her uçuşa mürettebat üyelerini görev rolleriyle atadığı ve isteğe bağlı olarak anonim CRM (Crew Resource Management) güvenlik raporu doldurabildiği bir uçuş ve mürettebat yönetim platformu. Hedef basit bir kayıt ekranı değil; rol tabanlı yetkilendirmeyi, arka plan işlerini, önbellek katmanını ve gerçek bir dağıtım sürecini bir araya getiren uçtan uca bir uygulamaydı.'

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

  it('opens each description with the verbatim summary paragraph', () => {
    expect(PROJECTS.find((p) => p.slug === 'dolfin')?.description[0]).toBe(DOLFIN_SUMMARY)
    expect(PROJECTS.find((p) => p.slug === 'takeauction')?.description[0]).toBe(TAKEAUCTION_SUMMARY)
    expect(PROJECTS.find((p) => p.slug === 'altitudelog')?.description[0]).toBe(ALTITUDELOG_SUMMARY)
  })

  // description[0] is what RouteMeta trims into the route's meta description,
  // so it has to read as a standalone summary of the whole project rather
  // than as the first instalment of a story the later paragraphs finish.
  it('gives every project a multi-paragraph description whose first paragraph can stand alone', () => {
    for (const project of PROJECTS) {
      expect(project.description.length).toBeGreaterThan(1)
      for (const paragraph of project.description) {
        expect(paragraph.trim()).toBe(paragraph)
        expect(paragraph.length).toBeGreaterThan(80)
      }
    }
  })

  it('no description paragraph contains a digit-only year or an http substring', () => {
    for (const project of PROJECTS) {
      for (const paragraph of project.description) {
        expect(paragraph).not.toMatch(/\b(19|20)\d{2}\b/)
        // URLs belong in liveUrl, never inline in prose - a bare URL in a
        // paragraph would render as unclickable text and land in the meta
        // description. Matches a real scheme, not the bare substring "http":
        // "httpOnly cookie" is a correct technical term in the DOLFIN copy,
        // and a substring match would reject it.
        expect(paragraph).not.toMatch(/https?:\/\//i)
        expect(paragraph).not.toMatch(/\bwww\./i)
      }
    }
  })
})

describe('liveUrl', () => {
  it('gives every project an https demo link, with no trailing slash', () => {
    for (const project of PROJECTS) {
      expect(project.liveUrl).toBeDefined()
      expect(project.liveUrl).toMatch(/^https:\/\//)
      expect(project.liveUrl).not.toMatch(/\/$/)
    }
  })

  it('points each project at its own demo', () => {
    const urls = Object.fromEntries(PROJECTS.map((p) => [p.slug, p.liveUrl]))
    expect(urls).toEqual({
      dolfin: 'https://dol-fin.com',
      takeauction: 'https://take-auction.vercel.app',
      altitudelog: 'https://altitudelog.vercel.app',
    })
  })
})

describe('technologies', () => {
  // Deliberately NOT a re-listing of all ~40 entries per project. That would
  // be a copy of the data with no independent judgement in it: every real
  // edit would fail it, so it would be updated reflexively rather than read.
  // These assertions instead pin the shape, and spot-check the entries that
  // distinguish one project's repo from another's.
  it('groups every project as Backend / Frontend / Test / Deployment, in that order', () => {
    for (const project of PROJECTS) {
      expect(project.technologies.map((group) => group.label)).toEqual([
        'Backend',
        'Frontend',
        'Test',
        'Deployment',
      ])
    }
  })

  it('has no empty group and no repeated entry within a project', () => {
    for (const project of PROJECTS) {
      const all: string[] = []
      for (const group of project.technologies) {
        expect(group.items.length).toBeGreaterThan(0)
        all.push(...group.items)
      }
      expect(new Set(all).size).toBe(all.length)
    }
  })

  // One distinctive entry per repo, so a copy-paste between project files
  // shows up as a failure instead of quietly attributing one stack to another.
  it('carries the stack that is actually specific to each repo', () => {
    const items = (slug: string) =>
      PROJECTS.find((p) => p.slug === slug)!.technologies.flatMap((group) => group.items)

    // github.com/EnsarAslannn/TakeAuction - outbox over RabbitMQ and live
    // bid push over SignalR.
    expect(items('takeauction')).toEqual(
      expect.arrayContaining(['RabbitMQ', 'MassTransit', 'SignalR']),
    )
    // github.com/EnsarAslannn/AltitudELog - CQRS via MediatR, METAR enrichment
    // on Hangfire, QuestPDF behind the logbook PDF export.
    expect(items('altitudelog')).toEqual(
      expect.arrayContaining(['MediatR', 'Hangfire', 'QuestPDF']),
    )
    // github.com/EnsarAslannn/DOLFIN - Identity-backed auth and the L1+L2
    // HybridCache tier.
    expect(items('dolfin')).toEqual(
      expect.arrayContaining(['ASP.NET Core Identity', 'HybridCache', 'Playwright']),
    )
    // ...and each of those is genuinely specific: not present in the others.
    expect(items('dolfin')).not.toContain('RabbitMQ')
    expect(items('altitudelog')).not.toContain('RabbitMQ')
    expect(items('takeauction')).not.toContain('QuestPDF')
  })

  // The owner asked for these to be dropped: Prometheus, OpenTelemetry, GSAP,
  // Lenis, NSubstitute, k6 and CodeQL from TakeAuction, Respawn and
  // NSubstitute from AltitudELog. Cleaning the technology lists was not
  // enough - TakeAuction's closing paragraph went on naming three of them for
  // a round afterwards, because prose and list are separate fields. The ban
  // is checked across BOTH fields, for every project, so a name cannot come
  // back through the door the first pass left open.
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
    for (const project of PROJECTS) {
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
