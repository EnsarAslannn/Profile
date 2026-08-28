import { useEffect, useRef } from 'react'

// Scroll/load reveal, one watcher per container instead of one per element.
//
// Why a container hook and not a <Reveal> wrapper component: a wrapper would
// add a real <div> to the DOM, and half the things worth revealing are grid
// items (ProjectCard's <li>, Skills' cards) where an extra box between the
// grid and its child silently breaks the track sizing. Marking the element
// itself with `data-reveal` and letting an ancestor find it keeps the markup
// exactly as it was.
//
// Why a scroll sweep and not IntersectionObserver: an observer only fires
// when an element's intersection STATE changes. Jump from the top of the page
// to the bottom in one go - a footer anchor link, the End key, a flung
// touchpad - and everything in between goes from "below the fold" straight to
// "above the fold" without ever intersecting, so its callback never runs and
// those elements stay invisible for the rest of the session. Measured: 8 of
// 17 elements stuck that way at 1440px. A sweep asks the question the page
// actually cares about (has this element been reached yet?) instead of the
// one an observer answers (is it on screen right now?), so scrolled-past
// content is revealed too. The listener is passive, coalesced into one
// animation frame, and removes itself the moment nothing is left pending.
//
// The animation itself is pure CSS - see the [data-reveal] rules in
// src/index.css, which also own the prefers-reduced-motion opt-out. This file
// only decides WHEN an element flips to its revealed state; it sets no
// styles, so no motion library is involved (CLAUDE.md bans framer-motion).
const REVEALED = 'in'

// An element counts as reached once its top passes this fraction of the
// viewport height, matching the "not quite at the very bottom edge" feel a
// negative IntersectionObserver rootMargin would have given.
const REVEAL_THRESHOLD = 0.92

// Literal strings, not a template - Tailwind scans source text, so an
// interpolated `[--reveal-delay:${n}ms]` would never be generated. Six entries
// because Skills renders six cards; anything past the end reuses the last.
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

    // The first sweep waits two frames rather than running here. A style
    // change only transitions if the browser has painted the previous value
    // at least once, and both this effect and a single rAF still run before
    // that first paint - reveal on either and the above-the-fold content
    // snaps to visible with no load animation at all.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(sweep)
    })

    return stop
  }, [])

  return ref
}
