import { useLanguage } from '../i18n/LanguageContext'
import { UI } from '../i18n/ui'

// The first focusable element on every route, and the only way past the
// navbar for a keyboard reader: the sticky bar holds two language buttons,
// the wordmark and six section links, so without this a reader tabs nine
// times on EVERY route before reaching the content. Each page marks its
// <main> with id="main" and tabIndex={-1} as the target.
//
// A plain <a href="#main">, deliberately, and not a router <Link>. A fragment
// link is a same-document navigation the browser handles itself: it scrolls
// to the target AND moves focus into it, which is the entire point - a router
// Link would update the location and scroll, but leave focus back on the
// link, so the next Tab would return the reader to the navbar they were
// trying to escape.
//
// `sr-only` until focused rather than hidden: an element with display:none or
// visibility:hidden is not focusable at all, so a skip link built that way
// can never be reached.
export default function SkipLink() {
  const { language } = useLanguage()

  return (
    <a
      href="#main"
      // Two things here are not free choices.
      //
      // The PADDING is focus-scoped. Tailwind's `not-sr-only` resets
      // `padding: 0` as part of undoing `sr-only`, and because it arrives
      // through a `focus:` variant it lands later in the cascade than a plain
      // `px-5 py-3` - which it then wins. Written unscoped, the pill renders
      // 20px tall with its label touching the edges; measured in a browser,
      // because jsdom has no cascade to get this wrong in.
      //
      // z-[60] is one of the few values the built-in scale genuinely cannot
      // express: it stops at z-50, and the sticky navbar is z-50, so anything
      // lower would put the skip link behind the bar it exists to jump over.
      //
      // Centred rather than pinned to the top-left corner, which is where the
      // language toggle already is - the link would surface directly on top of
      // it and read as a rendering fault. The middle of the bar is empty at
      // every width.
      className="sr-only rounded-full bg-cta-base text-sm font-semibold text-cta-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-1/2 focus:z-[60] focus:-translate-x-1/2 focus:px-5 focus:py-3 focus:outline-2 focus:outline-offset-2 focus:outline-focus"
    >
      {UI[language].skipToContent}
    </a>
  )
}
