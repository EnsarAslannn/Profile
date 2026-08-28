import { describe, expect, it } from 'vitest'
import { PROJECTS } from '../data/projects'
import { firstSentence, truncateForDescription } from './siteMeta'

describe('firstSentence', () => {
  // A literal, not a project description: the ".NET" lookahead is a property
  // of firstSentence itself, and the descriptions no longer happen to contain
  // ".NET" (the stack moved into the technologies list). Pinning the guard to
  // whatever the copy currently says would let a copy edit quietly retire it.
  it('does not cut at the dot in ".NET"', () => {
    expect(firstSentence('.NET ve PostgreSQL ile geliştirildi. Sonra ikinci cümle gelir.')).toBe(
      '.NET ve PostgreSQL ile geliştirildi.',
    )
  })

  it('returns the first sentence of every project description', () => {
    for (const project of PROJECTS) {
      const sentence = firstSentence(project.description[0])
      expect(project.description[0].startsWith(sentence)).toBe(true)
      expect(sentence.endsWith('.')).toBe(true)
      // A cut at ".NET" would leave a fragment far shorter than a real sentence.
      expect(sentence.length).toBeGreaterThan(40)
    }
  })

  it('returns the whole text when there is no terminator', () => {
    expect(firstSentence('tek parça metin')).toBe('tek parça metin')
  })
})

describe('truncateForDescription', () => {
  it('leaves text inside the budget untouched', () => {
    expect(truncateForDescription('kısa açıklama')).toBe('kısa açıklama')
  })

  it('cuts on a word boundary and never exceeds the budget', () => {
    const long = 'kelime '.repeat(60).trim()
    const result = truncateForDescription(long, 50)
    expect(result.length).toBeLessThanOrEqual(50 + 3)
    expect(result.endsWith('...')).toBe(true)
    expect(result).not.toMatch(/\s\.\.\.$/)
  })

  it('collapses whitespace', () => {
    expect(truncateForDescription('iki   satır\nmetin')).toBe('iki satır metin')
  })
})
