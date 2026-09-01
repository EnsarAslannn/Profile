// Builds the social-preview cards in public/ - public/og.jpg for the site and
// public/og-<slug>.jpg for each project.
//
// These are the ONLY images a shared link ever shows. RouteMeta sets og:image
// per route at runtime, but LinkedIn, X, Slack and WhatsApp read the raw HTML
// response and never execute JavaScript, so what counts is the tag baked into
// the static file (index.html, and the per-route copies
// scripts/build-seo-files.mjs writes). A hashed bundle URL cannot be written
// into a static file, which is why these are build artefacts in public/ with
// stable names instead of imports.
//
// Two deliberate departures from how the site uses its own images:
//
//   JPEG, not WebP. The audience here is other people's crawlers, and
//   LinkedIn and WhatsApp still will not render a WebP preview - a WebP
//   og:image shows as no image at all, which is the exact failure this whole
//   exercise is meant to remove.
//
//   A project card comes from its first SCREENSHOT, not from its cover. The
//   card slot is a fixed 1.91:1; covers are shaped for the mosaic's cell
//   geometry and run 0.74, 0.99 and 1.52, so cropping one into a card throws
//   most of it away. Screenshots are ~1.82:1 by contract
//   (PROJECT_IMAGE_WIDTH/HEIGHT), so they lose about 5% of their width and
//   nothing else.
//
// Re-run after re-shooting the README hero screenshot or changing a project's
// first screenshot; a card showing the previous look is worse than none.
//
//   node scripts/make-og-image.mjs
import { createServer } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

// Facebook, LinkedIn and X all read 1200x630 (1.91:1) as a large summary card.
const OG_WIDTH = 1200
const OG_HEIGHT = 630

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')

/**
 * Writes one card.
 *
 * `position: 'top'` rather than a centred crop: on the site screenshot the
 * wordmark, the role sentence and the buttons are all in the upper band, and
 * centring cuts the name in half. On a project screenshot the ratios are close
 * enough that it barely crops at all.
 */
async function card(source, outputName) {
  const output = path.join(publicDir, outputName)
  const { width, height } = await sharp(source).metadata()
  await sharp(source)
    .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 88, chromaSubsampling: '4:4:4' })
    .toFile(output)
  console.log(`${outputName.padEnd(24)} 1200x630  (from ${path.basename(source)} ${width}x${height})`)
}

// The site card is the README's hero screenshot - so there is one picture of
// the site to keep current instead of two.
await card(path.join(root, 'src/assets/homepage.webp'), 'og.jpg')

// Project cards. The slugs and screenshot order are read out of src/data
// through Vite's own module loader rather than listed here, because
// src/data/projects reaches import.meta.glob and because a hand-written list
// is exactly the thing that stops matching after a fourth project is added.
const server = await createServer({
  root,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})
try {
  const { PROJECTS } = await server.ssrLoadModule('/src/data/projects/index.ts')
  for (const project of PROJECTS.tr) {
    const first = project.screens[0]
    if (!first) throw new Error(`${project.slug} has no screenshots to build a card from`)
    // screens[].src is a dev-server path (/src/assets/<slug>/<name>.webp),
    // which is also the file's real location on disk.
    await card(path.join(root, first.src.replace(/^\//, '')), `og-${project.slug}.jpg`)
  }
} finally {
  await server.close()
}
