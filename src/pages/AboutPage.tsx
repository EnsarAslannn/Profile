import { Link } from 'react-router-dom'
import profilePhoto from '../assets/ea.webp'
import ArrowLeftIcon from '../components/icons/ArrowLeftIcon'
import ProfileCard from '../components/ProfileCard'
import RouteMeta from '../components/RouteMeta'
import { ABOUT_PARAGRAPHS } from '../data/about'
import { CONTENT_CONTAINER } from '../lib/layout'
import { SITE_NAME, truncateForDescription } from '../lib/siteMeta'
import { useReveal } from '../lib/useReveal'

// Where the Hakkımda section's "Tam metni oku" lands: the full four-paragraph
// copy beside the profile card, the layout the home page carried before the
// example.mp4 redesign moved the landing screen to a hero. Nothing new is
// written here - it renders ABOUT_PARAGRAPHS whole, which is exactly what
// "full version" means.
const PAGE_DESCRIPTION = truncateForDescription(ABOUT_PARAGRAPHS[0].text)

export default function AboutPage() {
  const revealRoot = useReveal<HTMLElement>()

  return (
    <>
      <RouteMeta
        title={`Hakkımda | ${SITE_NAME}`}
        description={PAGE_DESCRIPTION}
        image={profilePhoto}
        type="website"
      />
      <main ref={revealRoot} id="main" className={CONTENT_CONTAINER}>
        <div className="py-16">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 rounded px-3 py-3 text-sm font-medium text-accent-base transition-colors duration-200 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:text-accent-active"
          >
            <ArrowLeftIcon className="h-4 w-4 shrink-0" />
            Geri
          </Link>

          {/* The same two-track grid the old home hero used: a fixed card
              column and a prose column that absorbs all the slack. `min-w-0`
              on the prose track is load-bearing - without it the long
              paragraphs would refuse to shrink and blow the grid out. */}
          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[288px_minmax(0,1fr)] lg:items-start lg:gap-12 xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-16">
            <div className="lg:sticky lg:top-28 lg:col-start-1">
              <ProfileCard />
            </div>
            <div className="lg:col-start-2 lg:min-w-0">
              <h1
                data-reveal
                className="text-4xl font-bold tracking-tight text-ink-strong sm:text-5xl"
              >
                Hakkımda
              </h1>
              <div className="mt-10 space-y-5">
                {ABOUT_PARAGRAPHS.map((paragraph) => (
                  <p
                    key={paragraph.id}
                    data-about-paragraph
                    data-reveal
                    className="text-base leading-relaxed text-ink-body sm:text-lg sm:leading-loose xl:text-xl"
                  >
                    {paragraph.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
