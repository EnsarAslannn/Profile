import { describe, expect, it } from 'vitest'
import { ABOUT_PARAGRAPHS, ABOUT_STATEMENT, ABOUT_TEASER } from './about'
import { SITE_ROLE } from '../lib/siteMeta'

const INTRO_TEXT =
  'Merhaba, ben Ensar Aslan. Karabük Üniversitesi Bilgisayar Mühendisliği %100 İngilizce bölümü mezunu bir yazılım geliştiriciyim. Modern web teknolojileriyle ölçeklenebilir, performanslı ve sürdürülebilir uygulamalar geliştiriyorum.'

const STACK_TEXT =
  'Backend tarafında C#, .NET, ASP.NET Core ve PostgreSQL; frontend tarafında ise React, TypeScript ve state management araçlarını kullanarak Full Stack çözümler üretiyorum. Projelerimi Clean Architecture, Vertical Slice Architecture, CQRS ve MediatR gibi mimari yaklaşımlarla kurguluyorum. Docker, Redis ve RabbitMQ gibi teknolojilerle sistem performansını ve gerçek zamanlı iletişimi güçlendiriyorum.'

const TOOLING_TEXT =
  'Geliştirme süreçlerimde yapay zeka araçlarını ve AI agent\'larını yoğun ve efektif bir şekilde kullanarak verimliliğimi maksimize ediyorum. Aynı zamanda arka plandaki mimariyi ve sistemin işleyişini derinlemesine anlamaya önem veriyorum.'

const GOALS_TEXT =
  'Gelişimime olan inancım ve yüksek öğrenme motivasyonumla, dahil olacağım yazılım ekiplerinin projelerine ve iş süreçlerine maksimum katkıyı sağlamayı hedefliyorum. Aşağıda üzerinde çalıştığım projelere göz atabilir, ya da doğrudan benimle iletişime geçebilirsiniz.'

describe('ABOUT_PARAGRAPHS.tr', () => {
  it('has exactly four paragraphs in the owner-supplied order', () => {
    expect(ABOUT_PARAGRAPHS.tr).toHaveLength(4)
    expect(ABOUT_PARAGRAPHS.tr.map((p) => p.id)).toEqual(['intro', 'stack', 'tooling', 'goals'])
  })

  it('keeps the intro paragraph verbatim', () => {
    expect(ABOUT_PARAGRAPHS.tr[0].text).toBe(INTRO_TEXT)
  })

  it('keeps the stack paragraph verbatim', () => {
    expect(ABOUT_PARAGRAPHS.tr[1].text).toBe(STACK_TEXT)
  })

  it('keeps the tooling paragraph verbatim', () => {
    expect(ABOUT_PARAGRAPHS.tr[2].text).toBe(TOOLING_TEXT)
  })

  it('keeps the goals paragraph verbatim', () => {
    expect(ABOUT_PARAGRAPHS.tr[3].text).toBe(GOALS_TEXT)
  })

  it('no longer contains the superseded copy', () => {
    const allText = ABOUT_PARAGRAPHS.tr.map((p) => p.text).join(' ')
    expect(allText).not.toContain('Erasmus+')
    expect(allText).not.toContain('Futbol')
    expect(allText).not.toContain('zamanla iyi bir Full Stack geliştirici olmayı')
  })
})

describe('ABOUT_STATEMENT.tr', () => {
  it('reads as one sentence and claims nothing new', () => {
    const joined = ABOUT_STATEMENT.tr.map((segment) => segment.text).join('')
    expect(joined).toBe(
      'Full Stack .NET Developer olarak ölçeklenebilir, performanslı ve sürdürülebilir sistemler kuruyorum.',
    )
    expect(joined).toContain(SITE_ROLE)
    expect(ABOUT_PARAGRAPHS.tr[0].text).toContain(
      'ölçeklenebilir, performanslı ve sürdürülebilir',
    )
  })

  it('emphasises only the title and the owner-supplied adjectives', () => {
    expect(
      ABOUT_STATEMENT.tr.filter((segment) => segment.emphasis).map((segment) => segment.text),
    ).toEqual([SITE_ROLE, 'ölçeklenebilir, performanslı ve sürdürülebilir'])
  })
})

describe('ABOUT_TEASER.tr', () => {
  it('is the tooling paragraph, so the home page never says the same thing twice', () => {
    expect(ABOUT_TEASER.tr.id).toBe('tooling')
    expect(ABOUT_TEASER.tr).toBe(ABOUT_PARAGRAPHS.tr[2])
  })
})
