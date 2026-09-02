import { describe, expect, it } from 'vitest'
import { MARQUEE_WORDS } from './marquee'
import { SKILL_GROUPS } from '../data/skills'

describe('marquee data', () => {
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

  it('repeats nothing', () => {
    expect(new Set(MARQUEE_WORDS).size).toBe(MARQUEE_WORDS.length)
  })
})
