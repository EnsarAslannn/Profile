import { useLanguage } from '../i18n/LanguageContext'
import { LANGUAGES, type Language } from '../i18n/language'
import { UI } from '../i18n/ui'

const LABELS: Record<Language, string> = { tr: 'TR', en: 'EN' }

const NAMES: Record<Language, string> = { tr: 'Türkçe', en: 'English' }

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()
  const ui = UI[language]

  return (
    <div
      role="group"
      aria-label={ui.languageGroupAriaLabel}
      className="flex shrink-0 items-center gap-0.5 rounded-full border border-line-subtle bg-surface-raised/70 p-0.5"
    >
      {LANGUAGES.map((code) => {
        const active = code === language
        return (
          <button
            key={code}
            type="button"
            lang="en"
            onClick={() => setLanguage(code)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1.5 text-[0.6875rem] font-semibold tracking-widest uppercase transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
              active
                ? 'bg-accent-soft text-accent-ink'
                : 'text-ink-body hover:text-accent-hover active:text-accent-active'
            }`}
          >
            <span aria-hidden="true">{LABELS[code]}</span>
            <span className="sr-only" lang={code}>
              {NAMES[code]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
