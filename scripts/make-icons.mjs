// Builds the raster icons in public/ from public/favicon.svg.
//
// The SVG is the source of truth and covers every modern browser tab on its
// own. These PNGs exist for the two places an SVG icon is still not accepted:
// iOS/iPadOS home-screen bookmarks (apple-touch-icon), and the web app
// manifest, whose `icons` array browsers read as raster.
//
// They are flattened onto the monogram's own deep green rather than left
// transparent. iOS composites an apple-touch-icon over WHITE and then applies
// its own rounded mask, so a transparent tile would put white triangles in
// the corners of a rounded-square mark that already has its own radius.
//
//   node scripts/make-icons.mjs
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'

// The monogram's ground - #17352d, the same deep green the dark bands use.
const BACKGROUND = { r: 0x17, g: 0x35, b: 0x2d, alpha: 1 }

const TARGETS = [
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
]

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.join(root, 'public/favicon.svg')

for (const { file, size } of TARGETS) {
  const output = path.join(root, 'public', file)
  await sharp(source, { density: 384 })
    .resize(size, size, { fit: 'contain', background: BACKGROUND })
    .flatten({ background: BACKGROUND })
    .png({ compressionLevel: 9 })
    .toFile(output)
  console.log(`${file}  ${size}x${size}`)
}
