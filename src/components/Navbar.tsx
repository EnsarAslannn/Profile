import { Link, useLocation } from 'react-router-dom'
import LanguageToggle from './LanguageToggle'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedTo } from '../i18n/useLocalizedTo'
import { UI } from '../i18n/ui'
import { NAV_LINKS, NO_ANCHORS, SECTION_ANCHORS } from '../data/navigation'
import { CONTENT_CONTAINER } from '../lib/layout'
import { SITE_NAME } from '../lib/siteMeta'
import { useActiveSection } from '../lib/useActiveSection'

const LINK_CLASS =
  'inline-flex shrink-0 items-center rounded border-b-2 px-3 py-3 text-xs font-medium tracking-widest text-ink-strong uppercase transition-colors duration-200 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:text-accent-active'

export default function Navbar() {
  const { language } = useLanguage()
  const localizedTo = useLocalizedTo()
  const isHome = useLocation().pathname === '/'
  const ui = UI[language]

  const activeAnchor = useActiveSection(isHome ? SECTION_ANCHORS : NO_ANCHORS)

  return (
    <header className="sticky top-0 z-50 border-b border-line-subtle bg-surface-base/80 backdrop-blur-xl backdrop-saturate-150">
      <div className={`flex items-center justify-between gap-4 py-3 ${CONTENT_CONTAINER}`}>
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <LanguageToggle />
          <Link
            to={localizedTo('/')}
            aria-current={isHome ? 'page' : undefined}
            className="shrink-0 rounded text-sm font-bold tracking-tight text-ink-strong transition-colors duration-200 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:text-base"
          >
            {SITE_NAME}
          </Link>
        </div>
        <nav
          aria-label={ui.navAriaLabel}
          className="-mx-2 flex min-w-0 items-center gap-1 overflow-x-auto px-2 [scrollbar-width:none] lg:mx-0 lg:gap-2 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {NAV_LINKS[language].map((link) => {
            const current = link.anchor === activeAnchor
            return (
              <Link
                key={link.anchor}
                to={localizedTo({ pathname: '/', hash: `#${link.anchor}` })}
                {...(link.lang ? { lang: link.lang } : {})}
                aria-current={current ? 'location' : undefined}
                className={`${LINK_CLASS} ${current ? 'border-accent-base' : 'border-transparent'}`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
