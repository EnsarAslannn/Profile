import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { inflateSync } from 'node:zlib'
import { CV_FILE, HERO_DESCRIPTION, HERO_IMAGES, HERO_PARAGRAPH, HERO_TITLE_LINES } from './hero'

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
    }
  }
  return /\/Lang\s*\(([^)]*)\)/.exec(searchable)?.[1]
}

describe('hero data', () => {
  it('spells the wordmark the way the owner asked', () => {
    expect([...HERO_TITLE_LINES.tr]).toEqual(['ENSAR ASLAN', 'PORTFOLYO'])
  })

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

  it('declares the job title English', () => {
    const title = HERO_DESCRIPTION.tr.find((segment) => segment.text === '.NET Developer')
    expect(title?.lang).toBe('en')
  })

  it('points each CV button at a PDF that is actually in public/', () => {
    for (const [language, path] of Object.entries(CV_FILE)) {
      expect(path.startsWith('/'), language).toBe(true)
      const file = readFileSync(`public${path}`)
      expect(file.subarray(0, 5).toString(), language).toBe('%PDF-')
      expect(file.length, language).toBeGreaterThan(10_000)
    }
  })

  it('serves a genuinely different CV per language, each declaring its own', () => {
    const tr = readFileSync(`public${CV_FILE.tr}`)
    const en = readFileSync(`public${CV_FILE.en}`)
    expect(CV_FILE.tr).not.toBe(CV_FILE.en)
    expect(tr.equals(en)).toBe(false)
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

  it('mixes portrait and landscape, which is why the gallery cannot crop', () => {
    const ratios = HERO_IMAGES.map((image) => image.width / image.height)
    expect(Math.min(...ratios)).toBeLessThan(0.8)
    expect(Math.max(...ratios)).toBeGreaterThan(1.8)
  })
})
