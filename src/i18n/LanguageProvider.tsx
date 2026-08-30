import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LanguageContext } from './LanguageContext'
import {
  DEFAULT_LANGUAGE,
  isLanguage,
  LANGUAGE_PARAM,
  LANGUAGE_STORAGE_KEY,
  type Language,
} from './language'

// Reads the stored choice. Wrapped because localStorage is not merely empty in
// a private window or with site data blocked - the accessor itself throws, and
// an unguarded read here would take the whole page down.
function storedLanguage(): Language | null {
  try {
    const value = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return isLanguage(value) ? value : null
  } catch {
    return null
  }
}

function remember(language: Language): void {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // Nothing to do and nothing to report: the language still works for this
    // visit, it just will not be remembered for the next one.
  }
}

type Props = {
  children: ReactNode
}

/**
 * Owns the active language for the whole tree.
 *
 * Resolution order, highest first:
 *
 *  1. `?lang=en` in the URL. This is what makes an English page shareable -
 *     without it the translation would be invisible to anyone the owner sends
 *     a link to, and invisible to a crawler.
 *  2. The reader's remembered choice.
 *  3. Turkish.
 *
 * The URL wins over storage on purpose: a link someone was *sent* has to open
 * in the language it was sent in, whatever that reader picked last time.
 */
export default function LanguageProvider({ children }: Props) {
  const location = useLocation()
  const navigate = useNavigate()

  const paramLanguage = useMemo(() => {
    const value = new URLSearchParams(location.search).get(LANGUAGE_PARAM)
    return isLanguage(value) ? value : null
  }, [location.search])

  // Storage is read once, on mount, rather than on every render: it is a
  // starting value, not a source of truth, and re-reading it would fight the
  // URL every time the reader navigates.
  const [remembered, setRemembered] = useState<Language | null>(() => storedLanguage())

  const language = paramLanguage ?? remembered ?? DEFAULT_LANGUAGE

  // The document's own language attribute has to follow, and not only for
  // correctness in a screen reader: CSS `text-transform: uppercase` is
  // locale-aware, and under lang="tr" it maps i -> İ. Every uppercased label
  // on this site depends on this line being right.
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = useCallback(
    (next: Language) => {
      setRemembered(next)
      remember(next)

      const params = new URLSearchParams(location.search)
      params.set(LANGUAGE_PARAM, next)
      // pathname and hash are carried through explicitly. Dropping the hash
      // would throw a reader who switched language mid-page back to the top,
      // and dropping the pathname would send them home from a project page.
      navigate(
        { pathname: location.pathname, search: `?${params.toString()}`, hash: location.hash },
        { replace: true },
      )
    },
    [location.hash, location.pathname, location.search, navigate],
  )

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
