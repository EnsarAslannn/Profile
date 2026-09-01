import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { PROJECTS } from './data/projects'
import { SOCIAL_LINKS } from './data/social'
import { DEFAULT_TITLE, SITE_NAME, SITE_ROLE, SITE_URL } from './lib/siteMeta'

// index.html, public/robots.txt and the cards in public/ are the only part of
// this site a social scraper ever reads - LinkedIn, X, Slack and WhatsApp do
// not run JavaScript, so RouteMeta never reaches them. Nothing else in the
// repo can check any of it: they are static files no module imports, so
// TypeScript, the bundler and every component test are all blind to a card
// that was never generated or a JSON-LD block that drifted from src/data.
//
// This is the same trick src/data/hero.test.ts uses for the two CVs, and for
// the same reason: read the file off disk and check what is actually in it.

const root = path.resolve(__dirname, '..')
const read = (relative: string) => readFileSync(path.join(root, relative), 'utf8')
const indexHtml = read('index.html')

/**
 * Width and height straight out of a JPEG's start-of-frame marker.
 *
 * Hand-parsed rather than handed to sharp: sharp is a native module and this
 * suite runs in jsdom, and the whole question here is nine bytes long.
 */
function jpegSize(relative: string): { width: number; height: number } {
  const buffer = readFileSync(path.join(root, relative))
  expect(buffer[0], `${relative} is not a JPEG`).toBe(0xff)
  expect(buffer[1], `${relative} is not a JPEG`).toBe(0xd8)

  let offset = 2
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) throw new Error(`${relative}: lost the marker chain`)
    const marker = buffer[offset + 1]
    // SOF0..SOF15, minus the three that are not start-of-frame markers at all
    // (DHT 0xC4, JPG 0xC8, DAC 0xCC).
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
    // Facebook, LinkedIn and X all render 1200x630 as a large summary card,
    // and index.html declares exactly those numbers - a card that is not that
    // size makes the declaration a lie and the preview a stretched crop.
    const cards = ['public/og.jpg', ...PROJECTS.tr.map((p) => `public/og-${p.slug}.jpg`)]

    for (const card of cards) {
      it(`${card} exists and is a 1200x630 JPEG`, () => {
        expect(jpegSize(card)).toEqual({ width: 1200, height: 630 })
      })
    }

    // One per project, derived from the project list rather than a literal:
    // adding a fourth project without re-running scripts/make-og-image.mjs
    // would otherwise ship a detail page whose preview is a 404.
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

    // A summary_large_image card with no image is a text-only preview, which
    // is the state this site shipped in before these tags existed.
    it('declares an image alongside the large-image twitter card', () => {
      expect(indexHtml).toContain('name="twitter:card" content="summary_large_image"')
      expect(indexHtml).toContain(`name="twitter:image" content="${SITE_URL}/og.jpg"`)
      expect(indexHtml).toContain('property="og:image:width" content="1200"')
      expect(indexHtml).toContain('property="og:image:height" content="630"')
    })
  })

  // Structured data that claims more than the page does is what gets a rich
  // result pulled, so every value here has to trace to something in src/.
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

    // sameAs is the half a crawler actually acts on - it is how a search
    // result gets tied to the owner's real profiles - so a URL changed in
    // social.ts has to move it too.
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
