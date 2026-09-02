import RoadmapCard from './RoadmapCard'
import SectionHeading from './SectionHeading'
import { ROADMAP_ENTRIES } from '../data/resume'
import { useLanguage } from '../i18n/LanguageContext'
import { UI } from '../i18n/ui'
import { CONTENT_CONTAINER } from '../lib/layout'

export default function Resume() {
  const { language } = useLanguage()
  const ui = UI[language]

  return (
    <section id="ozgecmis" data-tone="dark" className="scroll-mt-24 py-20 sm:py-24">
      <div className={CONTENT_CONTAINER}>
        <SectionHeading
          title={ui.sectionResume}
          subtitle={ui.resumeSubtitle}
          align="center"
        />

        <div className="relative mt-16 sm:mt-20">
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-[7px] w-px bg-line-subtle md:left-1/2 md:-translate-x-1/2"
          />
          <ol className="relative space-y-12 sm:space-y-16">
            {ROADMAP_ENTRIES[language].map((entry, index) => (
              <RoadmapCard key={entry.id} entry={entry} index={index} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
