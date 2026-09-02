import { createServer } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const OG_WIDTH = 1200
const OG_HEIGHT = 630

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')

async function card(source, outputName) {
  const output = path.join(publicDir, outputName)
  const { width, height } = await sharp(source).metadata()
  await sharp(source)
    .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 88, chromaSubsampling: '4:4:4' })
    .toFile(output)
  console.log(`${outputName.padEnd(24)} 1200x630  (from ${path.basename(source)} ${width}x${height})`)
}

await card(path.join(root, 'src/assets/homepage.webp'), 'og.jpg')

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
    await card(path.join(root, first.src.replace(/^\//, '')), `og-${project.slug}.jpg`)
  }
} finally {
  await server.close()
}
