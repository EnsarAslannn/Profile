const VARIANT_MODULES = import.meta.glob<string>('../assets/responsive/*/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

export const SITE_GROUP = 'site'

type Variant = {
  src: string
  width: number
}

function collectVariants(): Record<string, Variant[]> {
  const grouped: Record<string, Variant[]> = {}

  for (const [path, src] of Object.entries(VARIANT_MODULES)) {
    const match = /\.\.\/assets\/responsive\/([^/]+)\/(.+)-(\d+)w\.webp$/.exec(path)
    if (!match) continue

    const [, group, name, width] = match
    const key = `${group}/${name}`
    grouped[key] ??= []
    grouped[key].push({ src, width: Number(width) })
  }

  for (const variants of Object.values(grouped)) {
    variants.sort((a, b) => a.width - b.width)
  }

  return grouped
}

const VARIANTS = collectVariants()

export function srcSetFor(key: string, original: Variant): string | undefined {
  const variants = VARIANTS[key]
  if (!variants) return undefined

  const candidates = [
    ...variants.filter((variant) => variant.width < original.width),
    original,
  ]
  if (candidates.length < 2) return undefined

  return candidates.map((variant) => `${variant.src} ${variant.width}w`).join(', ')
}
