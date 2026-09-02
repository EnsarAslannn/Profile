import { useLanguage } from '../i18n/LanguageContext'
import { UI } from '../i18n/ui'

export default function SkipLink() {
  const { language } = useLanguage()

  return (
    <a
      href="#main"
      className="sr-only rounded-full bg-cta-base text-sm font-semibold text-cta-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-1/2 focus:z-[60] focus:-translate-x-1/2 focus:px-5 focus:py-3 focus:outline-2 focus:outline-offset-2 focus:outline-focus"
    >
      {UI[language].skipToContent}
    </a>
  )
}
