import { ABOUT_PARAGRAPHS } from '../data/about'
import ProfileCard from './ProfileCard'


export default function Hero() {
  return (
    <section id="hakkimda" className="scroll-mt-20 py-16">
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[320px_1fr] lg:items-start lg:gap-16 xl:grid-cols-[384px_1fr] xl:gap-20">
        <div className="lg:sticky lg:top-24">
          <ProfileCard />
        </div>
        <div className="lg:min-w-0">
          <h1 className="text-4xl font-bold tracking-tight text-navy-100 sm:text-5xl">Hakkımda</h1>
          <div className="mt-4 h-1 w-12 rounded bg-accent-400" />
          <div className="mt-8 space-y-5">
            {ABOUT_PARAGRAPHS.map((paragraph) => (
              <p
                key={paragraph.id}
                data-about-paragraph
                className="text-base leading-relaxed text-navy-300 sm:text-lg sm:leading-loose lg:max-w-prose"
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
