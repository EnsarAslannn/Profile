import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import GlowButton from './GlowButton'
import { renderWithRouter } from '../../test/renderWithRouter'

describe('GlowButton', () => {
  it('renders a router link when given `to`', () => {
    renderWithRouter(<GlowButton to="/hakkimda">Devam</GlowButton>)
    expect(screen.getByRole('link', { name: 'Devam' })).toHaveAttribute('href', '/hakkimda')
  })

  it('renders a plain anchor when given `href`, and saves rather than navigates with `download`', () => {
    render(<GlowButton href="/EnsarAslanCV.pdf" download>CV indir</GlowButton>)
    const link = screen.getByRole('link', { name: 'CV indir' })
    expect(link).toHaveAttribute('href', '/EnsarAslanCV.pdf')
    expect(link).toHaveAttribute('download')
  })

  it('carries rel="noopener noreferrer" whenever it opens a new tab', () => {
    render(
      <GlowButton href="https://dol-fin.com" external>
        Projeyi aç
      </GlowButton>,
    )
    const link = screen.getByRole('link', { name: 'Projeyi aç' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('does not open a new tab, or claim to download, unless asked', () => {
    render(<GlowButton href="/somewhere">Git</GlowButton>)
    const link = screen.getByRole('link', { name: 'Git' })
    expect(link).not.toHaveAttribute('target')
    expect(link).not.toHaveAttribute('rel')
    expect(link).not.toHaveAttribute('download')
  })

  it('hides the rotating sweep from assistive technology', () => {
    const { container } = render(<GlowButton href="/x">Projeyi aç</GlowButton>)
    const sweep = container.querySelector('.animate-glow-spin')
    expect(sweep).not.toBeNull()
    expect(sweep).toHaveAttribute('aria-hidden', 'true')
    expect(sweep?.textContent).toBe('')
    expect(screen.getByRole('link').textContent).toBe('Projeyi aç')
  })

  it('keeps the focus ring on the same element that clips the sweep', () => {
    const { container } = render(<GlowButton href="/x">Odak</GlowButton>)
    const link = screen.getByRole('link', { name: 'Odak' })
    expect(link.className).toContain('overflow-hidden')
    expect(link.className).toContain('focus-visible:outline-focus')
    expect(container.querySelector('[class*="focus-visible:outline"]')).toBe(link)
  })

  it('stops the sweep and the lift under prefers-reduced-motion', () => {
    const { container } = render(<GlowButton href="/x">Sakin</GlowButton>)
    expect(container.querySelector('.animate-glow-spin')?.className).toContain(
      'motion-reduce:hidden',
    )
    expect(screen.getByRole('link').className).toContain('motion-reduce:hover:scale-100')
  })

  it('fills with the CTA green and labels it with the ink measured against it', () => {
    const { container } = render(<GlowButton href="/x">Dolu</GlowButton>)
    const face = container.querySelector('.bg-cta-base')
    expect(face).not.toBeNull()
    expect(face?.className).toContain('text-cta-ink')
    expect(container.querySelector('.bg-accent-soft')).toBeNull()
  })

  it('renders the same face for every button', () => {
    const a = render(<GlowButton href="/x">Bir</GlowButton>)
    const b = renderWithRouter(<GlowButton to="/y">İki</GlowButton>)
    const faceOf = (c: HTMLElement) => c.querySelector('a > span:last-of-type')!.className
    expect(faceOf(a.container)).toBe(faceOf(b.container))
    expect(faceOf(a.container)).toContain('bg-cta-base')
  })
})
