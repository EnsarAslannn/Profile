import { Link } from 'react-router-dom'
import { PROJECT_IMAGE_HEIGHT, PROJECT_IMAGE_WIDTH, getProjectImageAlt } from '../data/projectImages'
import type { Project } from '../data/projects'

type Props = {
  project: Project
}

export default function ProjectCard({ project }: Props) {
  const cover = project.images[0]

  return (
    <li className="h-full">
      <Link
        to={`/projects/${project.slug}`}
        aria-label={`${project.title} - ${project.subtitle}`}
        className="group flex h-full flex-col gap-5 rounded-2xl bg-navy-900 p-5 shadow-lg shadow-black/20 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-6"
      >
        {cover && (
          <div className="overflow-hidden rounded-xl bg-navy-950">
            <img
              src={cover.src}
              alt={getProjectImageAlt(project.title, 0)}
              width={PROJECT_IMAGE_WIDTH}
              height={PROJECT_IMAGE_HEIGHT}
              loading="lazy"
              decoding="async"
              className="aspect-project-cover w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-2">
          <h3 className="text-xl font-semibold tracking-tight text-navy-100 sm:text-2xl">{project.title}</h3>
          <p className="text-sm font-medium text-accent-400 sm:text-base">{project.subtitle}</p>
          <p className="line-clamp-3 text-sm leading-relaxed text-navy-400 sm:text-base">{project.description}</p>
        </div>
      </Link>
    </li>
  )
}
