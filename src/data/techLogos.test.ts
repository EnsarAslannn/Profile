import { describe, expect, it } from 'vitest'
import { TECH_LOGOS, logosFirst } from './techLogos'
import { SKILL_GROUPS } from './skills'

const ALL_ITEMS = SKILL_GROUPS.flatMap((group) => group.items)

describe('TECH_LOGOS', () => {
  // A logo keyed to a name nothing renders is dead weight, and worse, it hides
  // a typo: "Tailwind css" would simply never match and never show.
  it('maps only technologies that are actually in the stack', () => {
    for (const name of Object.keys(TECH_LOGOS)) {
      expect(ALL_ITEMS, `"${name}" is not in SKILL_GROUPS`).toContain(name)
    }
  })

  it('resolves every logo to a real bundled asset', () => {
    for (const [name, url] of Object.entries(TECH_LOGOS)) {
      expect(url, name).toBeTruthy()
      // Vite inlines assets below its size limit, so a logo comes back either
      // as a hashed .svg URL or as an svg data URI. Both are resolved output;
      // an unresolved glob key would be neither.
      expect(url, name).toMatch(/(\.svg$|^data:image\/svg\+xml)/)
    }
  })

  // The map is deliberately consulted by EXACT key, which matters because the
  // stack contains names that contain other names: "React Router" starts with
  // "React", and "Git" is a prefix of "GitHub Actions". A substring or
  // startsWith lookup would put the Git mark on GitHub Actions and a React
  // mark on React Router.
  it('matches names exactly, so overlapping names cannot borrow each other', () => {
    expect(TECH_LOGOS['Git']).toBeTruthy()
    expect(TECH_LOGOS['GitHub Actions']).toBeTruthy()
    expect(TECH_LOGOS['Git']).not.toBe(TECH_LOGOS['GitHub Actions'])

    // Present in the stack, absent from the map - and it must stay absent.
    expect(ALL_ITEMS).toContain('React Router')
    expect(TECH_LOGOS).not.toHaveProperty('React Router')
    expect(TECH_LOGOS).not.toHaveProperty('GitHub')
  })

  // The React entry used to point at nothing: the only file available was
  // react-native-1.svg, which carries the words "React Native" as part of the
  // artwork, and beside "React" it would have made the page claim a framework
  // the owner lists nowhere. The owner supplied the plain atom; this pins that
  // the replacement is what is wired up, and that the old file is gone.
  it('uses the plain React atom, not the React Native mark', () => {
    expect(ALL_ITEMS).toContain('React')
    expect(TECH_LOGOS['React']).toBeTruthy()
    expect(TECH_LOGOS['React']).not.toContain('react-native')
  })
})

describe('logosFirst', () => {
  it('lifts the entries that have a logo to the front', () => {
    const sorted = logosFirst(['Clean Architecture', 'C#', 'CQRS', 'TypeScript'])
    expect(sorted).toEqual(['C#', 'TypeScript', 'Clean Architecture', 'CQRS'])
  })

  // Stable, so the editorial order in src/data/skills.ts survives inside each
  // half of the split.
  it('keeps the original relative order within each half', () => {
    for (const group of SKILL_GROUPS) {
      const sorted = logosFirst(group.items)
      const withLogo = sorted.filter((item) => item in TECH_LOGOS)
      const without = sorted.filter((item) => !(item in TECH_LOGOS))
      expect(withLogo).toEqual(group.items.filter((item) => item in TECH_LOGOS))
      expect(without).toEqual(group.items.filter((item) => !(item in TECH_LOGOS)))
    }
  })

  it('returns a new array, leaving the source data untouched', () => {
    const source = SKILL_GROUPS[0].items
    const before = [...source]
    logosFirst(source)
    expect([...source]).toEqual(before)
  })
})
