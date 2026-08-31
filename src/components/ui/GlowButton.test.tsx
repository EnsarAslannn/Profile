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

  // An off-site target opened in a new tab without this rel hands the opener
  // to the destination - CLAUDE.md's SEO rule, and a real one.
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

  // The decorative sweep must never reach the accessible name: it sits inside
  // the <a>, so an unlabelled span here would be read out as part of the link.
  it('hides the rotating sweep from assistive technology', () => {
    const { container } = render(<GlowButton href="/x">Projeyi aç</GlowButton>)
    const sweep = container.querySelector('.animate-glow-spin')
    expect(sweep).not.toBeNull()
    expect(sweep).toHaveAttribute('aria-hidden', 'true')
    expect(sweep?.textContent).toBe('')
    expect(screen.getByRole('link').textContent).toBe('Projeyi aç')
  })

  // The rim has to clip the sweep, and `overflow: hidden` clips a DESCENDANT's
  // outline. The focus ring therefore has to belong to the interactive element
  // itself, whose own overflow cannot clip its own outline - so the ring and
  // the clipping live on the same box, and a refactor that moves the ring onto
  // an inner element would silently make it invisible.
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

  // cta-base is the fill and cta-ink is the label measured against it
  // (13.3:1). The two travel together, so this asserts the pairing rather than
  // either half on its own - and pins that the fill is NOT accent-soft, which
  // is the sage the project-card hover bar and the language pill use. Reaching
  // for the accent here would quietly restyle both of those.
  it('fills with the CTA green and labels it with the ink measured against it', () => {
    const { container } = render(<GlowButton href="/x">Dolu</GlowButton>)
    const face = container.querySelector('.bg-cta-base')
    expect(face).not.toBeNull()
    expect(face?.className).toContain('text-cta-ink')
    expect(container.querySelector('.bg-accent-soft')).toBeNull()
  })

  // One face, no variants. The button carried a `variant` prop until the
  // owner asked for the hero's three buttons to be identical, which left the
  // outline style with no caller; an unused variant with a test pinning it
  // rots. Every rendered button is therefore the same, which is what makes
  // "identical" structural rather than a thing to keep in step by hand.
  it('renders the same face for every button', () => {
    // Both branches: the plain <a> and the router <Link>, which needs a Router
    // ancestor and so goes through renderWithRouter.
    const a = render(<GlowButton href="/x">Bir</GlowButton>)
    const b = renderWithRouter(<GlowButton to="/y">İki</GlowButton>)
    const faceOf = (c: HTMLElement) => c.querySelector('a > span:last-of-type')!.className
    expect(faceOf(a.container)).toBe(faceOf(b.container))
    expect(faceOf(a.container)).toContain('bg-cta-base')
  })
})
