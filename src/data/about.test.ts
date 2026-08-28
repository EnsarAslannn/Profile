import { describe, expect, it } from 'vitest'
import { ABOUT_PARAGRAPHS } from './about'

const INTRO_TEXT =
  'Merhaba, ben Ensar Aslan. Karabük Üniversitesi Bilgisayar Mühendisliği %100 İngilizce bölümü mezunu bir yazılım geliştiriciyim. Modern web teknolojileriyle ölçeklenebilir, performanslı ve sürdürülebilir uygulamalar geliştiriyorum.'

const STACK_TEXT =
  'Backend tarafında C#, .NET, ASP.NET Core ve PostgreSQL; frontend tarafında ise React, TypeScript ve state management araçlarını kullanarak Full Stack çözümler üretiyorum. Projelerimi Clean Architecture, Vertical Slice Architecture, CQRS ve MediatR gibi mimari yaklaşımlarla kurguluyorum. Docker, Redis ve RabbitMQ gibi teknolojilerle sistem performansını ve gerçek zamanlı iletişimi güçlendiriyorum.'

const TOOLING_TEXT =
  'Geliştirme süreçlerimde yapay zeka araçlarını ve AI agent\'larını yoğun ve efektif bir şekilde kullanarak verimliliğimi maksimize ediyorum. Aynı zamanda arka plandaki mimariyi ve sistemin işleyişini derinlemesine anlamaya önem veriyorum.'

const GOALS_TEXT =
  'Gelişimime olan inancım ve yüksek öğrenme motivasyonumla, dahil olacağım yazılım ekiplerinin projelerine ve iş süreçlerine maksimum katkıyı sağlamayı hedefliyorum. Aşağıda üzerinde çalıştığım projelere göz atabilir, ya da doğrudan benimle iletişime geçebilirsiniz.'

describe('ABOUT_PARAGRAPHS', () => {
  it('has exactly four paragraphs in the owner-supplied order', () => {
    expect(ABOUT_PARAGRAPHS).toHaveLength(4)
    expect(ABOUT_PARAGRAPHS.map((p) => p.id)).toEqual(['intro', 'stack', 'tooling', 'goals'])
  })

  it('keeps the intro paragraph verbatim', () => {
    expect(ABOUT_PARAGRAPHS[0].text).toBe(INTRO_TEXT)
  })

  it('keeps the stack paragraph verbatim', () => {
    expect(ABOUT_PARAGRAPHS[1].text).toBe(STACK_TEXT)
  })

  it('keeps the tooling paragraph verbatim', () => {
    expect(ABOUT_PARAGRAPHS[2].text).toBe(TOOLING_TEXT)
  })

  it('keeps the goals paragraph verbatim', () => {
    expect(ABOUT_PARAGRAPHS[3].text).toBe(GOALS_TEXT)
  })

  it('no longer contains the superseded copy', () => {
    const allText = ABOUT_PARAGRAPHS.map((p) => p.text).join(' ')
    expect(allText).not.toContain('Erasmus+')
    expect(allText).not.toContain('Futbol')
    expect(allText).not.toContain('zamanla iyi bir Full Stack geliştirici olmayı')
  })
})
