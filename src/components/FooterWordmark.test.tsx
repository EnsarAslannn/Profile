import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import FooterWordmark from './FooterWordmark'
import { SITE_NAME } from '../lib/siteMeta'

describe('FooterWordmark', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders with no Router ancestor required', () => {
    expect(() => render(<FooterWordmark />)).not.toThrow()
  })

  it('is decorative: the wordmark is aria-hidden and exposes no accessible image role', () => {
    const { container } = render(<FooterWordmark />)
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('mounts and unmounts cleanly when prefers-reduced-motion is on', () => {
    window.matchMedia = (media: string) => ({
      matches: media.includes('prefers-reduced-motion'),
      media,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })
    const { unmount } = render(<FooterWordmark />)
    expect(() => unmount()).not.toThrow()
  })

  it('renders the wordmark text identically with no pointer event ever dispatched', () => {
    const { container } = render(<FooterWordmark />)
    const texts = container.querySelectorAll('text')
    expect(texts).toHaveLength(2)
    for (const text of texts) {
      expect(text.textContent).toBe(SITE_NAME)
    }
  })
})
