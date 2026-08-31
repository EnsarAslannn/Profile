import { Link } from 'react-router-dom'
import ArrowUpRightIcon from './icons/ArrowUpRightIcon'
import type { Project } from '../data/projects'
import { revealDelayClass } from '../lib/useReveal'

type Props = {
  project: Project
  // Position in the mosaic, not just a key: index 0 takes the tall featured
  // cell, and the same number drives the reveal stagger so the cards arrive
  // in the order they are read.
  index: number
}

export default function ProjectCard({ project, index }: Props) {
  const cover = project.cover
  const placement =
    index === 0 ? 'md:col-start-1 md:row-start-1 md:row-span-2' : 'md:col-start-2'

  return (
    <li data-reveal className={`h-full ${placement} ${revealDelayClass(index)}`}>
      <Link
        to={`/projects/${project.slug}`}
        aria-label={`${project.title} - ${project.subtitle}`}
        // Soft white on the cream band, separated by its hairline rather than
        // by a tonal jump. The hover is the owner's four small moves and
        // nothing more: a 1px lift, a 5% image zoom, the border warming to
        // sage, and a shadow that stays at 8%. The card never changes colour.
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line-subtle bg-surface-raised shadow-sm shadow-black/5 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-accent-soft hover:shadow-md hover:shadow-black/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none motion-reduce:hover:translate-y-0"
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
          className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-xl bg-accent-soft px-5 py-3.5 opacity-100 shadow-sm shadow-black/15 transition-[opacity,transform] duration-200 sm:inset-x-5 sm:bottom-5 sm:gap-4 sm:px-6 sm:py-4 [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:translate-y-0 [@media(hover:hover)]:group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none"
        >
          {/* accent-ink on an accent-soft fill, 4.91:1 - the pairing the token
              names describe. White on a muted sage would have measured 2.2:1. */}
          <h3 className="min-w-0 truncate text-base font-semibold tracking-tight text-accent-ink sm:text-lg">
            {project.title}
          </h3>
          <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-accent-ink sm:h-5 sm:w-5" />
        </div>
      </Link>
    </li>
  )
}
