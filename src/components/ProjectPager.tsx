import { Link } from 'react-router-dom'
import ArrowLeftIcon from './icons/ArrowLeftIcon'
import type { Project } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedTo } from '../i18n/useLocalizedTo'
import { UI } from '../i18n/ui'

type Props = {
  previous: Project | undefined
  next: Project | undefined
}

const LINK_CLASS =
  'group flex max-w-[15rem] flex-col gap-1 rounded px-3 py-3 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus'

const KICKER_CLASS =
  'inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-ink-muted uppercase'

const TITLE_CLASS =
  'text-base font-semibold tracking-tight text-ink-strong transition-colors duration-200 group-hover:text-accent-hover'

export default function ProjectPager({ previous, next }: Props) {
  const { language } = useLanguage()
  const localizedTo = useLocalizedTo()
  const ui = UI[language]

  if (!previous && !next) return null

  return (
    <nav
      aria-label={ui.projectPagerLabel}
      className="mt-12 flex items-start justify-between gap-4 border-t border-line-subtle pt-8"
    >
      {previous ? (
        <Link to={localizedTo(`/projects/${previous.slug}`)} className={`${LINK_CLASS} -ml-3`}>
          <span className={KICKER_CLASS}>
            <ArrowLeftIcon className="h-3.5 w-3.5 shrink-0" />
            {ui.previousProject}
          </span>
          <span className={TITLE_CLASS}>{previous.title}</span>
        </Link>
      ) : (
        <span />
      )}

      {next && (
        <Link
          to={localizedTo(`/projects/${next.slug}`)}
          className={`${LINK_CLASS} -mr-3 ml-auto items-end text-right`}
        >
          <span className={KICKER_CLASS}>
            {ui.nextProject}
            <ArrowLeftIcon className="h-3.5 w-3.5 shrink-0 rotate-180" />
          </span>
          <span className={TITLE_CLASS}>{next.title}</span>
        </Link>
      )}
    </nav>
  )
}
