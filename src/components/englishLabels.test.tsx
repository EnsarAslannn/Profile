import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { renderWithRouter } from '../test/renderWithRouter'
import { SKILL_GROUPS } from '../data/skills'
import { SITE_ROLE } from '../lib/siteMeta'

// The Turkish dotted-I trap, made impossible to walk into a fourth time.
//
// index.html sets lang="tr". CSS `text-transform: uppercase` is locale-aware,
// and Turkish maps i -> İ, so any ENGLISH string rendered through an
// `uppercase` utility comes out wrong unless the element (or an ancestor)
// declares lang="en":
//
//   Architecture -> ARCHİTECTURE      LinkedIn -> LİNKEDIN
//   Testing      -> TESTİNG           GitHub   -> GİTHUB
//
// It has already shipped twice - the Yetenekler group labels, then the
// contact pills - because it is invisible in jsdom (no layout, no
// text-transform) and easy to miss in a screenshot. This test does not need
// layout: it checks the structural precondition instead, which is that every
// English label the UI renders sits inside a lang="en" scope.
//
// Turkish text must NOT be tagged: "İletişim" -> "İLETİŞİM" is correct
// precisely because the document is Turkish, and an en tag would break it.
const ENGLISH_LABELS = [
  ...SKILL_GROUPS.map((group) => group.heading),
  // The technology names themselves, now that they also run through the
  // uppercased Marquee strip. Every one is an English product or pattern name.
  ...SKILL_GROUPS.flatMap((group) => group.items),
  SITE_ROLE,
  'LinkedIn',
  'GitHub',
  // The stack section's own heading, renamed from Yetenekler at the owner's
  // request. It is uppercased like every other h2, so it needs tagging too.
  'Stacks',
]

// Section headings that are Turkish, and must therefore stay untagged.
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

  // The other half of the rule: tagging Turkish copy as English would be just
  // as wrong, and would also make a screen reader mispronounce it.
  // "İletişim" -> "İLETİŞİM" is correct precisely because the locale is
  // Turkish, and an en tag would break it.
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
    // Every Turkish heading is actually on the page - otherwise the loop
    // above could pass by checking nothing.
    expect(headings.map((h) => h.textContent)).toEqual(
      expect.arrayContaining(TURKISH_HEADINGS),
    )
  })
})
