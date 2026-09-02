import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { renderWithRouter } from '../test/renderWithRouter'
import { SKILL_GROUPS } from '../data/skills'
import { SITE_ROLE } from '../lib/siteMeta'

const ENGLISH_LABELS = [
  ...SKILL_GROUPS.map((group) => group.heading),
  ...SKILL_GROUPS.flatMap((group) => group.items),
  SITE_ROLE,
  'LinkedIn',
  'GitHub',
  'Stacks',
]

const TURKISH_HEADINGS = ['Hakkımda', 'Projeler', 'Özgeçmiş', 'İletişim']

describe('English labels in a Turkish document', () => {
  it('renders every English label inside a lang="en" scope', () => {
    renderWithRouter(<App />, '/')

    for (const label of ENGLISH_LABELS) {
      const matches = screen.getAllByText(label, { exact: false }).filter(
        (element) => element.textContent?.trim() === label,
      )
      expect(matches.length, `"${label}" is not rendered anywhere`).toBeGreaterThan(0)

      for (const element of matches) {
        expect(
          element.closest('[lang="en"]'),
          `"${label}" is uppercased in a lang="tr" document without lang="en" - it will render with a Turkish dotted İ`,
        ).not.toBeNull()
      }
    }
  })

  it('leaves Turkish headings untagged, so their uppercasing stays Turkish', () => {
    const { container } = renderWithRouter(<App />, '/')
    const headings = Array.from(container.querySelectorAll('h2'))
    expect(headings.length).toBeGreaterThan(0)
    for (const heading of headings) {
      expect(heading.className).toMatch(/\buppercase\b/)
      if (TURKISH_HEADINGS.includes(heading.textContent ?? '')) {
        expect(heading.getAttribute('lang')).toBeNull()
        expect(heading.closest('[lang="en"]')).toBeNull()
      }
    }
    expect(headings.map((h) => h.textContent)).toEqual(
      expect.arrayContaining(TURKISH_HEADINGS),
    )
  })
})
