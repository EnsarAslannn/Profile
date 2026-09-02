import { useEffect, useRef } from 'react'

const REVEALED = 'in'

const REVEAL_THRESHOLD = 0.92

const REVEAL_DELAY_CLASSES = [
  '[--reveal-delay:0ms]',
  '[--reveal-delay:80ms]',
  '[--reveal-delay:160ms]',
  '[--reveal-delay:240ms]',
  '[--reveal-delay:320ms]',
  '[--reveal-delay:400ms]',
]

export function revealDelayClass(index: number): string {
  return REVEAL_DELAY_CLASSES[Math.min(index, REVEAL_DELAY_CLASSES.length - 1)]
}

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    let pending = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (pending.length === 0) return

    let frame = 0

    const stop = () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    }

    const sweep = () => {
      frame = 0
      const limit = window.innerHeight * REVEAL_THRESHOLD
      pending = pending.filter((element) => {
        if (element.getBoundingClientRect().top >= limit) return true
        element.dataset.reveal = REVEALED
        return false
      })
      if (pending.length === 0) stop()
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(sweep)
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(sweep)
    })

    return stop
  }, [])

  return ref
}
