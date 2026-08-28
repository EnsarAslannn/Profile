import { Link, Navigate, useParams } from 'react-router-dom'
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon'
import ArrowUpRightIcon from '../components/icons/ArrowUpRightIcon'
import ProjectScreens from '../components/ProjectScreens'
import ProjectTechnologies from '../components/ProjectTechnologies'
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
        description={truncateForDescription(firstSentence(project.description[0]))}
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

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent-base px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:bg-accent-active"
          >
            Canlı demoyu aç
            <ArrowUpRightIcon className="h-4 w-4 shrink-0" />
          </a>
        )}

        <ProjectTechnologies groups={project.technologies} />

        <div className="mt-6 space-y-5">
          {project.description.map((paragraph) => (
            <p
              key={paragraph}
              className="text-base leading-relaxed text-ink-body sm:text-lg sm:leading-loose"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <h2 className="mt-12 text-3xl font-bold text-ink-strong sm:mt-16 sm:text-4xl">Ekranlar</h2>

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
