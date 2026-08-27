import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router does not scroll to a #hash on navigation - this component
// does it. It keys on location.key (not just pathname/hash) because Router
// mints a fresh key on every push, including a push to the identical URL,
// which is what makes clicking a footer section link a second time re-scroll
// instead of being a no-op.
export default function ScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.key, location.pathname, location.hash])

  return null
}
