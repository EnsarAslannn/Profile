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

type Props = {
  children: ReactNode
}

export default function LanguageProvider({ children }: Props) {
  const location = useLocation()
  const navigate = useNavigate()

  const paramLanguage = useMemo(() => {
    const value = new URLSearchParams(location.search).get(LANGUAGE_PARAM)
    return isLanguage(value) ? value : null
  }, [location.search])

  const [remembered, setRemembered] = useState<Language | null>(() => storedLanguage())

  const language = paramLanguage ?? remembered ?? DEFAULT_LANGUAGE

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const setLanguage = useCallback(
    (next: Language) => {
      setRemembered(next)
      remember(next)

      const params = new URLSearchParams(location.search)
      params.set(LANGUAGE_PARAM, next)
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
