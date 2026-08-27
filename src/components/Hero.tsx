import { ABOUT_PARAGRAPHS } from '../data/about'
import ProfileCard from './ProfileCard'


export default function Hero() {
  return (
    <section id="hakkimda" className="scroll-mt-8 py-16">
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[256px_1fr_68ch] lg:items-start lg:gap-0 xl:grid-cols-[288px_1fr_75ch]">
        <div className="lg:sticky lg:top-24 lg:col-start-1">
          <ProfileCard />
        </div>
        <div className="lg:col-start-3 lg:min-w-0">
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
