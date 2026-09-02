import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Marquee from './Marquee'
import { MARQUEE_WORDS } from '../data/marquee'

describe('Marquee', () => {
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

  it('declares itself English, so uppercasing does not produce a dotted İ', () => {
    const { container } = render(<Marquee />)
    expect(container.firstElementChild?.getAttribute('lang')).toBe('en')
  })
})
