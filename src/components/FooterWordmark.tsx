import { useEffect, useRef } from 'react'
import { SITE_NAME } from '../lib/siteMeta'

// Cursor-tracking highlight over a static wordmark. The base <text> layer
// (line-strong, unmasked) is the true default - it renders legibly with no
// JS, no mask-image support, reduced motion, or a touch pointer. The
// highlight layer's mask defaults to -9999px INSIDE the class string
// itself (see src/index.css's --wordmark-x/-y @property registrations), so
// nothing has to actively turn the effect off in any of those cases - the
// pointermove listener below is a pure enhancement, never a requirement.
export default function FooterWordmark() {
  const wordmarkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canHover = window.matchMedia('(hover: hover)').matches
    if (prefersReducedMotion || !canHover) return

    const element = wordmarkRef.current
    if (!element) return

    const handlePointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      element.style.setProperty('--wordmark-x', `${event.clientX - rect.left}px`)
      element.style.setProperty('--wordmark-y', `${event.clientY - rect.top}px`)
    }

    element.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => element.removeEventListener('pointermove', handlePointerMove)
  }, [])

  return (
    <div ref={wordmarkRef} aria-hidden="true" className="w-full select-none">
      <svg viewBox="0 0 1200 200" className="block h-auto w-full" focusable="false">
        <text
          x="0"
          y="150"
          textLength="1200"
          lengthAdjust="spacingAndGlyphs"
          fontWeight={800}
          fontSize={170}
          letterSpacing="-4"
          className="font-sans text-line-strong"
          fill="currentColor"
        >
          {SITE_NAME}
        </text>
        <text
          x="0"
          y="150"
          textLength="1200"
          lengthAdjust="spacingAndGlyphs"
          fontWeight={800}
          fontSize={170}
          letterSpacing="-4"
          className="font-sans text-accent-base [mask-image:radial-gradient(circle_170px_at_var(--wordmark-x,-9999px)_var(--wordmark-y,-9999px),black_0%,black_35%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_170px_at_var(--wordmark-x,-9999px)_var(--wordmark-y,-9999px),black_0%,black_35%,transparent_100%)] transition-[--wordmark-x,--wordmark-y] duration-150 ease-out motion-reduce:transition-none"
          fill="currentColor"
        >
          {SITE_NAME}
        </text>
      </svg>
    </div>
  )
}
