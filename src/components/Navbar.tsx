import { Link } from 'react-router-dom'
import LanguageToggle from './LanguageToggle'
import { useLanguage } from '../i18n/LanguageContext'
import { UI } from '../i18n/ui'
import { NAV_LINKS } from '../data/navigation'
import { CONTENT_CONTAINER } from '../lib/layout'
import { SITE_NAME } from '../lib/siteMeta'

// Reinstated for the example.mp4 redesign (it had been removed in
// five-owner-changes Task 4; the reference design has one and the owner asked
// for it back). The reference also carries a language switcher and a theme
// toggle. The switcher is now real and sits at the far left, where the owner
// asked for it; the theme toggle is still deliberately omitted, because this
// site has no dark theme and a control that does nothing is worse than no
// control.
//
// Links are router <Link>s with an absolute-to-home hash, never bare
// <a href="#projeler">: clicked from /projects/dolfin, a bare hash would
// produce the dead URL /projects/dolfin#projeler. Same reasoning the old
// FooterNav carried.
const LINK_CLASS =
  'inline-flex shrink-0 items-center rounded px-3 py-3 text-xs font-medium tracking-widest text-ink-strong uppercase transition-colors duration-200 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:text-accent-active'

export default function Navbar() {
  const { language } = useLanguage()
  const ui = UI[language]

  return (
    // Deliberately thin: at /55 the page ground reads THROUGH the bar, so the
    // navbar takes on whatever is behind it - the blue backdrop wash at the
    // top of the page, plain surface-base once that has faded, a card or a
    // photo as one scrolls past. That is the whole effect, and it is why the
    // tint cannot be raised much: the heavier the white, the more the bar goes
    // back to being an opaque strip. The blur is what keeps text legible over
    // whatever is passing underneath, so the two are one setting, not two.
    <header className="sticky top-0 z-50 border-b border-line-subtle bg-surface-base/55 backdrop-blur-xl backdrop-saturate-150">
      <div className={`flex items-center justify-between gap-4 py-3 ${CONTENT_CONTAINER}`}>
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <LanguageToggle />
          <Link
            to="/"
            className="shrink-0 rounded text-sm font-bold tracking-tight text-ink-strong transition-colors duration-200 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:text-base"
          >
            {SITE_NAME}
          </Link>
        </div>
        {/* Six Turkish labels do not fit one line on a phone, and a hamburger
            would need open/close state, a focus trap and an Escape handler for
            a menu of six anchors. A scroll strip keeps every link reachable by
            touch and by keyboard with no JavaScript at all; from lg: it is an
            ordinary row and the strip never shows. */}
        <nav
          aria-label={ui.navAriaLabel}
          className="-mx-2 flex min-w-0 items-center gap-1 overflow-x-auto px-2 [scrollbar-width:none] lg:mx-0 lg:gap-2 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {NAV_LINKS[language].map((link) => (
            <Link
              key={link.anchor}
              to={{ pathname: '/', hash: `#${link.anchor}` }}
              {...(link.lang ? { lang: link.lang } : {})}
              className={LINK_CLASS}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
