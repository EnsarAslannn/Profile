import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../App'
import LanguageProvider from './LanguageProvider'
import LanguageToggle from '../components/LanguageToggle'
import { LANGUAGE_STORAGE_KEY } from './language'
import { UI } from './ui'
import { ABOUT_PARAGRAPHS } from '../data/about'
import { NAV_LINKS } from '../data/navigation'
import { PROJECTS } from '../data/projects'
import { RESUME_GROUPS, ROADMAP_ENTRIES } from '../data/resume'
import { CONTACT_ROWS } from '../data/contactRows'
import { HERO_DESCRIPTION, HERO_TITLE_LINES } from '../data/hero'

const renderApp = (entry = '/') =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <App />
    </MemoryRouter>,
  )

afterEach(() => {
  window.localStorage.clear()
  document.documentElement.lang = 'tr'
})

describe('the two languages', () => {
  // Both branches of every Localized record have to be filled in. TypeScript's
  // Record<Language, T> already refuses a missing key, but it cannot see an
  // English array that was left as a copy of the Turkish one - the commonest
  // way a half-finished translation ships.
  it('translates every piece of owner content, rather than copying the Turkish', () => {
    expect(ABOUT_PARAGRAPHS.en.map((p) => p.text)).not.toEqual(
      ABOUT_PARAGRAPHS.tr.map((p) => p.text),
    )
    expect(NAV_LINKS.en.map((l) => l.label)).not.toEqual(NAV_LINKS.tr.map((l) => l.label))
    expect(RESUME_GROUPS.en.map((g) => g.heading)).not.toEqual(
      RESUME_GROUPS.tr.map((g) => g.heading),
    )
    expect(HERO_DESCRIPTION.en).not.toEqual(HERO_DESCRIPTION.tr)
    for (const [index, project] of PROJECTS.en.entries()) {
      expect(project.subtitle, project.slug).not.toBe(PROJECTS.tr[index].subtitle)
      expect(project.description, project.slug).not.toEqual(PROJECTS.tr[index].description)
      for (const [i, screen] of project.screens.entries()) {
        expect(screen.caption, `${project.slug}/${screen.name}`).not.toBe(
          PROJECTS.tr[index].screens[i].caption,
        )
      }
    }
  })

  // The things that must NOT move. A translated anchor would break every link
  // already shared, a translated slug would break every project URL, and a
  // translated technology name would invent a product that does not exist.
  it('never translates an anchor, a slug, a URL or a technology name', () => {
    expect(NAV_LINKS.en.map((l) => l.anchor)).toEqual(NAV_LINKS.tr.map((l) => l.anchor))
    expect(PROJECTS.en.map((p) => p.slug)).toEqual(PROJECTS.tr.map((p) => p.slug))
    expect(PROJECTS.en.map((p) => p.liveUrl)).toEqual(PROJECTS.tr.map((p) => p.liveUrl))
    expect(PROJECTS.en.map((p) => p.title)).toEqual(PROJECTS.tr.map((p) => p.title))
    expect(PROJECTS.en.map((p) => p.technologies)).toEqual(PROJECTS.tr.map((p) => p.technologies))
    // Dates are facts and never move.
    expect(ROADMAP_ENTRIES.en.map((e) => [e.start, e.end])).toEqual(
      ROADMAP_ENTRIES.tr.map((e) => [e.start, e.end]),
    )
    // An employer with no English trading name keeps its registered one. The
    // university is the deliberate exception - it publishes in English as
    // Karabük University - and it is excluded here by id rather than by
    // guessing, so a future entry has to be a considered decision too.
    const NAMED_ONLY_IN_TURKISH = ['brisa-staj', 'azr-staj']
    for (const id of NAMED_ONLY_IN_TURKISH) {
      const en = ROADMAP_ENTRIES.en.find((e) => e.id === id)
      const tr = ROADMAP_ENTRIES.tr.find((e) => e.id === id)
      expect(en?.organization, id).toBe(tr?.organization)
    }
    // The handles are cut from the hrefs, so they cannot drift per language.
    expect(CONTACT_ROWS.en.map((r) => [r.value, r.href])).toEqual(
      CONTACT_ROWS.tr.map((r) => [r.value, r.href]),
    )
  })

  it('keeps the owner punctuation rule in the English copy too', () => {
    for (const project of PROJECTS.en) {
      for (const paragraph of project.description) {
        expect(paragraph, project.slug).not.toMatch(/[;:]/)
      }
      for (const screen of project.screens) {
        expect(screen.caption, `${project.slug}/${screen.name}`).not.toMatch(/[;:]/)
      }
    }
  })
})

describe('LanguageToggle', () => {
  it('opens in Turkish and says so', () => {
    render(
      <MemoryRouter>
        <LanguageProvider>
          <LanguageToggle />
        </LanguageProvider>
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: 'Türkçe' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'English' })).toHaveAttribute('aria-pressed', 'false')
  })

  // Both stay in the tab order. A disabled active button would drop out of it,
  // leaving a keyboard user with no way to hear which language they are in.
  it('keeps both controls reachable, marking the active one pressed', () => {
    render(
      <MemoryRouter>
        <LanguageProvider>
          <LanguageToggle />
        </LanguageProvider>
      </MemoryRouter>,
    )
    for (const button of screen.getAllByRole('button')) {
      expect(button).not.toBeDisabled()
    }
  })
})

describe('switching language', () => {
  it('changes the navbar, the hero and the section headings together', () => {
    renderApp()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      HERO_TITLE_LINES.tr.join(''),
    )
    expect(screen.getByRole('heading', { name: UI.tr.sectionProjects })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'English' }))

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      HERO_TITLE_LINES.en.join(''),
    )
    expect(screen.getByRole('heading', { name: UI.en.sectionProjects })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: UI.tr.sectionProjects })).not.toBeInTheDocument()
    // Contact is rendered outside <Routes>, so this is also the check that the
    // provider sits above the chrome and not merely above the page.
    expect(screen.getByRole('heading', { name: UI.en.sectionContact })).toBeInTheDocument()
  })

  // CSS text-transform is locale-aware and Turkish maps i -> İ. Every
  // uppercased label on the site depends on this attribute following the
  // language, and nothing else on the page can compensate for it.
  it('moves the document lang attribute, which the uppercase casing depends on', () => {
    renderApp()
    expect(document.documentElement.lang).toBe('tr')

    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    expect(document.documentElement.lang).toBe('en')

    fireEvent.click(screen.getByRole('button', { name: 'Türkçe' }))
    expect(document.documentElement.lang).toBe('tr')
  })

  it('remembers the choice for the next visit', () => {
    renderApp()
    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en')
  })

  // What makes an English page shareable at all. Without it the translation
  // would be invisible to anyone the owner sends a link to.
  it('opens in the language the URL asks for, whatever was remembered', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'tr')
    renderApp('/?lang=en')
    expect(screen.getByRole('heading', { name: UI.en.sectionProjects })).toBeInTheDocument()
  })

  it('falls back to the remembered choice when the URL says nothing', () => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en')
    renderApp('/')
    expect(screen.getByRole('heading', { name: UI.en.sectionProjects })).toBeInTheDocument()
  })

  it('defaults to Turkish when there is neither', () => {
    renderApp('/')
    expect(screen.getByRole('heading', { name: UI.tr.sectionProjects })).toBeInTheDocument()
  })
})
