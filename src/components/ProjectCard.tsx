import { Link } from 'react-router-dom'
import ArrowUpRightIcon from './icons/ArrowUpRightIcon'
import type { Project } from '../data/projects'

type Props = {
  project: Project
  featured: boolean
}

export default function ProjectCard({ project, featured }: Props) {
  const cover = project.cover

  return (
    <li className={featured ? 'h-full md:col-start-1 md:row-start-1 md:row-span-2' : 'h-full md:col-start-2'}>
      <Link
        to={`/projects/${project.slug}`}
        aria-label={`${project.title} - ${project.subtitle}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line-subtle bg-surface-sunken shadow-sm shadow-slate-950/5 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-line-strong hover:shadow-md hover:shadow-slate-950/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        {cover && (
          <img
            src={cover.src}
            alt=""
            width={cover.width}
            height={cover.height}
            loading="lazy"
            decoding="async"
            className="w-full h-auto transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 md:h-full md:object-cover md:object-center"
          />
        )}
        {/*
          The [@media(hover:hover)]: bracket is intentional, not a bare
          `hover:`. Tailwind v4 gates `hover:` behind @media (hover: hover),
          so on a touch device none of the hover/focus classes below ever
          apply - opacity-100 is the ONLY rule in effect, and the bar stays
          visible. A bare hover-prefixed opacity rule with no such gate would leave the
          project name permanently invisible on every touch device.
        */}
        <div
          data-card-bar
          className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-xl bg-accent-base px-5 py-3.5 opacity-100 shadow-sm shadow-slate-950/20 transition-[opacity,transform] duration-200 sm:inset-x-5 sm:bottom-5 sm:gap-4 sm:px-6 sm:py-4 [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:translate-y-0 [@media(hover:hover)]:group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none"
        >
          <h3 className="min-w-0 truncate text-base font-semibold tracking-tight text-white sm:text-lg">
            {project.title}
          </h3>
          <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-white sm:h-5 sm:w-5" />
        </div>
      </Link>
    </li>
  )
}
