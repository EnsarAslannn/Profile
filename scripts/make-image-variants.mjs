import { mkdir, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ASSETS_DIR = 'src/assets'
const OUTPUT_DIR = path.join(ASSETS_DIR, 'responsive')
const ROOT_GROUP = 'site'
const WIDTHS = [400, 800]
const QUALITY = 80

const SKIP_GROUPS = new Set(['responsive', 'icons'])
const SKIP_ROOT_FILES = new Set(['homepage.webp', 'projects.webp', 'resume.webp'])

async function sources() {
  const entries = await readdir(ASSETS_DIR, { withFileTypes: true })
  const found = []

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.webp') && !SKIP_ROOT_FILES.has(entry.name)) {
      found.push({ group: ROOT_GROUP, file: path.join(ASSETS_DIR, entry.name) })
      continue
    }
    if (!entry.isDirectory() || SKIP_GROUPS.has(entry.name)) continue

    const files = (await readdir(path.join(ASSETS_DIR, entry.name))).filter((file) =>
      file.endsWith('.webp'),
    )
    for (const file of files) {
      found.push({ group: entry.name, file: path.join(ASSETS_DIR, entry.name, file) })
    }
  }

  return found
}

let written = 0
let totalBytes = 0

for (const { group, file } of await sources()) {
  const name = path.basename(file, '.webp')
  const source = sharp(file)
  const { width: sourceWidth } = await source.metadata()
  const outDir = path.join(OUTPUT_DIR, group)
  await mkdir(outDir, { recursive: true })

  for (const width of WIDTHS) {
    if (sourceWidth <= width) continue

    const target = path.join(outDir, `${name}-${width}w.webp`)
    const buffer = await sharp(file).resize({ width }).webp({ quality: QUALITY }).toBuffer()
    await writeFile(target, buffer)

    const size = (await stat(target)).size
    written += 1
    totalBytes += size
    console.log(
      `${`${group}/${name}`.padEnd(28)} ${String(sourceWidth).padStart(4)}w -> ` +
        `${String(width).padStart(4)}w  ${String(Math.round(size / 1024)).padStart(3)} KB`,
    )
  }
}

console.log(`\n${written} variants, ${(totalBytes / 1024).toFixed(0)} KB total`)
console.log(`written to ${OUTPUT_DIR}/<group>/<name>-<width>w.webp`)
