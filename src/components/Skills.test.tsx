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

  it('renders no intro paragraph and no section index', () => {
    const { container } = render(<Skills />)
    expect(container.querySelectorAll('p')).toHaveLength(0)
    expect(container.textContent).not.toMatch(/\[\d{3}]/)
  })

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

  it('tags the English labels with lang=en so uppercasing stays English', () => {
    render(<Skills />)
    for (const heading of screen.getAllByRole('heading', { level: 3 })) {
      expect(heading).toHaveAttribute('lang', 'en')
    }
  })

  it('claims no proficiency level anywhere', () => {
    const { container } = render(<Skills />)
    const text = container.textContent ?? ''
    expect(text).not.toMatch(/%\s*\d/)
    expect(text).not.toMatch(/\d+\s*%/)
    expect(text).not.toMatch(/\byıl(lık)?\s+deneyim/i)
    expect(container.querySelectorAll('progress, meter, [role="progressbar"]')).toHaveLength(0)
  })

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
        expect(child.getAttribute('alt')).toBe('')
        expect(child.getAttribute('aria-hidden')).toBe('true')
        expect(child.getAttribute('loading')).toBe('lazy')
      }
    }
  })

  it('sorts the names that have a logo to the front of their group', () => {
    const { container } = render(<Skills />)
    for (const list of Array.from(container.querySelectorAll('dd ul'))) {
      const hasLogo = Array.from(list.querySelectorAll('li')).map(
        (li) => li.querySelector('img') !== null,
      )
      expect(hasLogo).toEqual([...hasLogo].sort((a, b) => Number(b) - Number(a)))
    }
  })

  it('shows the React logo now that a plain one exists', () => {
    render(<Skills />)
    const logo = screen.getByText('React').querySelector('img')
    expect(logo).not.toBeNull()
    expect(logo!.getAttribute('src')).not.toContain('react-native')
  })

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

  it('lists nothing that the About copy or a project stack does not already vouch for', () => {
    const vouched = [
      ...ABOUT_PARAGRAPHS.tr.map((paragraph) => paragraph.text),
      ...PROJECTS.tr.flatMap((project) => project.technologies.flatMap((group) => group.items)),
      ...PROJECTS.tr.flatMap((project) => project.description),
    ]
      .join(' ')
      .toLowerCase()

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
