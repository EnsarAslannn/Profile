import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'

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
