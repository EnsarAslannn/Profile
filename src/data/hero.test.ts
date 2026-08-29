import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { CV_FILE, HERO_DESCRIPTION, HERO_IMAGES, HERO_PARAGRAPH, HERO_TITLE_LINES } from './hero'

describe('hero data', () => {
  it('spells the wordmark the way the owner asked', () => {
    expect([...HERO_TITLE_LINES]).toEqual(['ENSAR ASLAN', 'PORTFOLYO'])
  })

  // The guard that keeps the hero honest. The segments exist only so the
  // design's mixed weights can be painted; they must still be the owner's
  // paragraph, character for character. A reworded fragment, a dropped space
  // at a seam, or a "small improvement" to the copy all fail here rather than
  // quietly changing what the site claims.
  it('joins back into the owner-supplied paragraph, exactly', () => {
    const joined = HERO_DESCRIPTION.map((segment) => segment.text).join('')
    expect(joined).toBe(HERO_PARAGRAPH)
    expect(joined).toBe(
      'Merhaba, ben Ensar Aslan. .NET Developer olarak modern web uygulamaları geliştiriyor, kullandığım teknolojilerin arkasındaki mantığı öğrenmeye ve kendimi sürekli geliştirmeye odaklanıyorum.',
    )
  })

  it('emphasises only phrases that are in that paragraph', () => {
    const emphasised = HERO_DESCRIPTION.filter((segment) => segment.emphasis)
    expect(emphasised.length).toBeGreaterThan(0)
    for (const segment of emphasised) {
      expect(HERO_PARAGRAPH).toContain(segment.text)
    }
  })

  // The one English fragment in an otherwise Turkish sentence.
  it('declares the job title English', () => {
    const title = HERO_DESCRIPTION.find((segment) => segment.text === '.NET Developer')
    expect(title?.lang).toBe('en')
  })

  // A download button pointing at a missing file is a broken button, and
  // nothing else in the build would notice: the path is a literal string, so
  // neither TypeScript nor Vite can check it. This does.
  it('points the CV button at a PDF that is actually in public/', () => {
    expect(CV_FILE.startsWith('/')).toBe(true)
    const file = readFileSync(`public${CV_FILE}`)
    expect(file.subarray(0, 5).toString()).toBe('%PDF-')
    expect(file.length).toBeGreaterThan(10_000)
  })

  it('carries the six images the owner nominated, with true measured sizes', () => {
    expect(HERO_IMAGES.map((image) => image.id)).toEqual([
      'portrait',
      'dolfin',
      'altitudelog',
      'takeauction',
      'erasmus',
      'brisa',
    ])
    expect(HERO_IMAGES.map((image) => [image.width, image.height])).toEqual([
      [640, 853],
      [1600, 880],
      [1600, 878],
      [1600, 875],
      [614, 767],
      [574, 767],
    ])
    for (const image of HERO_IMAGES) {
      expect(image.src).toBeTruthy()
    }
  })

  // The ratios run from 0.75 to 1.83. That spread is the whole reason
  // HeroGallery letterboxes instead of cropping to a single box - a crop that
  // suits the portrait cuts the sides off the screenshots and vice versa.
  it('mixes portrait and landscape, which is why the gallery cannot crop', () => {
    const ratios = HERO_IMAGES.map((image) => image.width / image.height)
    expect(Math.min(...ratios)).toBeLessThan(0.8)
    expect(Math.max(...ratios)).toBeGreaterThan(1.8)
  })
})
