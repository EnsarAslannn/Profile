import ProjectCard from './ProjectCard'
import { PROJECTS } from '../data/projects'

export default function Projects() {
  return (
    <section id="projeler" className="scroll-mt-8 border-t border-line-subtle py-16">
      <h2 data-reveal className="text-3xl font-bold text-ink-strong sm:text-4xl">
        Projeler
      </h2>
      <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:grid-rows-[1fr_1fr] md:aspect-[1600/1081] md:gap-8 lg:gap-10">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </ul>
    </section>
  )
}
