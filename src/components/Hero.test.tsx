import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Hero from './Hero'

describe('Hero', () => {
  it('renders Hakkımda as the only h1', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1, name: 'Hakkımda' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading')).toHaveLength(1)
  })

  it('keeps the section anchor the footer links to', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('section#hakkimda')).not.toBeNull()
  })

  it('renders the About prose as two paragraphs', () => {
    const { container } = render(<Hero />)
    expect(container.querySelectorAll('p[data-about-paragraph]')).toHaveLength(2)
  })

  it('renders the opening paragraph verbatim', () => {
    render(<Hero />)
    expect(
      screen.getByText(
        'Merhaba, ben Ensar Aslan. Karabük Üniversitesi Bilgisayar Mühendisliğinin %100 İngilizce bölümünden mezun oldum. Ağırlıklı olarak C#, .NET ve React kullanarak projeler geliştiriyorum ve zamanla iyi bir Full Stack geliştirici olmayı amaçlıyorum.',
      ),
    ).toBeInTheDocument()
  })

  it('renders the closing paragraph verbatim', () => {
    render(<Hero />)
    expect(
      screen.getByText(
        'Gelişimime olan inancım ve yüksek öğrenme motivasyonumla, dahil olacağım yazılım ekiplerinin projelerine ve iş süreçlerine maksimum katkıyı sağlamayı hedefliyorum. Aşağıda üzerinde çalıştığım projelere göz atabilir, ya da doğrudan benimle iletişime geçebilirsiniz.',
      ),
    ).toBeInTheDocument()
  })

  it('renders the profile card alongside the prose', () => {
    render(<Hero />)
    expect(screen.getByRole('img', { name: 'Ensar Aslan' })).toBeInTheDocument()
  })

  it('locks the card flush-left and the prose flush-right via explicit grid column placement', () => {
    const { container } = render(<Hero />)
    const grid = container.querySelector('section#hakkimda > div')
    expect(grid).not.toBeNull()
    const gridClasses = grid!.className
    // Structure only, never the exact numbers: three tracks, with the middle
    // one `1fr` so the slack lands in the gutter instead of against an edge.
    // ui-agent owns the actual widths and must stay free to retune them, so
    // asserting `70ch` here would freeze a visual decision as a contract.
    expect(gridClasses).toMatch(/lg:grid-cols-\[\S+?_1fr_\S+?\]/)
    expect(gridClasses).toMatch(/xl:grid-cols-\[\S+?_1fr_\S+?\]/)

    const cardWrapper = screen.getByRole('img', { name: 'Ensar Aslan' }).closest('div[class*="lg:sticky"]')
    expect(cardWrapper).not.toBeNull()
    expect(cardWrapper!.className).toMatch(/lg:col-start-1\b/)

    const proseWrapper = screen.getByRole('heading', { level: 1 }).closest('div[class*="lg:col-start-3"]')
    expect(proseWrapper).not.toBeNull()

    // The old fixed measure cap must be gone: the grid track is now the sole
    // measure authority, so a stale `lg:max-w-prose` on the paragraph would
    // silently re-introduce the leftward drift the layout fix corrected.
    const paragraphs = container.querySelectorAll('p[data-about-paragraph]')
    for (const paragraph of paragraphs) {
      expect(paragraph.className).not.toMatch(/max-w-prose/)
    }
  })
})
