import { Link } from 'react-router-dom'
import profilePhoto from '../assets/ea.webp'
import ArrowUpRightIcon from './icons/ArrowUpRightIcon'
import SectionHeading from './SectionHeading'
import SegmentedText from './SegmentedText'
import { ABOUT_STATEMENT, ABOUT_TEASER } from '../data/about'
import { SITE_NAME, SITE_ROLE } from '../lib/siteMeta'

export default function About() {
  return (
    <section id="hakkimda" className="scroll-mt-24 border-t border-line-subtle py-20 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
        <div>
          <SectionHeading title="Hakkımda" />

          {/* The reference drops a hairline from the heading into a small
              identity card. The line is drawn with a border on a fixed-height
              box rather than an <hr>: it is pure connective decoration, and an
              <hr> would announce a thematic break that is not there. */}
          <div aria-hidden="true" className="ml-8 hidden h-16 w-px bg-line-strong lg:block" />

          <div
            data-reveal
            className="mt-8 inline-flex flex-col items-center rounded-2xl border border-line-subtle bg-surface-raised px-8 py-7 text-center shadow-sm shadow-slate-950/5 lg:mt-0"
          >
            <img
              src={profilePhoto}
              alt=""
              width={640}
              height={853}
              loading="lazy"
              decoding="async"
              className="h-16 w-16 rounded-full object-cover ring-1 ring-line-subtle"
            />
            <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-ink-strong uppercase">
              {SITE_NAME}
            </p>
            {/* lang="en": an English job title inside a lang="tr" document,
                rendered through CSS uppercase. See english-labels.test.tsx. */}
            <p lang="en" className="mt-1 text-xs tracking-widest text-ink-muted uppercase">
              {SITE_ROLE}
            </p>
          </div>
        </div>

        <div className="lg:min-w-0">
          <p
            data-reveal
            className="text-3xl leading-tight font-normal tracking-tight text-ink-strong sm:text-4xl lg:text-5xl"
          >
            <SegmentedText segments={ABOUT_STATEMENT} />
          </p>

          <p
            data-reveal
            className="mt-10 max-w-2xl text-base leading-relaxed text-ink-body [--reveal-delay:120ms] sm:text-lg sm:leading-loose"
          >
            {ABOUT_TEASER.text}
          </p>

          <Link
            to="/hakkimda"
            data-reveal
            className="mt-10 inline-flex items-center gap-3 rounded border-b border-ink-strong pb-1 text-lg font-semibold text-ink-strong [--reveal-delay:240ms] transition-colors duration-200 hover:border-accent-hover hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:text-accent-active sm:text-xl"
          >
            Tam metni oku
            <ArrowUpRightIcon className="h-5 w-5 shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  )
}
