import { Link, Navigate, useParams } from 'react-router-dom'
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon'
import ProjectScreens from '../components/ProjectScreens'
import RouteMeta from '../components/RouteMeta'
import { getProjectBySlug } from '../data/projects'
import { SITE_NAME, firstSentence, truncateForDescription } from '../lib/siteMeta'

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = getProjectBySlug(slug)

  if (!project) {
    return <Navigate to="/" replace />
  }

  const cover = project.cover
  const ogImage = cover?.src ?? project.screens[0]?.src ?? ''

  return (
    <>
      <RouteMeta
        title={`${project.title} | ${SITE_NAME}`}
        description={truncateForDescription(firstSentence(project.description))}
        image={ogImage}
        type="article"
      />
    <main
      id="main"
      className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10 xl:px-12"
    >
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 rounded px-3 py-3 text-sm font-medium text-accent-base transition-colors duration-200 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:text-accent-active sm:mb-8"
        >
          <ArrowLeftIcon className="h-4 w-4 shrink-0" />
          Geri
        </Link>

        {cover && (
          <figure className="mb-8 overflow-hidden rounded-2xl border border-line-subtle bg-surface-sunken sm:mb-10">
            <img
              src={cover.src}
              alt=""
              width={cover.width}
              height={cover.height}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto"
            />
          </figure>
        )}

        <h1 className="text-4xl font-bold tracking-tight text-ink-strong sm:text-5xl">{project.title}</h1>
        <p className="mt-3 text-lg font-medium text-accent-base sm:text-xl">{project.subtitle}</p>

        <ul
          aria-label="Kullanılan teknolojiler"
          className="mt-10 flex flex-wrap items-center gap-y-2 text-sm font-medium text-ink-body sm:text-base"
        >
          {project.technologies.map((tech, index) => (
            <li key={tech}>
              {tech}
              {index < project.technologies.length - 1 && (
                <span aria-hidden="true" className="mx-2 text-ink-body">
                  ·
                </span>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-6 text-base leading-relaxed text-ink-body sm:text-lg sm:leading-loose">
          {project.description}
        </p>

        <h2 className="mt-12 text-3xl font-bold text-ink-strong sm:mt-16">Ekranlar</h2>

        <ProjectScreens screens={project.screens} projectTitle={project.title} />

        <Link
          to={{ pathname: '/', hash: '#projeler' }}
          className="mt-12 inline-flex items-center gap-2 rounded px-3 py-3 text-sm font-medium text-accent-base transition-colors hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <ArrowLeftIcon className="h-4 w-4 shrink-0" />
          Projelere dön
        </Link>
      </div>
    </main>
    </>
  )
}
