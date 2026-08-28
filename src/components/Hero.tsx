import { ABOUT_PARAGRAPHS } from '../data/about'
import ProfileCard from './ProfileCard'


export default function Hero() {
  return (
    <section id="hakkimda" className="scroll-mt-8 py-16">
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[288px_minmax(0,1fr)] lg:items-start lg:gap-12 xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-16">
        <div className="lg:sticky lg:top-24 lg:col-start-1">
          <ProfileCard />
        </div>
        {/* data-reveal sits on the prose column, and on ProfileCard's own root
            rather than on the sticky wrapper above - a transform on the
            sticky element would fight its offset while the reveal runs, and
            CLAUDE.md bans transforms on anything above it. */}
        <div data-reveal className="[--reveal-delay:120ms] lg:col-start-2 lg:min-w-0">
          <h1 className="text-4xl font-bold tracking-tight text-ink-strong sm:text-5xl">Hakkımda</h1>
          <div className="mt-10 space-y-5">
            {ABOUT_PARAGRAPHS.map((paragraph) => (
              <p
                key={paragraph.id}
                data-about-paragraph
                className="text-base leading-relaxed text-ink-body sm:text-lg sm:leading-loose xl:text-xl"
              >
                {paragraph.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
