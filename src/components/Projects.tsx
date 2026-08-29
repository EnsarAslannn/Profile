import ProjectCard from './ProjectCard'
import SectionHeading from './SectionHeading'
import { PROJECTS } from '../data/projects'

export default function Projects() {
  return (
    <section id="projeler" className="scroll-mt-24 border-t border-line-subtle py-20 sm:py-24">
      <SectionHeading title="Projeler" />
      <ul className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-2 md:grid-rows-[1fr_1fr] md:aspect-[1600/1081] md:gap-8 lg:gap-10">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </ul>
    </section>
  )
}
