const FILES = import.meta.glob('../assets/icons/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const byName = new Map(
  Object.entries(FILES).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1), url]),
)

const logo = (file: string): string => {
  const url = byName.get(file)
  if (!url) throw new Error(`Missing logo: src/assets/icons/${file}`)
  return url
}

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

export function logosFirst(items: readonly string[]): string[] {
  return [...items].sort((a, b) => Number(b in TECH_LOGOS) - Number(a in TECH_LOGOS))
}
