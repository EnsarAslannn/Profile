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

const HOME_DESCRIPTION: Localized<string> = {
  tr: truncateForDescription(ABOUT_PARAGRAPHS.tr[0].text),
  en: truncateForDescription(ABOUT_PARAGRAPHS.en[0].text),
}

export default function HomePage() {
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
      <main ref={revealRoot} id="main" tabIndex={-1} className="focus:outline-none">
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
