import { describe, expect, it } from 'vitest'
import { TECH_LOGOS, logosFirst } from './techLogos'
import { SKILL_GROUPS } from './skills'

const ALL_ITEMS = SKILL_GROUPS.flatMap((group) => group.items)

describe('TECH_LOGOS', () => {
  it('maps only technologies that are actually in the stack', () => {
    for (const name of Object.keys(TECH_LOGOS)) {
      expect(ALL_ITEMS, `"${name}" is not in SKILL_GROUPS`).toContain(name)
    }
  })

  it('resolves every logo to a real bundled asset', () => {
    for (const [name, url] of Object.entries(TECH_LOGOS)) {
      expect(url, name).toBeTruthy()
      expect(url, name).toMatch(/(\.svg$|^data:image\/svg\+xml)/)
    }
  })

  it('matches names exactly, so overlapping names cannot borrow each other', () => {
    expect(TECH_LOGOS['Git']).toBeTruthy()
    expect(TECH_LOGOS['GitHub Actions']).toBeTruthy()
    expect(TECH_LOGOS['Git']).not.toBe(TECH_LOGOS['GitHub Actions'])

    expect(ALL_ITEMS).toContain('React Router')
    expect(TECH_LOGOS).not.toHaveProperty('React Router')
    expect(TECH_LOGOS).not.toHaveProperty('GitHub')
  })

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
