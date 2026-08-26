// Converts project screenshots to web-sized WebP.
//
// Source screenshots come off a 2560px-wide display at 1-3 MB each, but the
// content column never exceeds ~1280 CSS px, so shipping the originals wastes
// roughly an order of magnitude of bandwidth on the page's LCP image.
//
// Usage (from the repo root):
//   node scripts/optimize-images.mjs            # convert, keep the PNGs
//   node scripts/optimize-images.mjs --delete   # convert, then delete the PNGs
//
// Quality was chosen by measuring PSNR against the losslessly-downscaled
// original: q=75 -> 42.3 dB, q=88 -> 45.4 dB, q=94 -> 46.7 dB. Anything above
// ~40 dB is considered visually lossless; 90 keeps fine UI text crisp while
// still cutting the largest file from 3354 KB to well under 100 KB.
import { readdir, stat, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ASSETS_DIR = 'src/assets'
const TARGET_WIDTH = 1600
const QUALITY = 90
const DELETE_ORIGINALS = process.argv.includes('--delete')

// The profile photo lives at the root of src/assets (not in a project folder)
// and is portrait, rendered at most ~384 CSS px wide in the sticky card, so it
// gets its own narrower target: 800px still covers a 2x display.
const PROFILE_SOURCE = 'src/assets/ea.jpg'
const PROFILE_TARGET = 'src/assets/ea.webp'
const PROFILE_TARGET_WIDTH = 640
// Photographs tolerate more compression than UI screenshots, and the card
// never renders wider than ~320 CSS px, so 640px at q80 is 2x coverage.
const PROFILE_QUALITY = 80

async function psnrAgainstOriginal(sourcePath, webpBuffer) {
  const reference = await sharp(sourcePath)
    .resize({ width: TARGET_WIDTH })
    .removeAlpha()
    .raw()
    .toBuffer()
  const decoded = await sharp(webpBuffer).removeAlpha().raw().toBuffer()
  if (decoded.length !== reference.length) return null

  let squaredError = 0
  for (let i = 0; i < reference.length; i++) {
    const delta = reference[i] - decoded[i]
    squaredError += delta * delta
  }
  const mse = squaredError / reference.length
  return mse === 0 ? Infinity : 10 * Math.log10(65025 / mse)
}

const folders = (await readdir(ASSETS_DIR, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

let totalBefore = 0
let totalAfter = 0
let worstPsnr = Infinity

for (const folder of folders) {
  const dir = path.join(ASSETS_DIR, folder)
  const pngs = (await readdir(dir)).filter((file) => file.endsWith('.png'))

  for (const png of pngs) {
    const sourcePath = path.join(dir, png)
    const targetPath = sourcePath.replace(/\.png$/, '.webp')

    const buffer = await sharp(sourcePath)
      .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer()

    const { width, height } = await sharp(buffer).metadata()
    const psnr = await psnrAgainstOriginal(sourcePath, buffer)
    if (psnr !== null && psnr < worstPsnr) worstPsnr = psnr

    await writeFile(targetPath, buffer)

    const before = (await stat(sourcePath)).size
    const after = (await stat(targetPath)).size
    totalBefore += before
    totalAfter += after

    const psnrLabel = psnr === null ? 'n/a' : `${psnr.toFixed(1)} dB`
    console.log(
      `${folder}/${png.padEnd(20)} ${String(Math.round(before / 1024)).padStart(5)} KB -> ` +
        `${String(Math.round(after / 1024)).padStart(4)} KB  ${width}x${height}  PSNR ${psnrLabel}`,
    )

    if (DELETE_ORIGINALS) await unlink(sourcePath)
  }
}

const pct = (100 * (1 - totalAfter / totalBefore)).toFixed(1)
console.log(
  `\ntotal ${(totalBefore / 1024 / 1024).toFixed(1)} MB -> ${(totalAfter / 1024 / 1024).toFixed(2)} MB (-${pct}%)`,
)
console.log(`worst PSNR across all images: ${worstPsnr.toFixed(1)} dB (>40 dB is visually lossless)`)
if (DELETE_ORIGINALS) console.log('original PNGs deleted')

// --- Profile photo -----------------------------------------------------------
try {
  const before = (await stat(PROFILE_SOURCE)).size
  const buffer = await sharp(PROFILE_SOURCE)
    .resize({ width: PROFILE_TARGET_WIDTH, withoutEnlargement: true })
    .webp({ quality: PROFILE_QUALITY })
    .toBuffer()
  const { width, height } = await sharp(buffer).metadata()

  const reference = await sharp(PROFILE_SOURCE)
    .resize({ width: PROFILE_TARGET_WIDTH })
    .removeAlpha()
    .raw()
    .toBuffer()
  const decoded = await sharp(buffer).removeAlpha().raw().toBuffer()
  let squaredError = 0
  for (let i = 0; i < reference.length; i++) {
    const delta = reference[i] - decoded[i]
    squaredError += delta * delta
  }
  const psnr = 10 * Math.log10(65025 / (squaredError / reference.length))

  await writeFile(PROFILE_TARGET, buffer)
  const after = (await stat(PROFILE_TARGET)).size
  console.log(
    `\nprofile ea.jpg ${Math.round(before / 1024)} KB -> ${Math.round(after / 1024)} KB ` +
      `${width}x${height}  PSNR ${psnr.toFixed(1)} dB`,
  )
  console.log(`  -> update width/height in src/components/ProfileCard.tsx to ${width}x${height}`)
  if (DELETE_ORIGINALS) await unlink(PROFILE_SOURCE)
} catch (error) {
  if (error.code !== 'ENOENT') throw error
  console.log('\nprofile photo already converted (no src/assets/ea.jpg)')
}
