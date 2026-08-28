import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Skills from './Skills'
import { SKILL_GROUPS, SKILLS_INTRO } from '../data/skills'
import { ABOUT_PARAGRAPHS } from '../data/about'
import { PROJECTS } from '../data/projects'

describe('Skills', () => {
  it('carries the section anchor the footer links to', () => {
    const { container } = render(<Skills />)
    expect(container.querySelector('section#yetenekler')).not.toBeNull()
  })

  it('renders Yetenekler as an h2 and each group as an h3 below it', () => {
    render(<Skills />)
    expect(screen.getByRole('heading', { level: 2, name: 'Yetenekler' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(
      SKILL_GROUPS.map((group) => group.heading),
    )
  })

  it('renders the intro and every skill in every group', () => {
    render(<Skills />)
    expect(screen.getByText(SKILLS_INTRO)).toBeInTheDocument()
    for (const group of SKILL_GROUPS) {
      for (const item of group.items) {
        expect(screen.getByText(item)).toBeInTheDocument()
      }
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
