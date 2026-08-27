import profilePhoto from '../assets/ea.webp'
import Hero from '../components/Hero'
import Projects from '../components/Projects'
import Resume from '../components/Resume'
import RouteMeta from '../components/RouteMeta'
import { ABOUT_PARAGRAPHS } from '../data/about'
import { DEFAULT_TITLE, truncateForDescription } from '../lib/siteMeta'

// Derived from the owner's own Hakkımda copy rather than written separately,
// so the snippet can never drift from what the page actually says.
const HOME_DESCRIPTION = truncateForDescription(ABOUT_PARAGRAPHS[0].text)

export default function HomePage() {
  return (
    <>
      <RouteMeta
        title={DEFAULT_TITLE}
        description={HOME_DESCRIPTION}
        image={profilePhoto}
        type="website"
      />
      <main className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 xl:px-12">
        <Hero />
        <Projects />
        <Resume />
      </main>
    </>
  )
}
