import profilePhoto from '../assets/ea.webp'
import About from '../components/About'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import Projects from '../components/Projects'
import Resume from '../components/Resume'
import RouteMeta from '../components/RouteMeta'
import Skills from '../components/Skills'
import { ABOUT_PARAGRAPHS } from '../data/about'
import { useLanguage } from '../i18n/LanguageContext'
import type { Localized } from '../i18n/language'
import { CONTENT_CONTAINER } from '../lib/layout'
import { DEFAULT_TITLE, truncateForDescription } from '../lib/siteMeta'
import { useReveal } from '../lib/useReveal'

// Derived from the owner's own Hakkımda copy rather than written separately,
// so the snippet can never drift from what the page actually says.
// Derived, never hand-written - one description per language, each trimmed
// from that language's own opening paragraph.
const HOME_DESCRIPTION: Localized<string> = {
  tr: truncateForDescription(ABOUT_PARAGRAPHS.tr[0].text),
  en: truncateForDescription(ABOUT_PARAGRAPHS.en[0].text),
}

export default function HomePage() {
  // One observer for the whole route: every [data-reveal] below is found by
  // this ref, so no section has to wire up an observer of its own.
  const revealRoot = useReveal<HTMLElement>()
  const { language } = useLanguage()

  return (
    <>
      <RouteMeta
        title={DEFAULT_TITLE}
        description={HOME_DESCRIPTION[language]}
        image={profilePhoto}
        type="website"
      />
      {/* Section order follows the reference design: hero, then the five
          numbered sections. The Marquee strips are the reference's scrolling
          dividers - decoration between sections, never inside one, so a
          section's own boundaries stay exactly where the section contract in
          CLAUDE.md puts them. They sit outside <main>'s padded column
          deliberately: the strip is full-bleed in the reference, and a
          padded one would look like a boxed-in banner. */}
      <main ref={revealRoot} id="main">
        <div className={CONTENT_CONTAINER}>
          <Hero />
          <About />
        </div>

        <Marquee />

        <div className={CONTENT_CONTAINER}>
          <Projects />
          <Resume />
        </div>

        {/* The strip runs the Yetenekler technologies, so putting it directly
            above that section reads as a lead-in rather than as filler. */}
        <Marquee />

        <div className={CONTENT_CONTAINER}>
          <Skills />
        </div>
      </main>
    </>
  )
}
