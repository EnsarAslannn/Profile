import { fireEvent, render, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { revealDelayClass, useReveal } from './useReveal'

const placeAt = (element: Element, top: number) => {
  element.getBoundingClientRect = () => ({ top }) as DOMRect
}

function Fixture() {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref}>
      <p data-reveal data-testid="first">
        first
      </p>
      <p data-reveal data-testid="second">
        second
      </p>
      <p data-testid="untouched">untouched</p>
    </div>
  )
}

describe('useReveal', () => {
  it('reveals what is already in view, and never touches an unmarked element', async () => {
    const { getByTestId } = render(<Fixture />)

    await waitFor(() => expect(getByTestId('first').dataset.reveal).toBe('in'))
    expect(getByTestId('second').dataset.reveal).toBe('in')
    expect(getByTestId('untouched').dataset.reveal).toBeUndefined()
  })

  it('holds an element below the fold back until it is scrolled to', async () => {
    const { getByTestId } = render(<Fixture />)
    const second = getByTestId('second')
    placeAt(second, 5000)

    await waitFor(() => expect(getByTestId('first').dataset.reveal).toBe('in'))
    expect(second.dataset.reveal).not.toBe('in')

    placeAt(second, 100)
    fireEvent.scroll(window)

    await waitFor(() => expect(second.dataset.reveal).toBe('in'))
  })

  it('reveals an element that was scrolled clean past without ever being on screen', async () => {
    const { getByTestId } = render(<Fixture />)
    const second = getByTestId('second')
    placeAt(second, -4000)

    await waitFor(() => expect(second.dataset.reveal).toBe('in'))
  })

  it('stops listening once nothing is left to reveal', async () => {
    const removeListener = vi.spyOn(window, 'removeEventListener')
    const { getByTestId } = render(<Fixture />)

    await waitFor(() => expect(getByTestId('second').dataset.reveal).toBe('in'))

    const removed = removeListener.mock.calls.map((call) => call[0])
    expect(removed).toContain('scroll')
    expect(removed).toContain('resize')
  })

  it('registers nothing when the container holds nothing to reveal', () => {
    const addListener = vi.spyOn(window, 'addEventListener')
    function Empty() {
      const ref = useReveal<HTMLDivElement>()
      return <div ref={ref}>nothing to reveal</div>
    }
    render(<Empty />)
    expect(addListener.mock.calls.map((call) => call[0])).not.toContain('scroll')
  })
})

describe('revealDelayClass', () => {
  it('staggers by index and clamps past the end of the scale', () => {
    expect(revealDelayClass(0)).toBe('[--reveal-delay:0ms]')
    expect(revealDelayClass(2)).toBe('[--reveal-delay:160ms]')
    expect(revealDelayClass(5)).toBe('[--reveal-delay:400ms]')
    expect(revealDelayClass(9)).toBe(revealDelayClass(5))
  })
})
