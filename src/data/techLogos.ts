// Brand logos for the Stacks section, supplied by the owner as SVGs in
// src/assets/icons/.
//
// Globbed as URLs rather than imported one by one, the same way
// src/data/projectImages.ts collects screenshots: Vite hashes and copies each
// file, and a missing entry surfaces here at module load rather than as a
// broken image on the page.
const FILES = import.meta.glob('../assets/icons/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

// Glob keys are full relative paths; the map below is keyed by basename so a
// logo can be named without repeating '../assets/icons/' thirteen times.
const byName = new Map(
  Object.entries(FILES).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1), url]),
)

const logo = (file: string): string => {
  const url = byName.get(file)
  if (!url) throw new Error(`Missing logo: src/assets/icons/${file}`)
  return url
}

// Exact technology names, never substrings: "React Router" must not pick up
// the React logo, and "GitHub Actions" is the only thing the Octocat stands
// for here.
//
// react-light.svg replaced an earlier react-native-1.svg, which carried the
// words "React Native" as part of the artwork and was left unused for that
// reason - this site is React, and a logo that names a different framework
// would have made the page claim one. The replacement is the plain atom, in
// React's dark teal (#087EA4), which is the variant meant for light grounds.
export const TECH_LOGOS: Record<string, string> = {
  'C#': logo('c--4.svg'),
  '.NET': logo('netframework-1.svg'),
  TypeScript: logo('typescript.svg'),
  React: logo('react-light.svg'),
  PostgreSQL: logo('postgresql-inc-2.svg'),
  Redis: logo('redis.svg'),
  RabbitMQ: logo('rabbitmq.svg'),
  Vite: logo('vitejs.svg'),
  'Tailwind CSS': logo('tailwind-css-2.svg'),
  Axios: logo('axios.svg'),
  Docker: logo('docker-4.svg'),
  'GitHub Actions': logo('github-icon-1.svg'),
  Git: logo('git-icon.svg'),
}

/**
 * Group items so the ones carrying a logo come first (owner's request).
 *
 * Array.prototype.sort is stable, so everything else keeps the editorial order
 * src/data/skills.ts put it in - this only lifts the logo rows, it does not
 * shuffle the rest.
 */
export function logosFirst(items: readonly string[]): string[] {
  return [...items].sort((a, b) => Number(b in TECH_LOGOS) - Number(a in TECH_LOGOS))
}
