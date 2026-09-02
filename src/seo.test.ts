import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { PROJECTS } from './data/projects'
import { SOCIAL_LINKS } from './data/social'
import { DEFAULT_TITLE, SITE_NAME, SITE_ROLE, SITE_URL } from './lib/siteMeta'

const root = path.resolve(__dirname, '..')
const read = (relative: string) => readFileSync(path.join(root, relative), 'utf8')
const indexHtml = read('index.html')

function jpegSize(relative: string): { width: number; height: number } {
  const buffer = readFileSync(path.join(root, relative))
  expect(buffer[0], `${relative} is not a JPEG`).toBe(0xff)
  expect(buffer[1], `${relative} is not a JPEG`).toBe(0xd8)

  let offset = 2
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) throw new Error(`${relative}: lost the marker chain`)
    const marker = buffer[offset + 1]
    const isStartOfFrame =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc
    if (isStartOfFrame) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) }
    }
    offset += 2 + buffer.readUInt16BE(offset + 2)
  }
  throw new Error(`${relative}: no start-of-frame marker`)
}

describe('static SEO files', () => {
  describe('social cards', () => {
    const cards = ['public/og.jpg', ...PROJECTS.tr.map((p) => `public/og-${p.slug}.jpg`)]

    for (const card of cards) {
      it(`${card} exists and is a 1200x630 JPEG`, () => {
        expect(jpegSize(card)).toEqual({ width: 1200, height: 630 })
      })
    }

    it('has one card per project, and index.html points at a real file', () => {
      expect(cards).toHaveLength(PROJECTS.tr.length + 1)

      const declared = indexHtml.match(/<meta property="og:image" content="([^"]+)"/)?.[1]
      expect(declared).toBe(`${SITE_URL}/og.jpg`)
    })
  })

  describe('index.html', () => {
    it('uses SITE_URL for canonical, og:url and both hreflang alternates', () => {
      expect(indexHtml).toContain(`<link rel="canonical" href="${SITE_URL}/" />`)
      expect(indexHtml).toContain(`<meta property="og:url" content="${SITE_URL}/" />`)
      expect(indexHtml).toContain(`hreflang="tr" href="${SITE_URL}/"`)
      expect(indexHtml).toContain(`hreflang="en" href="${SITE_URL}/?lang=en"`)
      expect(indexHtml).toContain(`hreflang="x-default" href="${SITE_URL}/"`)
    })

    it('carries the same title the app renders', () => {
      expect(indexHtml).toContain(`<title>${DEFAULT_TITLE}</title>`)
    })

    it('declares an image alongside the large-image twitter card', () => {
      expect(indexHtml).toContain('name="twitter:card" content="summary_large_image"')
      expect(indexHtml).toContain(`name="twitter:image" content="${SITE_URL}/og.jpg"`)
      expect(indexHtml).toContain('property="og:image:width" content="1200"')
      expect(indexHtml).toContain('property="og:image:height" content="630"')
    })
  })

  describe('Person structured data', () => {
    const person = JSON.parse(
      indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? '{}',
    )

    it('names the same person, role and URL the app does', () => {
      expect(person['@type']).toBe('Person')
      expect(person.name).toBe(SITE_NAME)
      expect(person.jobTitle).toBe(SITE_ROLE)
      expect(person.url).toBe(`${SITE_URL}/`)
    })

    it('lists exactly the profile URLs in social.ts', () => {
      const expected = SOCIAL_LINKS.tr.map((link) => link.href)
      expect([...person.sameAs].sort()).toEqual([...expected].sort())
    })
  })

  describe('robots.txt and the manifest', () => {
    it('points crawlers at the generated sitemap', () => {
      expect(read('public/robots.txt')).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`)
    })

    it('ships a valid manifest whose icons all exist', () => {
      const manifest = JSON.parse(read('public/site.webmanifest'))
      expect(manifest.icons.length).toBeGreaterThan(0)
      for (const icon of manifest.icons) {
        expect(() => readFileSync(path.join(root, 'public', icon.src)), icon.src).not.toThrow()
      }
    })
  })
})
