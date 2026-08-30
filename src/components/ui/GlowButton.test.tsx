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

  it('fills with the accent by default and keeps the page ground when outlined', () => {
    const { container: solid } = render(<GlowButton href="/x">Dolu</GlowButton>)
    expect(solid.querySelector('.bg-accent-base')).not.toBeNull()

    const { container: outline } = render(
      <GlowButton href="/x" variant="outline">
        Çerçeve
      </GlowButton>,
    )
    expect(outline.querySelector('.bg-surface-base')).not.toBeNull()
  })
})
