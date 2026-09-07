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
import { languageFromPath, withLanguage } from './localizedPath'

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
  }
}

function withoutLanguageParam(search: string): { search: string; changed: boolean } {
  const params = new URLSearchParams(search)
  if (!params.has(LANGUAGE_PARAM)) return { search, changed: false }

  params.delete(LANGUAGE_PARAM)
  const remaining = params.toString()
  return { search: remaining ? `?${remaining}` : '', changed: true }
}

type Props = {
  children: ReactNode
}

export default function LanguageProvider({ children }: Props) {
  const location = useLocation()
  const navigate = useNavigate()

  const pathLanguage = languageFromPath(location.pathname)

  const paramLanguage = useMemo(() => {
    const value = new URLSearchParams(location.search).get(LANGUAGE_PARAM)
    return isLanguage(value) ? value : null
  }, [location.search])

  const [remembered, setRemembered] = useState<Language | null>(() => storedLanguage())

  const language = pathLanguage ?? paramLanguage ?? remembered ?? DEFAULT_LANGUAGE

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    const { search, changed } = withoutLanguageParam(location.search)
    const pathname = withLanguage(location.pathname, language)
    if (pathname === location.pathname && !changed) return

    navigate({ pathname, search, hash: location.hash }, { replace: true })
  }, [language, location.hash, location.pathname, location.search, navigate])

  const setLanguage = useCallback(
    (next: Language) => {
      setRemembered(next)
      remember(next)

      navigate(
        {
          pathname: withLanguage(location.pathname, next),
          search: withoutLanguageParam(location.search).search,
          hash: location.hash,
        },
        { replace: true },
      )
    },
    [location.hash, location.pathname, location.search, navigate],
  )

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
