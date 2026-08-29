type Props = {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  /**
   * Set to 'en' when the title is an English word. The page is lang="tr" and
   * these headings are CSS-uppercased, where Turkish casing maps i -> İ; it
   * also stops a screen reader pronouncing the word as Turkish. Turkish
   * titles must leave this unset - "İletişim" -> "İLETİŞİM" is correct
   * precisely because the locale is Turkish.
   */
  lang?: string
}

// One component owns the whole section-heading scale, so the five sections
// cannot drift apart the way five hand-written class strings would. It is
// also the only place the h2 size lives - see CLAUDE.md's type scale.
//
// The reference design prints a [001]-style index above each heading. It was
// reproduced and then removed at the owner's request; do not reinstate it
// without asking, and note that removing it is why nothing here needs to know
// its own position in the page.
export default function SectionHeading({ title, subtitle, align = 'left', lang }: Props) {
  const centered = align === 'center'

  return (
    <div className={centered ? 'text-center' : ''}>
      <h2
        data-reveal
        {...(lang ? { lang } : {})}
        className="text-4xl font-bold tracking-tight text-ink-strong uppercase sm:text-5xl lg:text-6xl"
      >
        {title}
      </h2>
      {subtitle && (
        <p
          data-reveal
          className={`mt-6 font-serif text-lg italic leading-relaxed text-ink-body [--reveal-delay:80ms] sm:text-xl ${
            centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
