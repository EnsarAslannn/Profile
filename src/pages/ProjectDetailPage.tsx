import { Link, Navigate, useParams } from 'react-router-dom'
import ProjectGallery from '../components/ProjectGallery'
import RouteMeta from '../components/RouteMeta'
import { getProjectBySlug } from '../data/projects'
import { SITE_NAME, firstSentence, truncateForDescription } from '../lib/siteMeta'

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = getProjectBySlug(slug)

  if (!project) {
    return <Navigate to="/" replace />
  }

  const cover = project.images[0]

  return (
    <>
      <RouteMeta
        title={`${project.title} | ${SITE_NAME}`}
        description={truncateForDescription(firstSentence(project.description))}
        image={cover ? cover.src : ''}
        type="article"
      />
    <main className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10 xl:px-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-navy-100 sm:text-5xl">{project.title}</h1>
        <p className="mt-3 text-lg font-medium text-accent-400 sm:text-xl">{project.subtitle}</p>
        <div className="mt-4 h-1 w-12 rounded bg-accent-400" />

        <ProjectGallery images={project.images} projectTitle={project.title} />

        <p className="mt-10 text-base leading-relaxed text-navy-300 sm:text-lg sm:leading-loose">
          {project.description}
        </p>

        <Link
          to={{ pathname: '/', hash: '#projeler' }}
          className="mt-12 inline-flex items-center gap-2 rounded px-3 py-3 text-sm font-medium text-accent-400 transition-colors hover:text-accent-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
        >
          <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Projelere dön
        </Link>
      </div>
    </main>
    </>
  )
}
