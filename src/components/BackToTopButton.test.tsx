import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import BackToTopButton from './BackToTopButton'

describe('BackToTopButton', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders a button, not a link, with the accessible name "Yukarı çık"', () => {
    const { container } = render(<BackToTopButton />)
    const button = screen.getByRole('button', { name: 'Yukarı çık' })
    expect(button).toHaveAttribute('type', 'button')
    expect(container.querySelectorAll('a')).toHaveLength(0)
  })

  it('scrolls to the top smoothly on click', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo')
    render(<BackToTopButton />)
    fireEvent.click(screen.getByRole('button', { name: 'Yukarı çık' }))
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('scrolls instantly when the user prefers reduced motion, read at click time', () => {
    vi.stubGlobal('matchMedia', (media: string) => ({
      matches: media.includes('prefers-reduced-motion'),
      media,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }))
    const scrollToSpy = vi.spyOn(window, 'scrollTo')
    render(<BackToTopButton />)
    fireEvent.click(screen.getByRole('button', { name: 'Yukarı çık' }))
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'auto' })
  })

  it('moves focus to #main after scrolling, without re-scrolling to it', () => {
    render(
      <>
        <main id="main" tabIndex={-1}>
          content
        </main>
        <BackToTopButton />
      </>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Yukarı çık' }))
    expect(document.getElementById('main')).toHaveFocus()
  })
})
