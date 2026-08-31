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
          numbered sections. Each section is now a full-bleed BAND that paints
          its own ground - cream, deep green or light neutral - and carries the
          shared content column INSIDE itself. That is why <main> no longer
          wraps groups of sections in padded divs: a padded wrapper cannot
          produce an edge-to-edge colour, and grouping Hero with About in one
          box would have forced the two to share a ground.

          The rhythm, top to bottom, is deliberate and alternating:
          cream (hero) -> deep green (Hakkimda) -> neutral strip -> cream
          (Projeler) -> deep green (Ozgecmis) -> neutral strip -> neutral
          (Stacks) -> cream (Iletisim, rendered by App.tsx).

          The Marquee strips are the reference's scrolling dividers and are
          both the recessed neutral, so a strip reads as the seam between two
          bands. The second one shares its ground with Stacks on purpose - the
          strip runs the Stacks technologies, so the two are one band and the
          strip leads into the section it is drawn from. */}
      <main ref={revealRoot} id="main">
        <Hero />
        <About />

        <Marquee />

        <Projects />
        <Resume />

        <Marquee />

        <Skills />
      </main>
    </>
  )
}
