// The site ships in two languages. Turkish is the original and the default;
// English is a full translation of the same content, not a reduced version.
//
// A `Localized<T>` is how every piece of owner content is stored: one record
// with both languages side by side, rather than two parallel module trees.
// Keeping the pair in one place is what makes a missing translation a type
// error instead of a silent fallback to Turkish - `Record<Language, T>`
// requires both keys.
export type Language = 'tr' | 'en'

export type Localized<T> = Record<Language, T>

export const LANGUAGES: readonly Language[] = ['tr', 'en'] as const

export const DEFAULT_LANGUAGE: Language = 'tr'

/** The `?lang=` search param, which is what makes an English link shareable. */
export const LANGUAGE_PARAM = 'lang'

/** Remembers the reader's choice between visits. */
export const LANGUAGE_STORAGE_KEY = 'profile:language'

export function isLanguage(value: unknown): value is Language {
  return value === 'tr' || value === 'en'
}
