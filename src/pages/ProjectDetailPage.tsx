import { Link, Navigate, useParams } from 'react-router-dom'
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon'
import GlowButton from '../components/ui/GlowButton'
import ArrowUpRightIcon from '../components/icons/ArrowUpRightIcon'
import ProjectScreens from '../components/ProjectScreens'
import ProjectTechnologies from '../components/ProjectTechnologies'
import RouteMeta from '../components/RouteMeta'
import { getProjectBySlug } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'
import { UI } from '../i18n/ui'
import { CONTENT_CONTAINER } from '../lib/layout'
import { SITE_NAME, firstSentence, truncateForDescription } from '../lib/siteMeta'
import { useReveal } from '../lib/useReveal'

export default function ProjectDetailPage() {
  const revealRoot = useReveal<HTMLElement>()
  const { slug } = useParams<{ slug: string }>()
  const { language } = useLanguage()
  const ui = UI[language]
  const project = getProjectBySlug(slug, language)

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
      ref={revealRoot}
      id="main"
      className={`py-16 ${CONTENT_CONTAINER}`}
    >
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 rounded px-3 py-3 text-sm font-medium text-accent-base transition-colors duration-200 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:text-accent-active sm:mb-8"
        >
          <ArrowLeftIcon className="h-4 w-4 shrink-0" />
          {ui.back}
        </Link>

        {cover && (
          <figure data-reveal className="mb-8 overflow-hidden rounded-2xl border border-line-subtle bg-surface-sunken sm:mb-10">
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

        <div data-reveal className="[--reveal-delay:80ms]">
          <h1 className="text-4xl font-bold tracking-tight text-ink-strong sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-3 text-lg font-medium text-accent-base sm:text-xl">{project.subtitle}</p>
        </div>

        {project.liveUrl && (
          <div className="mt-6">
            <GlowButton href={project.liveUrl} external>
              {ui.openProject}
              <ArrowUpRightIcon className="h-4 w-4 shrink-0" />
            </GlowButton>
          </div>
        )}

        <ProjectTechnologies groups={project.technologies} />

        <div data-reveal className="mt-6 space-y-5">
          {project.description.map((paragraph) => (
            <p
              key={paragraph}
              className="text-base leading-relaxed text-ink-body sm:text-lg sm:leading-loose"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* The "Ekranlar" heading above this list was removed at the owner's
            request. ProjectScreens carries a localized aria-label in its
            place, so the walkthrough is still announced as a named list -
            dropping the heading must not mean dropping the name. It also
            means this route now contributes no h2 of its own, which is why
            ProjectDetailPage.test.tsx asserts İletişim is the only one left. */}
        <div className="mt-12 sm:mt-16">
          <ProjectScreens screens={project.screens} projectTitle={project.title} />
        </div>

        <Link
          to={{ pathname: '/', hash: '#projeler' }}
          className="mt-12 inline-flex items-center gap-2 rounded px-3 py-3 text-sm font-medium text-accent-base transition-colors hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          <ArrowLeftIcon className="h-4 w-4 shrink-0" />
          {ui.backToProjects}
        </Link>
      </div>
    </main>
    </>
  )
}
