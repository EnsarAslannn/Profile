import ProjectCard from './ProjectCard'
import SectionHeading from './SectionHeading'
import { PROJECTS } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'
import { UI } from '../i18n/ui'
import { CONTENT_CONTAINER } from '../lib/layout'

export default function Projects() {
  const { language } = useLanguage()

  return (
    // Back to warm cream after the deep-green Hakkimda band. bg-surface-base
    // is written explicitly rather than left to inherit the page ground: the
    // section has to be opaque, or the neutral Marquee strip above it would
    // read straight through where the two meet.
    <section id="projeler" className="scroll-mt-24 bg-surface-base py-20 sm:py-24">
      <div className={CONTENT_CONTAINER}>
        <SectionHeading title={UI[language].sectionProjects} />
        <ul className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-2 md:grid-rows-[1fr_1fr] md:aspect-[1600/1081] md:gap-8 lg:gap-10">
          {PROJECTS[language].map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </ul>
      </div>
    </section>
  )
}
