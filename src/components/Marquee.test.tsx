import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Marquee from './Marquee'
import { MARQUEE_WORDS } from '../data/marquee'

describe('Marquee', () => {
  // Two copies and a 50% travel are one mechanism, not two choices: at -50%
  // the second copy sits exactly where the first started, which is the only
  // reason the loop does not visibly jump. See src/index.css.
  it('renders its word list exactly twice, so the loop can wrap seamlessly', () => {
    const { container } = render(<Marquee />)
    expect(container.querySelectorAll('ul')).toHaveLength(2)
    expect(container.querySelectorAll('li')).toHaveLength(MARQUEE_WORDS.length * 2)
  })

  it('animates, and stops for a visitor who asked for less motion', () => {
    const { container } = render(<Marquee />)
    const track = container.querySelector('.animate-marquee-x')!
    expect(track).not.toBeNull()
    expect(track.className).toMatch(/motion-reduce:animate-none/)
  })

  // Decoration, and duplicated decoration at that: exposing it would make a
  // screen reader read the same six words through twice for no gain. Every
  // word is already on the page as real prose in the Hakkımda copy.
  it('is hidden from screen readers as a whole', () => {
    const { container } = render(<Marquee />)
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true')
  })

  it('shows every word from the data', () => {
    const { container } = render(<Marquee />)
    for (const word of MARQUEE_WORDS) {
      expect(container.textContent).toContain(word)
    }
  })

  // Every entry is an English product or pattern name and the strip is
  // CSS-uppercased in a lang="tr" document, where casing maps i -> İ.
  // Untagged this renders ARCHİTECTURE and TESTCONTAİNERS.
  it('declares itself English, so uppercasing does not produce a dotted İ', () => {
    const { container } = render(<Marquee />)
    expect(container.firstElementChild?.getAttribute('lang')).toBe('en')
  })
})
