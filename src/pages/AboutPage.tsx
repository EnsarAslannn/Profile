import { Link } from 'react-router-dom'
import profilePhoto from '../assets/ea.webp'
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon'
import ProfileCard from '../components/ProfileCard'
import RouteMeta from '../components/RouteMeta'
import { ABOUT_PARAGRAPHS } from '../data/about'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedTo } from '../i18n/useLocalizedTo'
import type { Localized } from '../i18n/language'
import { UI } from '../i18n/ui'
import { CONTENT_CONTAINER } from '../lib/layout'
import { SITE_NAME, truncateForDescription } from '../lib/siteMeta'
import { useReveal } from '../lib/useReveal'

const PAGE_DESCRIPTION: Localized<string> = {
  tr: truncateForDescription(ABOUT_PARAGRAPHS.tr[0].text),
  en: truncateForDescription(ABOUT_PARAGRAPHS.en[0].text),
}

export default function AboutPage() {
  const revealRoot = useReveal<HTMLElement>()
  const { language } = useLanguage()
  const localizedTo = useLocalizedTo()
  const ui = UI[language]

  return (
    <>
      <RouteMeta
        title={`${ui.aboutPageTitle} | ${SITE_NAME}`}
        description={PAGE_DESCRIPTION[language]}
        image={profilePhoto}
        type="website"
      />
      <main ref={revealRoot} id="main" tabIndex={-1} className={`focus:outline-none ${CONTENT_CONTAINER}`}>
        <div className="py-16">
          <Link
            to={localizedTo('/')}
            className="mb-8 inline-flex items-center gap-2 rounded px-3 py-3 text-sm font-medium text-accent-base transition-colors duration-200 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:text-accent-active"
          >
            <ArrowLeftIcon className="h-4 w-4 shrink-0" />
            {ui.back}
          </Link>

          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[288px_minmax(0,1fr)] lg:items-start lg:gap-12 xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-16">
            <div className="lg:sticky lg:top-28 lg:col-start-1">
              <ProfileCard />
            </div>
            <div className="lg:col-start-2 lg:min-w-0">
              <h1
                data-reveal
                className="text-4xl font-bold tracking-tight text-ink-strong sm:text-5xl"
              >
                {ui.aboutPageTitle}
              </h1>
              <div className="mt-10 space-y-5">
                {ABOUT_PARAGRAPHS[language].map((paragraph) => (
                  <p
                    key={paragraph.id}
                    data-about-paragraph
                    data-reveal
                    className="text-base leading-relaxed text-ink-body sm:text-lg sm:leading-loose xl:text-xl"
                  >
                    {paragraph.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
