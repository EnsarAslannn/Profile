import { Link } from 'react-router-dom'
import GlowButton from './ui/GlowButton'
import ArrowUpRightIcon from './icons/ArrowUpRightIcon'
import DownloadIcon from './icons/DownloadIcon'
import HeroGallery from './HeroGallery'
import SegmentedText from './SegmentedText'
import { CV_FILE, HERO_DESCRIPTION, HERO_TITLE_LINES } from '../data/hero'
import { CONTENT_CONTAINER } from '../lib/layout'
import { useLanguage } from '../i18n/LanguageContext'
import { useLocalizedTo } from '../i18n/useLocalizedTo'
import { UI } from '../i18n/ui'

export default function Hero() {
  const { language } = useLanguage()
  const localizedTo = useLocalizedTo()
  const ui = UI[language]

  return (
    // The one band with NO ground of its own. Every section below paints
    // itself cream, deep green or light neutral; the hero stays transparent so
    // PageBackdrop's wash - now a barely-there sage breath over the cream -
    // has something to show through. An opaque bg-surface-base here would
    // cover it exactly.
    <section id="anasayfa" className="scroll-mt-24 pt-10 pb-16 sm:pt-14 lg:pt-16">
      <div className={CONTENT_CONTAINER}>
        {/* The xl track used to be WIDER than the lg one (30rem sidebar plus a
            5rem gutter against 26rem plus 3.5rem), which meant the content
            column got NARROWER as the viewport grew - 624px at xl against
            728px at lg, since max-w-7xl caps both at 1280px. That squeeze is
            what pushed the hero's third button onto a second row. Measured, in
            a browser, at 1280-2560px. */}
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] xl:gap-16">
          <div className="lg:min-w-0">
            <h1
              data-reveal
              className="text-[clamp(2.5rem,6.2vw,5.5rem)] font-bold leading-[0.95] tracking-tight text-ink-strong"
            >
              {HERO_TITLE_LINES[language].map((line, index) => (
                <span
                  key={line}
                  className={
                    index === 0
                      ? 'block whitespace-nowrap'
                      : 'block whitespace-nowrap text-ink-heading'
                  }
                >
                  {line}
                </span>
              ))}
            </h1>

            <p
              data-reveal
              className="mt-8 max-w-xl text-base leading-relaxed text-ink-body [--reveal-delay:120ms] sm:text-lg sm:leading-loose"
            >
              <SegmentedText segments={HERO_DESCRIPTION[language]} />
            </p>

            <div
              data-reveal
              // flex-wrap stays as the graceful fallback for narrow viewports
              // and for machines whose default sans is wider than the one this
              // was measured on: the failure mode is a second row, never a
              // horizontal overflow.
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 [--reveal-delay:240ms]"
            >
              <GlowButton to={localizedTo({ pathname: '/', hash: '#iletisim' })}>
                {ui.heroContact}
                <ArrowUpRightIcon className="h-4 w-4 shrink-0" />
              </GlowButton>
              {/* The quiet one of the three, back to a bare underlined link at
                  the owner's request after a round as a filled button. Two
                  pill CTAs and one text link is also what keeps the row on a
                  single line - as a button this was 56px wider, which is what
                  pushed "CV indir" onto a second row in the first place. */}
              <Link
                to={localizedTo({ pathname: '/', hash: '#projeler' })}
                className="inline-flex items-center gap-3 rounded-full px-4 py-4 text-sm font-semibold tracking-widest whitespace-nowrap text-ink-body uppercase underline-offset-4 xl:px-3 transition-colors duration-200 hover:text-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:text-accent-active"
              >
                {ui.heroProjects}
              </Link>
              {/* A plain <a download> to a file in public/, not a router Link:
                  the CV is a static asset, not a route, and `download` is what
                  makes the browser save it instead of navigating the tab to a
                  PDF viewer. src/data/hero.test.ts asserts the file is actually
                  there, so this link cannot quietly become a 404. */}
              <GlowButton href={CV_FILE[language]} download>
                {ui.heroCv}
                <DownloadIcon className="h-4 w-4 shrink-0" />
              </GlowButton>
            </div>
          </div>

          <div data-reveal className="[--reveal-delay:160ms]">
            <HeroGallery />
          </div>
        </div>
      </div>
    </section>
  )
}
