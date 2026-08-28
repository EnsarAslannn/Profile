import profilePhoto from '../assets/ea.webp'
import Hero from '../components/Hero'
import Projects from '../components/Projects'
import Resume from '../components/Resume'
import RouteMeta from '../components/RouteMeta'
import Skills from '../components/Skills'
import { ABOUT_PARAGRAPHS } from '../data/about'
import { DEFAULT_TITLE, truncateForDescription } from '../lib/siteMeta'
import { useReveal } from '../lib/useReveal'

// Derived from the owner's own Hakkımda copy rather than written separately,
// so the snippet can never drift from what the page actually says.
const HOME_DESCRIPTION = truncateForDescription(ABOUT_PARAGRAPHS[0].text)

export default function HomePage() {
  // One observer for the whole route: every [data-reveal] below is found by
  // this ref, so no section has to wire up an observer of its own.
  const revealRoot = useReveal<HTMLElement>()

  return (
    <>
      <RouteMeta
        title={DEFAULT_TITLE}
        description={HOME_DESCRIPTION}
        image={profilePhoto}
        type="website"
      />
      <main
        ref={revealRoot}
        id="main"
        className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 xl:px-12"
      >
        <Hero />
        <Projects />
        <Resume />
        <Skills />
      </main>
    </>
  )
}
