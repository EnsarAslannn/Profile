import { useCallback } from 'react'
import { type To } from 'react-router-dom'
import { useLanguage } from './LanguageContext'
import { DEFAULT_LANGUAGE } from './language'
import { withLanguage } from './localizedPath'

export function useLocalizedTo() {
  const { language } = useLanguage()

  return useCallback(
    (to: To): To => {
      if (language === DEFAULT_LANGUAGE) return to

      if (typeof to === 'string') {
        const [pathname, hash] = to.split('#')
        const localized = withLanguage(pathname, language)
        return hash ? `${localized}#${hash}` : localized
      }

      if (!to.pathname) return to

      return { ...to, pathname: withLanguage(to.pathname, language) }
    },
    [language],
  )
}
