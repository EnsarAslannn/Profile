import RoadmapCard from './RoadmapCard'
import SectionHeading from './SectionHeading'
import { ROADMAP_ENTRIES } from '../data/resume'
import { useLanguage } from '../i18n/LanguageContext'
import { UI } from '../i18n/ui'
import { CONTENT_CONTAINER } from '../lib/layout'

// The reference design's ROADMAP: one chronological spine with cards
// alternating either side of it. The two Özgeçmiş groups are flattened and
// re-sorted by date in src/data/resume.ts - a roadmap is a timeline, so
// Eğitim and Deneyim interleave here instead of standing as two columns, and
// each card keeps its group name as a chip so nothing is lost.
export default function Resume() {
  const { language } = useLanguage()
  const ui = UI[language]

  return (
    // The second deep-green band, and the reason the rhythm alternates twice
    // rather than once: a single dark section reads as an exception, two read
    // as a system. See About.tsx for what data-tone actually does.
    <section id="ozgecmis" data-tone="dark" className="scroll-mt-24 py-20 sm:py-24">
      <div className={CONTENT_CONTAINER}>
        <SectionHeading
          title={ui.sectionResume}
          subtitle={ui.resumeSubtitle}
          align="center"
        />

        {/* The spine. `absolute` inside a `relative` list, so it spans exactly
            the cards' height without a magic number: left edge on mobile, dead
            centre from md: up, matching where the dots sit. */}
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
