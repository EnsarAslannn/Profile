import ArrowLeftIcon from './icons/ArrowLeftIcon'
import { useLanguage } from '../i18n/LanguageContext'
import { withLanguage } from '../i18n/localizedPath'
import { UI } from '../i18n/ui'
import { CONTENT_CONTAINER } from '../lib/layout'

export default function AppError() {
  const { language } = useLanguage()
  const ui = UI[language]

  return (
    <main id="main" tabIndex={-1} className={`py-24 focus:outline-none ${CONTENT_CONTAINER}`}>
      <div className="mx-auto max-w-2xl" role="alert">
        <h1 className="text-4xl font-bold tracking-tight text-ink-strong sm:text-5xl">
          {ui.errorTitle}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-body sm:text-lg sm:leading-loose">
          {ui.errorBody}
        </p>
        <a
          href={withLanguage('/', language)}
          className="mt-8 inline-flex items-center gap-2 rounded px-3 py-3 text-sm font-medium text-accent-base transition-colors duration-200 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:text-accent-active"
        >
          <ArrowLeftIcon className="h-4 w-4 shrink-0" />
          {ui.errorAction}
        </a>
      </div>
    </main>
  )
}
