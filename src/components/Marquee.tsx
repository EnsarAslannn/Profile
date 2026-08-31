import { MARQUEE_WORDS } from '../data/marquee'

// The scrolling word strip that separates sections in the reference design.
//
// lang="en" is load-bearing: every entry is an English product or pattern
// name, the strip is CSS-uppercased, and the document is lang="tr" where
// casing maps i -> İ. Untagged, this renders ARCHİTECTURE and TESTCONTAİNERS.
// See src/components/englishLabels.test.tsx.
//
// aria-hidden, and that is not laziness: the track renders its list TWICE
// (see the --animate-marquee-x note in src/index.css - the duplicate is what
// makes the wrap seamless), so a screen reader would read thirty technology
// names through twice for no benefit. Nothing is lost: this is derived from
// the Yetenekler section, which is on the page as real, readable content.
//
// The very low contrast is deliberate and matches the reference: decorative
// texture, not content. WCAG 1.4.3's decorative-text exemption applies.
//
// The strip is the recessed light neutral, which makes it the SEAM between
// two bands: it separates the deep-green Hakkimda from cream Projeler, and
// then shares its ground with Stacks, which it leads into. The old
// `border-y border-line-subtle` came off with it - a hairline drawn exactly
// where deep green meets neutral reads as a mistake, and the colour change is
// already the boundary.
export default function Marquee() {
  return (
    <div
      aria-hidden="true"
      lang="en"
      className="relative overflow-hidden bg-surface-sunken py-8 sm:py-10"
    >
      <div className="flex w-max animate-marquee-x motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {MARQUEE_WORDS.map((word) => (
              <li
                key={word}
                className="flex shrink-0 items-center text-2xl font-bold tracking-tight text-ink-muted/30 uppercase sm:text-3xl lg:text-4xl"
              >
                {word}
                <span className="mx-6 text-accent-soft/50 sm:mx-8">&bull;</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
