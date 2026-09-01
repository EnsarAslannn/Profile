import { Link, useLocation } from 'react-router-dom'
import LanguageToggle from './LanguageToggle'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedTo } from '../i18n/useLocalizedTo'
import { UI } from '../i18n/ui'
import { NAV_LINKS, NO_ANCHORS, SECTION_ANCHORS } from '../data/navigation'
import { CONTENT_CONTAINER } from '../lib/layout'
import { SITE_NAME } from '../lib/siteMeta'
import { useActiveSection } from '../lib/useActiveSection'

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
// `border-b-2` is on EVERY link, not just the active one: the underline has
// to occupy its 2px whether or not it is painted, or the row would shift by
// two pixels each time the reader scrolls from one section into the next.
// Only the COLOUR changes, and that colour is written by the caller as
// exactly one of two classes rather than as an override on a transparent
// default - `border-transparent` and `border-accent-base` are both single
// class selectors, so which one wins would come down to the order Tailwind
// happened to emit them in. It emitted the transparent one last, and the
// underline never painted at all. Measured in a browser; this is the same
// cascade trap SkipLink's padding hit.
const LINK_CLASS =
  'inline-flex shrink-0 items-center rounded border-b-2 px-3 py-3 text-xs font-medium tracking-widest text-ink-strong uppercase transition-colors duration-200 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:text-accent-active'

export default function Navbar() {
  const { language } = useLanguage()
  const localizedTo = useLocalizedTo()
  const isHome = useLocation().pathname === '/'
  const ui = UI[language]

  // Tracked only on the home route. Off it the six links navigate AWAY rather
  // than describing where the reader is - İletişim is rendered on every route
  // by the chrome, but clicking its link from /hakkimda leaves the page, so
  // calling it "current" there would be a lie. The anchors are identical in
  // both languages by the section contract, so this does not change with it.
  const activeAnchor = useActiveSection(isHome ? SECTION_ANCHORS : NO_ANCHORS)

  return (
    // Still translucent - the ground reads THROUGH the bar and the blur is
    // what keeps text legible over whatever is passing underneath, so the two
    // are one setting, not two. But the tint went 55% -> 80% when the page
    // became a set of alternating light and DEEP GREEN bands. At 55% the bar
    // blended to a mid sage-grey every time a dark band scrolled under it,
    // which read as a separate coloured panel appearing and disappearing -
    // exactly what the owner asked the navbar not to do. At 80% it stays in
    // the cream family over every band while still taking a warm tint from a
    // photo, and the ink-strong links improve rather than suffer: the worst
    // ground the bar can now sit on is cream-over-deep-green at rgb(202,205,196),
    // where #111 measures 11.4:1 (it was 6.15:1 against the old blue theme).
    <header className="sticky top-0 z-50 border-b border-line-subtle bg-surface-base/80 backdrop-blur-xl backdrop-saturate-150">
      <div className={`flex items-center justify-between gap-4 py-3 ${CONTENT_CONTAINER}`}>
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <LanguageToggle />
          {/* "page" here and "location" on the section links below, because
              the two answer different questions: this one points at a ROUTE
              and the router knows which route is open, while those point at
              positions within one page. */}
          <Link
            to={localizedTo('/')}
            aria-current={isHome ? 'page' : undefined}
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
          {NAV_LINKS[language].map((link) => {
            const current = link.anchor === activeAnchor
            return (
              <Link
                key={link.anchor}
                to={localizedTo({ pathname: '/', hash: `#${link.anchor}` })}
                {...(link.lang ? { lang: link.lang } : {})}
                // "location" and not "page": the page has not changed, the
                // reader has moved within it. aria-current="page" here would
                // tell a screen reader six different links are six different
                // pages.
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
