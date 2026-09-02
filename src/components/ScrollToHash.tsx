import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

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
