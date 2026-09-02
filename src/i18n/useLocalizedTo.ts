import { useCallback } from 'react'
import { useLocation, type To } from 'react-router-dom'
import { isLanguage, LANGUAGE_PARAM } from './language'

export function useLocalizedTo() {
  const { search } = useLocation()
  const value = new URLSearchParams(search).get(LANGUAGE_PARAM)
  const carried = isLanguage(value) ? `?${LANGUAGE_PARAM}=${value}` : ''

  return useCallback(
    (to: To): To => {
      if (!carried) return to

      if (typeof to === 'string') {
        const [pathname, hash] = to.split('#')
        return { pathname, search: carried, ...(hash ? { hash: `#${hash}` } : {}) }
      }

      return { ...to, search: carried }
    },
    [carried],
  )
}
