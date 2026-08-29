import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Skills from './Skills'
import { SKILL_GROUPS } from '../data/skills'
import { ABOUT_PARAGRAPHS } from '../data/about'
import { PROJECTS } from '../data/projects'

describe('Skills', () => {
  it('carries the section anchor the footer links to', () => {
    const { container } = render(<Skills />)
    expect(container.querySelector('section#yetenekler')).not.toBeNull()
  })

  it('renders Stacks as an h2 and each group as an h3 below it', () => {
    render(<Skills />)
    expect(screen.getByRole('heading', { level: 2, name: 'Stacks' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(
      SKILL_GROUPS.map((group) => group.heading),
    )
  })

  it('renders every skill in every group', () => {
    render(<Skills />)
    for (const group of SKILL_GROUPS) {
      for (const item of group.items) {
        expect(screen.getByText(item)).toBeInTheDocument()
      }
    }
  })

  // The intro sentence was removed at the owner's request; the heading now
  // leads straight into the grid. Asserting the absence keeps a later edit
  // from quietly reintroducing a paragraph nobody asked for.
  it('renders no intro paragraph and no section index', () => {
    const { container } = render(<Skills />)
    expect(container.querySelectorAll('p')).toHaveLength(0)
    expect(container.textContent).not.toMatch(/\[\d{3}]/)
  })

  // Owner's request: the technologies sit to the RIGHT of their group label,
  // not underneath it. A <dl> is what that pairing means, and the grid is
  // what puts the two side by side from sm: up.
  it('pairs each group label with its technologies side by side', () => {
    const { container } = render(<Skills />)
    const rows = Array.from(container.querySelectorAll('dl > div'))
    expect(rows).toHaveLength(SKILL_GROUPS.length)
    for (const row of rows) {
      expect(row.className).toMatch(/\bgrid\b/)
      expect(row.className).toMatch(/sm:grid-cols-\[/)
      expect(row.querySelector('dt')).not.toBeNull()
      expect(row.querySelector('dd')).not.toBeNull()
    }
  })

  // Owner's request: the group labels are English even though the rest of
  // the site's copy is Turkish. Pinned so a well-meaning 'fix the language'
  // pass has to be a deliberate decision, not a silent one.
  it('labels the groups in English', () => {
    render(<Skills />)
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Languages & Frameworks',
      'Architecture & Patterns',
      'Data & Caching',
      'Messaging & Background Jobs',
      'Frontend',
      'Testing & DevOps',
    ])
  })

  // Not cosmetic: the document is lang='tr' and CSS text-transform casing
  // is locale-aware, so an untagged 'Architecture' uppercases to
  // 'ARCHITECTURE' with a Turkish dotted capital I.
  it('tags the English labels with lang=en so uppercasing stays English', () => {
    render(<Skills />)
    for (const heading of screen.getAllByRole('heading', { level: 3 })) {
      expect(heading).toHaveAttribute('lang', 'en')
    }
  })

  // The point of the section is that it claims only what the rest of the site
  // already backs up. A percentage or star rating would be a number nobody
  // supplied - see the no-fabrication note in src/data/skills.ts.
  it('claims no proficiency level anywhere', () => {
    const { container } = render(<Skills />)
    const text = container.textContent ?? ''
    expect(text).not.toMatch(/%\s*\d/)
    expect(text).not.toMatch(/\d+\s*%/)
    expect(text).not.toMatch(/\byıl(lık)?\s+deneyim/i)
    expect(container.querySelectorAll('progress, meter, [role="progressbar"]')).toHaveLength(0)
  })

  // A name either carries a real supplied logo or nothing at all. An earlier
  // round stood a made-up monogram tile in for the missing logos and the
  // owner had it removed, so "nothing" must stay an option: no substitute
  // artwork, no inline SVG drawn from memory.
  it('shows a real logo or nothing, never a stand-in', () => {
    const { container } = render(<Skills />)
    const items = Array.from(container.querySelectorAll('dd li'))
    expect(items.length).toBeGreaterThan(0)
    for (const item of items) {
      expect(item.querySelectorAll('svg')).toHaveLength(0)
      const children = Array.from(item.children)
      expect(children.length).toBeLessThanOrEqual(1)
      for (const child of children) {
        expect(child.tagName).toBe('IMG')
        // Decoration: the name is right beside it.
        expect(child.getAttribute('alt')).toBe('')
        expect(child.getAttribute('aria-hidden')).toBe('true')
        expect(child.getAttribute('loading')).toBe('lazy')
      }
    }
  })

  // Owner's request. Stable sort, so everything else keeps the editorial
  // order src/data/skills.ts put it in.
  it('sorts the names that have a logo to the front of their group', () => {
    const { container } = render(<Skills />)
    for (const list of Array.from(container.querySelectorAll('dd ul'))) {
      const hasLogo = Array.from(list.querySelectorAll('li')).map(
        (li) => li.querySelector('img') !== null,
      )
      // Once the logos stop, they must not start again.
      expect(hasLogo).toEqual([...hasLogo].sort((a, b) => Number(b) - Number(a)))
    }
  })

  // React went without a logo for a round because the only file available was
  // the React *Native* mark, whose wording would have claimed a framework the
  // owner lists nowhere. The owner supplied the plain atom instead.
  it('shows the React logo now that a plain one exists', () => {
    render(<Skills />)
    const logo = screen.getByText('React').querySelector('img')
    expect(logo).not.toBeNull()
    expect(logo!.getAttribute('src')).not.toContain('react-native')
  })

  // Not a casing fix here - the names are not uppercased in this section -
  // but a pronunciation one: a Turkish synthesiser reading "Entity Framework
  // Core" is not what these words are.
  it('declares the technology names English', () => {
    const { container } = render(<Skills />)
    const lists = Array.from(container.querySelectorAll('ul'))
    expect(lists.length).toBe(SKILL_GROUPS.length)
    for (const list of lists) {
      expect(list.getAttribute('lang')).toBe('en')
    }
  })
})

describe('skills data', () => {
  it('has unique group ids and no skill repeated across groups', () => {
    const ids = SKILL_GROUPS.map((group) => group.id)
    expect(new Set(ids).size).toBe(ids.length)
    const items = SKILL_GROUPS.flatMap((group) => group.items)
    expect(new Set(items).size).toBe(items.length)
  })

  // The guard that keeps this section honest: every entry must already be
  // vouched for somewhere else in the repo - either the owner's own Hakkımda
  // prose or a project's repo-sourced technology list. A skill invented here
  // and nowhere else fails this.
  it('lists nothing that the About copy or a project stack does not already vouch for', () => {
    const vouched = [
      ...ABOUT_PARAGRAPHS.map((paragraph) => paragraph.text),
      ...PROJECTS.flatMap((project) => project.technologies.flatMap((group) => group.items)),
      ...PROJECTS.flatMap((project) => project.description),
    ]
      .join(' ')
      .toLowerCase()

    // Git is the one entry with no prose mention: it is evidenced by the
    // repos themselves and by the GitHub Actions workflows already listed.
    const evidencedByTheRepoItself = new Set(['git'])

    for (const group of SKILL_GROUPS) {
      for (const item of group.items) {
        const needle = item.toLowerCase()
        if (evidencedByTheRepoItself.has(needle)) continue
        expect(vouched, `"${item}" is not vouched for anywhere else in the repo`).toContain(needle)
      }
    }
  })
})
