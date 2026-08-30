import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { inflateSync } from 'node:zlib'
import { CV_FILE, HERO_DESCRIPTION, HERO_IMAGES, HERO_PARAGRAPH, HERO_TITLE_LINES } from './hero'

/**
 * The language a PDF declares for itself, from its catalogue's /Lang entry.
 *
 * Deliberately not a PDF library: the repo ships no PDF dependency and this
 * needs one field. The entry can sit in the raw file or inside an object
 * stream, so both are searched - the Turkish CV compresses its catalogue and
 * the English one does not, which is exactly the case a raw-bytes search
 * would silently miss.
 */
function pdfLanguage(file: Buffer): string | undefined {
  const raw = file.toString('latin1')
  let searchable = raw
  const streams = /stream\r?\n/g
  let match: RegExpExecArray | null
  while ((match = streams.exec(raw))) {
    const start = match.index + match[0].length
    const end = raw.indexOf('endstream', start)
    if (end === -1) continue
    try {
      searchable += inflateSync(file.subarray(start, end)).toString('latin1')
    } catch {
      // Not a Flate stream (an embedded font, an image). Nothing to read.
    }
  }
  return /\/Lang\s*\(([^)]*)\)/.exec(searchable)?.[1]
}

describe('hero data', () => {
  it('spells the wordmark the way the owner asked', () => {
    expect([...HERO_TITLE_LINES.tr]).toEqual(['ENSAR ASLAN', 'PORTFOLYO'])
  })

  // The guard that keeps the hero honest. The segments exist only so the
  // design's mixed weights can be painted; they must still be the owner's
  // paragraph, character for character. A reworded fragment, a dropped space
  // at a seam, or a "small improvement" to the copy all fail here rather than
  // quietly changing what the site claims.
  it('joins back into the owner-supplied paragraph, exactly', () => {
    const joined = HERO_DESCRIPTION.tr.map((segment) => segment.text).join('')
    expect(joined).toBe(HERO_PARAGRAPH.tr)
    expect(joined).toBe(
      'Merhaba, ben Ensar Aslan. .NET Developer olarak modern web uygulamaları geliştiriyor, kullandığım teknolojilerin arkasındaki mantığı öğrenmeye ve kendimi sürekli geliştirmeye odaklanıyorum.',
    )
  })

  it('emphasises only phrases that are in that paragraph', () => {
    const emphasised = HERO_DESCRIPTION.tr.filter((segment) => segment.emphasis)
    expect(emphasised.length).toBeGreaterThan(0)
    for (const segment of emphasised) {
      expect(HERO_PARAGRAPH.tr).toContain(segment.text)
    }
  })

  // The one English fragment in an otherwise Turkish sentence.
  it('declares the job title English', () => {
    const title = HERO_DESCRIPTION.tr.find((segment) => segment.text === '.NET Developer')
    expect(title?.lang).toBe('en')
  })

  // A download button pointing at a missing file is a broken button, and
  // nothing else in the build would notice: the path is a literal string, so
  // neither TypeScript nor Vite can check it. This does.
  it('points each CV button at a PDF that is actually in public/', () => {
    for (const [language, path] of Object.entries(CV_FILE)) {
      expect(path.startsWith('/'), language).toBe(true)
      const file = readFileSync(`public${path}`)
      expect(file.subarray(0, 5).toString(), language).toBe('%PDF-')
      expect(file.length, language).toBeGreaterThan(10_000)
    }
  })

  // Two languages, two documents - not one file linked twice. The PDFs also
  // declare their own language, and a mismatch there is the failure that would
  // hand an English reader the Turkish CV while every other check passed.
  it('serves a genuinely different CV per language, each declaring its own', () => {
    const tr = readFileSync(`public${CV_FILE.tr}`)
    const en = readFileSync(`public${CV_FILE.en}`)
    expect(CV_FILE.tr).not.toBe(CV_FILE.en)
    expect(tr.equals(en)).toBe(false)
    // The /Lang entry is the PDF's own declaration of what language it is in,
    // and it is the one thing that distinguishes these two files by CONTENT
    // rather than by filename. Both documents are titled "ENSAR ASLAN" and
    // both are one page; a copy-paste that pointed the English button at the
    // Turkish PDF would pass every other check here.
    expect(pdfLanguage(tr)).toBe('tr')
    expect(pdfLanguage(en)).toBe('en')
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
