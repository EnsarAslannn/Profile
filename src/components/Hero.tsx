import GlowButton from './ui/GlowButton'
import ArrowUpRightIcon from './icons/ArrowUpRightIcon'
import DownloadIcon from './icons/DownloadIcon'
import HeroGallery from './HeroGallery'
import SegmentedText from './SegmentedText'
import { CV_FILE, HERO_DESCRIPTION, HERO_TITLE_LINES } from '../data/hero'
import { CONTENT_CONTAINER } from '../lib/layout'
import { useLanguage } from '../i18n/LanguageContext'
import { UI } from '../i18n/ui'

export default function Hero() {
  const { language } = useLanguage()
  const ui = UI[language]

  return (
    // The one band with NO ground of its own. Every section below paints
    // itself cream, deep green or light neutral; the hero stays transparent so
    // PageBackdrop's wash - now a barely-there sage breath over the cream -
    // has something to show through. An opaque bg-surface-base here would
    // cover it exactly.
    <section id="anasayfa" className="scroll-mt-24 pt-10 pb-16 sm:pt-14 lg:pt-16">
      <div className={CONTENT_CONTAINER}>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] xl:gap-20">
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
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 [--reveal-delay:240ms]"
            >
              {/* Three identical buttons, at the owner's request. The middle
                  one was a bare underlined text link; all three now share the
                  one deep-green face. GlowButton has a single style, so
                  "identical" is structural here rather than three class
                  strings someone has to keep in step. */}
              <GlowButton to={{ pathname: '/', hash: '#iletisim' }}>
                {ui.heroContact}
                <ArrowUpRightIcon className="h-4 w-4 shrink-0" />
              </GlowButton>
              <GlowButton to={{ pathname: '/', hash: '#projeler' }}>
                {ui.heroProjects}
                <ArrowUpRightIcon className="h-4 w-4 shrink-0" />
              </GlowButton>
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
