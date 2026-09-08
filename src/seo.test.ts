import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { PROJECTS } from './data/projects'
import { SOCIAL_LINKS } from './data/social'
import { CONTACT_ITEMS } from './data/contact'
import { CV_FILE } from './data/hero'
import { UI } from './i18n/ui'
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
      expect(indexHtml).toContain(`hreflang="en" href="${SITE_URL}/en"`)
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

  describe('the no-JavaScript fallback', () => {
    const noscript = indexHtml.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] ?? ''
    const collapsed = noscript.replace(/\s+/g, ' ')

    it('exists, and says what it says in the UI strings rather than in a second copy', () => {
      expect(noscript.length).toBeGreaterThan(0)
      expect(collapsed).toContain(UI.tr.noscriptNotice)
    })

    it('names the same person and role the rest of the site does', () => {
      expect(collapsed).toContain(SITE_NAME)
      expect(collapsed).toContain(SITE_ROLE)
    })

    it('offers the CV and both profiles as links that work without JavaScript', () => {
      expect(noscript).toContain(`href="${CV_FILE.tr}"`)
      for (const link of SOCIAL_LINKS.tr) {
        expect(noscript).toContain(`href="${link.href}"`)
      }
    })

    it('prints the e-mail as text and not as a mailto, exactly as the contact row does', () => {
      const email = CONTACT_ITEMS.tr.find((item) => item.id === 'email')!
      expect(collapsed).toContain(email.value)
      expect(noscript).not.toContain('mailto:')
    })
  })

  describe('vercel.json', () => {
    const vercel = JSON.parse(read('vercel.json'))
    const basePaths = ['/', '/hakkimda', ...PROJECTS.tr.map((p) => `/projects/${p.slug}`)]

    it('sends every legacy ?lang=en address to the path that English page now lives at', () => {
      expect(vercel.redirects.map((redirect: { source: string }) => redirect.source)).toEqual(
        basePaths,
      )

      for (const redirect of vercel.redirects) {
        expect(redirect.has).toEqual([{ type: 'query', key: 'lang', value: 'en' }])
        expect(redirect.destination).toBe(
          redirect.source === '/' ? '/en' : `/en${redirect.source}`,
        )
        expect(redirect.permanent).toBe(true)
      }
    })

    it('never redirects from an address that is already English, which would loop', () => {
      for (const redirect of vercel.redirects) {
        expect(redirect.source).not.toMatch(/^\/en(\/|$)/)
      }
    })

    it('leaves the SPA catch-all rewrite alone, so the prerender stays fail-safe', () => {
      expect(vercel.rewrites).toEqual([{ source: '/(.*)', destination: '/index.html' }])
    })

    describe('security headers', () => {
      const forEveryPath = vercel.headers.find(
        (entry: { source: string }) => entry.source === '/(.*)',
      )
      const header = (key: string) =>
        forEveryPath.headers.find((h: { key: string }) => h.key === key)?.value

      it('sends the four headers a static site gets for free', () => {
        expect(header('X-Content-Type-Options')).toBe('nosniff')
        expect(header('X-Frame-Options')).toBe('DENY')
        expect(header('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
        expect(header('Permissions-Policy')).toContain('camera=()')
      })

      it('allows subresources from this origin only, which is all the built site loads', () => {
        const csp = header('Content-Security-Policy') as string
        for (const directive of [
          "default-src 'self'",
          "script-src 'self'",
          "style-src 'self'",
          "img-src 'self'",
          "connect-src 'self'",
        ]) {
          expect(csp).toContain(directive)
        }
      })

      it('leaves no room for an injected inline script, a data: image or a framing page', () => {
        const csp = header('Content-Security-Policy') as string
        expect(csp).not.toContain('unsafe-inline')
        expect(csp).not.toContain('unsafe-eval')
        expect(csp).not.toContain('data:')
        expect(csp).toContain("frame-ancestors 'none'")
        expect(csp).toContain("object-src 'none'")
        expect(csp).toContain("base-uri 'none'")
      })

      it('is matched by a build that inlines nothing, or img-src would block the small assets', () => {
        const csp = header('Content-Security-Policy') as string
        expect(csp).toContain("img-src 'self'")
        expect(read('vite.config.ts')).toMatch(/assetsInlineLimit:\s*0/)
      })

      it('caches the content-hashed assets forever and nothing else', () => {
        const assets = vercel.headers.find(
          (entry: { source: string }) => entry.source === '/assets/(.*)',
        )
        const cacheControl = assets.headers.find(
          (h: { key: string }) => h.key === 'Cache-Control',
        )?.value

        expect(cacheControl).toContain('immutable')
        expect(cacheControl).toContain('max-age=31536000')
        expect(forEveryPath.headers.map((h: { key: string }) => h.key)).not.toContain(
          'Cache-Control',
        )
      })
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
