import { useLanguage } from '../i18n/LanguageContext'
import { LANGUAGES, type Language } from '../i18n/language'
import { UI } from '../i18n/ui'

const LABELS: Record<Language, string> = { tr: 'TR', en: 'EN' }

// The accessible name is the language's own name IN that language - "Türkçe",
// "English" - not a translation of it. A reader who cannot read the current
// language still has to be able to find the way out, and "Turkish" is no help
// to someone who only reads Turkish. This is why every language switcher on
// the web is labelled this way.
const NAMES: Record<Language, string> = { tr: 'Türkçe', en: 'English' }

// The two-letter codes are English-alphabet abbreviations rendered through a
// CSS uppercase utility. Under lang="tr" that is the i -> İ trap, except that
// neither "TR" nor "EN" contains an i - they are safe by accident, and the
// lang="en" below makes it safe on purpose so a future third language cannot
// quietly break it.
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
            // aria-pressed rather than a disabled active button: the pressed
            // state is what a screen reader announces, and a disabled control
            // drops out of the tab order, which would leave a keyboard user
            // unable to tell which language they are in.
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1.5 text-[0.6875rem] font-semibold tracking-widest uppercase transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
              active
                ? 'bg-accent-base text-white'
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
