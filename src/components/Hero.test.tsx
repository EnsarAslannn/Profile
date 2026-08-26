import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Hero from './Hero'

describe('Hero', () => {
  it('renders Hakkımda as the only h1', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1, name: 'Hakkımda' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading')).toHaveLength(1)
  })

  it('keeps the section anchor the navbar links to', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('section#hakkimda')).not.toBeNull()
  })

  it('renders the About prose as five paragraphs', () => {
    const { container } = render(<Hero />)
    expect(container.querySelectorAll('p[data-about-paragraph]')).toHaveLength(5)
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
})
