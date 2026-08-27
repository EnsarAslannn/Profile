import ProjectCard from './ProjectCard'
import { PROJECTS } from '../data/projects'

export default function Projects() {
  return (
    <section id="projeler" className="scroll-mt-20 border-t border-line-subtle py-16">
      <h2 className="text-3xl font-bold text-ink-strong">Projeler</h2>
      <div className="mt-4 h-1 w-12 rounded bg-accent-base" />
      <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.slug} project={project} featured={index === 0} />
        ))}
      </ul>
    </section>
  )
}
