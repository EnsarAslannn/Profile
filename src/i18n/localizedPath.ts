import { DEFAULT_LANGUAGE, LANGUAGES, type Language } from './language'

export function languageFromPath(pathname: string): Language | null {
  const segment = pathname.split('/')[1]
  const match = LANGUAGES.find(
    (language) => language !== DEFAULT_LANGUAGE && language === segment,
  )
  return match ?? null
}

export function stripLanguage(pathname: string): string {
  const language = languageFromPath(pathname)
  if (!language) return pathname

  const rest = pathname.slice(language.length + 1)
  return rest === '' || rest === '/' ? '/' : rest
}

export function withLanguage(pathname: string, language: Language): string {
  const base = stripLanguage(pathname)
  if (language === DEFAULT_LANGUAGE) return base

  return base === '/' ? `/${language}` : `/${language}${base}`
}
