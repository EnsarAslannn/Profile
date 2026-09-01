import { useCallback } from 'react'
import { useLocation, type To } from 'react-router-dom'
import { isLanguage, LANGUAGE_PARAM } from './language'

/**
 * Carries `?lang=` from the current URL onto an internal router destination.
 *
 * Every `<Link>` on the site used to drop it. That was invisible to a reader -
 * LanguageProvider remembers the choice in localStorage, so the page stayed
 * English - but it cost the two things the parameter exists for:
 *
 *  - A URL copied out of the address bar mid-visit opened in Turkish for
 *    whoever it was sent to, which is the opposite of what `?lang=en` is for.
 *  - A crawler has no localStorage and no memory between requests, so from
 *    `/?lang=en` it followed a link to `/hakkimda` and got Turkish. The
 *    English site was reachable only at the one address someone typed by
 *    hand, and everything past the first click was uncrawlable.
 *
 * It is carried only when the current URL actually has it, so a Turkish
 * reader - the default - still gets clean, parameter-free links, and nothing
 * appends `?lang=tr` to a URL that means that already.
 */
export function useLocalizedTo() {
  const { search } = useLocation()
  const value = new URLSearchParams(search).get(LANGUAGE_PARAM)
  const carried = isLanguage(value) ? `?${LANGUAGE_PARAM}=${value}` : ''

  return useCallback(
    (to: To): To => {
      if (!carried) return to

      // A string destination may carry its own fragment ('/#projeler'), and
      // the parameter has to land BEFORE it - '/#projeler?lang=en' is part of
      // the fragment, not a query.
      if (typeof to === 'string') {
        const [pathname, hash] = to.split('#')
        return { pathname, search: carried, ...(hash ? { hash: `#${hash}` } : {}) }
      }

      return { ...to, search: carried }
    },
    [carried],
  )
}
