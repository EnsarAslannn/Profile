import { createContext, useContext } from 'react'
import { DEFAULT_LANGUAGE, type Language } from './language'

export type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
}

// Split from the provider component on purpose: a file that exports both a
// component and a hook trips react/only-export-components, and this half has
// to be importable by tests that render a bare component without the tree.
export const LanguageContext = createContext<LanguageContextValue>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
})

/**
 * The active language, plus the setter the toggle calls.
 *
 * The default context value is deliberately a working one rather than
 * `undefined` with a throw: a component rendered outside the provider - which
 * in practice means a unit test that renders one card on its own - should show
 * Turkish, not crash. Nothing about this site needs the provider to exist for
 * the markup to be correct.
 */
export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext)
}
