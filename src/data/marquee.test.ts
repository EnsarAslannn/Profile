import { describe, expect, it } from 'vitest'
import { MARQUEE_WORDS } from './marquee'
import { SKILL_GROUPS } from '../data/skills'

describe('marquee data', () => {
  // Derived, never re-typed. This is what stops the strip and the Yetenekler
  // section a few screens below it from ever disagreeing, and it is why the
  // strip needs no vouching rule of its own: Skills.test.tsx already refuses
  // any technology the rest of the repo does not back up.
  it('is exactly the Yetenekler technologies, in the section order', () => {
    expect(MARQUEE_WORDS).toEqual(SKILL_GROUPS.flatMap((group) => group.items))
  })

  it('runs every group, not just the first', () => {
    for (const group of SKILL_GROUPS) {
      for (const item of group.items) {
        expect(MARQUEE_WORDS).toContain(item)
      }
    }
    expect(MARQUEE_WORDS.length).toBeGreaterThan(20)
  })

  // Skills.test.tsx already forbids repeats across groups; a duplicate here
  // would mean the flattening went wrong rather than the data being bad.
  it('repeats nothing', () => {
    expect(new Set(MARQUEE_WORDS).size).toBe(MARQUEE_WORDS.length)
  })
})
