import { createServer } from 'vite'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

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
    image: SITE_IMAGE,
    imageAlt: SITE_IMAGE_ALT,
    type: 'website',
  },
  ...projects.PROJECTS.tr.map((project) => ({
    path: `/projects/${project.slug}`,
    title: `${project.title} | ${SITE_NAME}`,
    description: truncateForDescription(firstSentence(project.description[0])),
    image: `${SITE_URL}/og-${project.slug}.jpg`,
    imageAlt: project.screens[0].caption,
    type: 'article',
  })),
]

const escapeXml = (value) =>
  value.replace(/[<>&'"]/g, (c) => `&${{ '<': 'lt', '>': 'gt', '&': 'amp', "'": 'apos', '"': 'quot' }[c]};`)

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

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8')

const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

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

  const outDir = path.join(dist, route.path.replace(/^\//, ''))
  await fs.mkdir(outDir, { recursive: true })
  await fs.writeFile(path.join(outDir, 'index.html'), html, 'utf8')
  console.log(`${route.path.padEnd(30)}${route.title}`)
}
