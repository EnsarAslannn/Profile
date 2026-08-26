import ProjectCard from './ProjectCard'
import { PROJECTS } from '../data/projects'

export default function Projects() {
  return (
    <section id="projeler" className="scroll-mt-20 border-t border-navy-700 py-16">
      <h2 className="text-3xl font-bold text-navy-100">Projeler</h2>
      <div className="mt-4 h-1 w-12 rounded bg-accent-400" />
      <ul className="mt-8 grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:gap-12">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </ul>
    </section>
  )
}
