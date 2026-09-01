// Post-build step. Runs after `vite build` (see package.json) and writes the
// two things a static SPA build cannot produce on its own:
//
//   1. dist/sitemap.xml  - one entry per route, including one per project,
//      each carrying its Turkish and English alternates.
//   2. dist/<route>/index.html - a copy of the built index.html with THAT
//      route's title, description, canonical and social tags patched into
//      the head.
//
// Why (2) exists: RouteMeta already sets all of this at runtime, but LinkedIn,
// X, Slack and WhatsApp read the raw HTML response and never execute
// JavaScript. Until now every shared link - a project page included - showed
// the home page's tags. This is the prerender that fixes it, and it is a head
// rewrite rather than a React SSR pass on purpose: rendering the body would
// mean making every component SSR-safe and then reconciling a hydration
// mismatch, for a payoff (a crawler seeing body copy) that Google already
// gets by executing the script.
//
// It is also FAIL-SAFE against the hosting. vercel.json's catch-all rewrite is
// untouched: Vercel checks the filesystem before applying rewrites, so if
// dist/hakkimda/index.html is served the scraper gets the right tags, and if
// it is not, the rewrite serves dist/index.html exactly as it does today. No
// deep link can break either way.
//
// Everything here is DERIVED - the slugs, titles and descriptions are read
// out of src/data through Vite's own module loader, not re-typed. That is
// what stops the sitemap from silently omitting a fourth project.
import { createServer } from 'vite'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

// Loading the app's real modules through Vite rather than importing them with
// Node: src/data/projects reaches import.meta.glob, which only Vite can
// resolve. This is the difference between a sitemap derived from the data and
// one hand-maintained beside it.
const server = await createServer({
  root,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

let siteMeta, projects, ui, about
try {
  siteMeta = await server.ssrLoadModule('/src/lib/siteMeta.ts')
  projects = await server.ssrLoadModule('/src/data/projects/index.ts')
  ui = await server.ssrLoadModule('/src/i18n/ui.ts')
  about = await server.ssrLoadModule('/src/data/about.ts')
} finally {
  await server.close()
}

const { SITE_NAME, SITE_URL, truncateForDescription, firstSentence } = siteMeta

// The cards scripts/make-og-image.mjs writes into public/. Stable names and
// no hash, because a static HTML file cannot name a hashed asset - and every
// one is 1200x630 JPEG, so the og:image:width/height already in index.html
// stay correct for every route.
const SITE_IMAGE = `${SITE_URL}/og.jpg`
const SITE_IMAGE_ALT =
  'Ensar Aslan portfolyo sitesinin ana sayfası: isim, Full Stack .NET Developer tanıtımı ve proje görselleri.'

const ROUTES = [
  {
    path: '/',
    title: siteMeta.DEFAULT_TITLE,
    description: truncateForDescription(about.ABOUT_PARAGRAPHS.tr[0].text),
    image: SITE_IMAGE,
    imageAlt: SITE_IMAGE_ALT,
    type: 'website',
  },
  {
    path: '/hakkimda',
    title: `${ui.UI.tr.aboutPageTitle} | ${SITE_NAME}`,
    description: truncateForDescription(about.ABOUT_PARAGRAPHS.tr[0].text),
    // The site card and not the profile photo RouteMeta uses at runtime:
    // ea.webp is a 3:4 portrait, and a scraper's 1.91:1 slot would crop it to
    // a strip. This is the one place the two deliberately differ.
    image: SITE_IMAGE,
    imageAlt: SITE_IMAGE_ALT,
    type: 'website',
  },
  ...projects.PROJECTS.tr.map((project) => ({
    path: `/projects/${project.slug}`,
    title: `${project.title} | ${SITE_NAME}`,
    description: truncateForDescription(firstSentence(project.description[0])),
    image: `${SITE_URL}/og-${project.slug}.jpg`,
    // The card IS that screenshot, so the screenshot's own owner-written
    // caption describes it exactly - no alt text is invented here.
    imageAlt: project.screens[0].caption,
    type: 'article',
  })),
]

// ---------------------------------------------------------------- sitemap

const escapeXml = (value) =>
  value.replace(/[<>&'"]/g, (c) => `&${{ '<': 'lt', '>': 'gt', '&': 'amp', "'": 'apos', '"': 'quot' }[c]};`)

// No <lastmod>, <changefreq> or <priority>. All three are optional, Google
// ignores the last two outright, and a lastmod stamped with the build time
// would claim every page changed on every deploy - which teaches a crawler to
// stop believing the field.
//
// The xhtml:link alternates are the part that earns its keep: ?lang=en is the
// only address the English site has, so this is how a crawler learns it
// exists at all.
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${ROUTES.map(({ path: routePath }) => {
  const tr = `${SITE_URL}${routePath}`
  const en = `${tr}${routePath.includes('?') ? '&' : '?'}lang=en`
  return `  <url>
    <loc>${escapeXml(tr)}</loc>
    <xhtml:link rel="alternate" hreflang="tr" href="${escapeXml(tr)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(en)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(tr)}" />
  </url>`
}).join('\n')}
</urlset>
`

await fs.writeFile(path.join(dist, 'sitemap.xml'), sitemap, 'utf8')
console.log(`sitemap.xml       ${ROUTES.length} urls`)

// ------------------------------------------------------------- prerender

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8')

const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

/**
 * Rewrites one tag's attribute in place.
 *
 * Throws when the pattern finds nothing, which is the point: index.html and
 * this script have to agree on which tags exist, and a rename that quietly
 * stopped patching og:image would ship a whole set of wrong previews with no
 * error anywhere.
 */
function replaceOne(html, pattern, replacement, what) {
  const matches = html.match(new RegExp(pattern.source, pattern.flags + 'g'))
  if (!matches || matches.length !== 1) {
    throw new Error(
      `Expected exactly one ${what} in dist/index.html, found ${matches?.length ?? 0}. ` +
        `index.html and scripts/build-seo-files.mjs have drifted apart.`,
    )
  }
  return html.replace(pattern, replacement)
}

// `[^>]*` rather than `[^>\n]*` throughout: several tags in index.html are
// written across multiple lines, and a negated class matches newlines.
const setMeta = (html, attr, key, value) =>
  replaceOne(
    html,
    new RegExp(`(<meta[^>]*\\s${attr}="${key.replace(/:/g, ':')}"[^>]*content=")[^"]*(")`),
    `$1${escapeAttr(value)}$2`,
    `${attr}="${key}" meta`,
  )

const setLink = (html, rel, extra, value) =>
  replaceOne(
    html,
    new RegExp(`(<link[^>]*\\srel="${rel}"${extra}[^>]*href=")[^"]*(")`),
    `$1${escapeAttr(value)}$2`,
    `rel="${rel}"${extra} link`,
  )

for (const route of ROUTES) {
  // '/' is dist/index.html itself, which the build already wrote with the
  // home page's values - patching it would be a no-op at best.
  if (route.path === '/') continue

  const canonical = `${SITE_URL}${route.path}`
  let html = template

  html = replaceOne(html, /<title>[^<]*<\/title>/, `<title>${escapeXml(route.title)}</title>`, '<title>')

  html = setMeta(html, 'name', 'description', route.description)
  html = setMeta(html, 'property', 'og:title', route.title)
  html = setMeta(html, 'property', 'og:description', route.description)
  html = setMeta(html, 'property', 'og:type', route.type)
  html = setMeta(html, 'property', 'og:url', canonical)
  html = setMeta(html, 'property', 'og:image', route.image)
  html = setMeta(html, 'name', 'twitter:title', route.title)
  html = setMeta(html, 'name', 'twitter:description', route.description)
  html = setMeta(html, 'name', 'twitter:image', route.image)

  html = setMeta(html, 'property', 'og:image:alt', route.imageAlt)

  html = setLink(html, 'canonical', '', canonical)
  html = setLink(html, 'alternate', ' hreflang="tr"', canonical)
  html = setLink(html, 'alternate', ' hreflang="en"', `${canonical}?lang=en`)
  html = setLink(html, 'alternate', ' hreflang="x-default"', canonical)

  // og:image:width / og:image:height are left alone: every card
  // make-og-image.mjs writes is 1200x630, so the values index.html already
  // declares are right for every route.

  const outDir = path.join(dist, route.path.replace(/^\//, ''))
  await fs.mkdir(outDir, { recursive: true })
  await fs.writeFile(path.join(outDir, 'index.html'), html, 'utf8')
  console.log(`${route.path.padEnd(30)}${route.title}`)
}
