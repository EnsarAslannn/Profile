import { MARQUEE_WORDS } from '../data/marquee'

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
