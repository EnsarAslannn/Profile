import { createContext, useContext } from 'react'
import { DEFAULT_LANGUAGE, type Language } from './language'

export type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
}

export const LanguageContext = createContext<LanguageContextValue>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
})

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext)
}
