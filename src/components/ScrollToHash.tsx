import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { stripLanguage } from '../i18n/localizedPath'

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

    const sameSection =
      from !== null &&
      stripLanguage(from.pathname) === stripLanguage(location.pathname) &&
      from.hash === location.hash &&
      (from.pathname !== location.pathname || from.search !== location.search)
    if (sameSection) return

    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.key, location.pathname, location.search, location.hash])

  return null
}
