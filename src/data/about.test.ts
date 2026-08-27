import { describe, expect, it } from 'vitest'
import { ABOUT_PARAGRAPHS } from './about'

const INTRO_TEXT =
  'Merhaba, ben Ensar Aslan. Karabük Üniversitesi Bilgisayar Mühendisliğinin %100 İngilizce bölümünden mezun oldum. Ağırlıklı olarak C#, .NET ve React kullanarak projeler geliştiriyorum ve zamanla iyi bir Full Stack geliştirici olmayı amaçlıyorum.'

const GOALS_TEXT =
  'Gelişimime olan inancım ve yüksek öğrenme motivasyonumla, dahil olacağım yazılım ekiplerinin projelerine ve iş süreçlerine maksimum katkıyı sağlamayı hedefliyorum. Aşağıda üzerinde çalıştığım projelere göz atabilir, ya da doğrudan benimle iletişime geçebilirsiniz.'

describe('ABOUT_PARAGRAPHS', () => {
  it('has exactly two paragraphs, intro and goals', () => {
    expect(ABOUT_PARAGRAPHS).toHaveLength(2)
    expect(ABOUT_PARAGRAPHS.map((p) => p.id)).toEqual(['intro', 'goals'])
  })

  it('keeps the intro paragraph verbatim', () => {
    expect(ABOUT_PARAGRAPHS[0].text).toBe(INTRO_TEXT)
  })

  it('keeps the goals paragraph verbatim', () => {
    expect(ABOUT_PARAGRAPHS[1].text).toBe(GOALS_TEXT)
  })

  it('no longer contains the deleted focus/erasmus/hobbies paragraphs', () => {
    const allText = ABOUT_PARAGRAPHS.map((p) => p.text).join(' ')
    expect(allText).not.toContain('Erasmus+')
    expect(allText).not.toContain('Futbol')
  })
})
