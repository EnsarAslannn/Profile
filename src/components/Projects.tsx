import ProjectCard from './ProjectCard'
import SectionHeading from './SectionHeading'
import { PROJECTS } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'
import { UI } from '../i18n/ui'

export default function Projects() {
  const { language } = useLanguage()

  return (
    <section id="projeler" className="scroll-mt-24 border-t border-line-subtle py-20 sm:py-24">
      <SectionHeading title={UI[language].sectionProjects} />
      <ul className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-2 md:grid-rows-[1fr_1fr] md:aspect-[1600/1081] md:gap-8 lg:gap-10">
        {PROJECTS[language].map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </ul>
    </section>
  )
}
