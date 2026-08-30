import { Link } from 'react-router-dom'
import GlowButton from './ui/GlowButton'
import ArrowUpRightIcon from './icons/ArrowUpRightIcon'
import DownloadIcon from './icons/DownloadIcon'
import HeroGallery from './HeroGallery'
import SegmentedText from './SegmentedText'
import { CV_FILE, HERO_DESCRIPTION, HERO_TITLE_LINES } from '../data/hero'

export default function Hero() {
  return (
    <section id="anasayfa" className="scroll-mt-24 pt-10 pb-16 sm:pt-14 lg:pt-16">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] xl:gap-20">
        <div className="lg:min-w-0">
          <h1
            data-reveal
            className="text-[clamp(2.5rem,6.2vw,5.5rem)] font-bold leading-[0.95] tracking-tight text-ink-strong"
          >
            {HERO_TITLE_LINES.map((line, index) => (
              <span
                key={line}
                className={
                  index === 0
                    ? 'block whitespace-nowrap'
                    : 'block whitespace-nowrap text-accent-base/70'
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
            <SegmentedText segments={HERO_DESCRIPTION} />
          </p>

          <div
            data-reveal
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 [--reveal-delay:240ms]"
          >
            <GlowButton to={{ pathname: '/', hash: '#iletisim' }}>
              İletişime geç
              <ArrowUpRightIcon className="h-4 w-4 shrink-0" />
            </GlowButton>
            <Link
              to={{ pathname: '/', hash: '#projeler' }}
              className="inline-flex items-center gap-3 rounded-full px-4 py-4 text-sm font-semibold tracking-widest text-ink-body uppercase underline-offset-4 transition-colors duration-200 hover:text-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:text-accent-active"
            >
              Projeleri keşfet
            </Link>
            {/* A plain <a download> to a file in public/, not a router Link:
                the CV is a static asset, not a route, and `download` is what
                makes the browser save it instead of navigating the tab to a
                PDF viewer. src/data/hero.test.ts asserts the file is actually
                there, so this link cannot quietly become a 404. */}
            <GlowButton href={CV_FILE} download variant="outline">
              CV indir
              <DownloadIcon className="h-4 w-4 shrink-0" />
            </GlowButton>
          </div>
        </div>

        <div data-reveal className="[--reveal-delay:160ms]">
          <HeroGallery />
        </div>
      </div>
    </section>
  )
}
