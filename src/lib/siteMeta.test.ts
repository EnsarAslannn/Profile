import { describe, expect, it } from 'vitest'
import { PROJECTS } from '../data/projects'
import { firstSentence, truncateForDescription } from './siteMeta'

describe('firstSentence', () => {
  it('does not cut at the dot in ".NET"', () => {
    const takeauction = PROJECTS.find((project) => project.slug === 'takeauction')!
    expect(firstSentence(takeauction.description)).toBe(
      'Gerçek zamanlı, yüksek trafikli bir online açık artırma sistemi.',
    )
  })

  it('returns the first sentence of every project description', () => {
    for (const project of PROJECTS) {
      const sentence = firstSentence(project.description)
      expect(project.description.startsWith(sentence)).toBe(true)
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
