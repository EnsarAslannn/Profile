import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { NAV_LINKS } from '../data/navigation'

// Below this scrollY (in px) the navbar renders fully transparent, so the
// PageBackdrop gradient shows through completely - the maximal version of
// "adapts to what scrolls under it". Past it, the navbar becomes a
// near-opaque bar, which is the only mechanism proven safe (see the
// six-owner-changes handoff's alpha-floor table) against an arbitrary dark
// project screenshot or the profile photo scrolling underneath.
const NAV_SCROLL_THRESHOLD = 12

const HEADER_CLASS_TOP =
  'sticky top-0 z-50 border-b border-transparent bg-transparent transition-[background-color,border-color,box-shadow] duration-300 motion-reduce:transition-none'
const HEADER_CLASS_SCROLLED =
  'sticky top-0 z-50 border-b border-line-strong bg-surface-raised/90 shadow-sm shadow-slate-950/10 backdrop-blur-sm transition-[background-color,border-color,box-shadow] duration-300 motion-reduce:transition-none'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(() => window.scrollY > NAV_SCROLL_THRESHOLD)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled((prev) => {
        const next = window.scrollY > NAV_SCROLL_THRESHOLD
        return prev === next ? prev : next
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      data-nav-state={scrolled ? 'scrolled' : 'top'}
      className={scrolled ? HEADER_CLASS_SCROLLED : HEADER_CLASS_TOP}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1 sm:px-8 lg:px-10 xl:px-12">
        <Link
          to={{ pathname: '/', hash: '#hakkimda' }}
          className="inline-flex items-center rounded py-3 font-semibold text-ink-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          Anasayfa
        </Link>
        <ul className="flex gap-6 text-sm text-ink-body">
          {NAV_LINKS.map((link) => (
            <li key={link.anchor}>
              <Link
                to={{ pathname: '/', hash: `#${link.anchor}` }}
                className="inline-flex items-center rounded px-2 py-3 transition-colors hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
