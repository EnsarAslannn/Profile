export type Language = 'tr' | 'en'

export type Localized<T> = Record<Language, T>

export const LANGUAGES: readonly Language[] = ['tr', 'en'] as const

export const DEFAULT_LANGUAGE: Language = 'tr'

export const LANGUAGE_PARAM = 'lang'

export const LANGUAGE_STORAGE_KEY = 'profile:language'

export function isLanguage(value: unknown): value is Language {
  return value === 'tr' || value === 'en'
}
