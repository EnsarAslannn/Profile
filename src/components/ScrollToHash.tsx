import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

// React Router does not scroll to a #hash on navigation - this component
// does it. It keys on location.key (not just pathname/hash) because Router
// mints a fresh key on every push, including a push to the identical URL,
// which is what makes clicking a footer section link a second time re-scroll
// instead of being a no-op.
//
// The one navigation it must sit out is a SEARCH-ONLY one. LanguageProvider
// switches language with `navigate({ pathname, search, hash }, { replace: true })`
// - and a replace mints a fresh key exactly like a push does, so the effect
// re-ran and the reader who had scrolled down to Projeler was thrown back to
// the top the moment they pressed EN. Comparing pathname and hash against the
// previous location is what separates the two cases: a repeat click on the
// same section link changes neither and still scrolls (it is a real
// navigation the reader asked for), while a language switch changes only the
// query string and is left alone.
export default function ScrollToHash() {
  const location = useLocation()
  const previous = useRef<{ pathname: string; search: string; hash: string } | null>(null)

  useEffect(() => {
    const from = previous.current
    previous.current = {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
    }

    const searchOnly =
      from !== null &&
      from.pathname === location.pathname &&
      from.hash === location.hash &&
      from.search !== location.search
    if (searchOnly) return

    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.key, location.pathname, location.search, location.hash])

  return null
}
