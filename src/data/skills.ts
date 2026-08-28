// Yetenekler content. NOTHING here is invented: every entry already appears
// either in the owner's own Hakkımda copy (src/data/about.ts) or in a
// project's verified technology list (src/data/projects/<slug>.ts, itself
// sourced from that project's GitHub repo). The grouping and the group names
// are editorial - the facts are not.
//
// The group headings are ENGLISH by the owner's explicit request, and are the
// one deliberate exception to the Turkish-copy rule in CLAUDE.md. They read as
// stack labels next to entries that are themselves English product names
// (ASP.NET Core, Entity Framework Core), which is why the mixed language is
// intentional here and nowhere else. The section heading stays "Yetenekler".
//
// Deliberately NO proficiency levels, percentages, star ratings or "years of
// experience" numbers. There is no owner-supplied figure for any of those, so
// a bar reading "C# 85%" would be a number this repo made up - exactly what
// CLAUDE.md's no-fabrication rule forbids. A grouped list says the true thing
// (these are the tools actually used) without asserting a false one.
export type SkillGroup = {
  id: string
  heading: string
  items: readonly string[]
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'languages',
    heading: 'Languages & Frameworks',
    items: ['C#', '.NET', 'ASP.NET Core', 'TypeScript', 'React'],
  },
  {
    id: 'architecture',
    heading: 'Architecture & Patterns',
    items: [
      'Clean Architecture',
      'Vertical Slice Architecture',
      'CQRS',
      'MediatR',
      'Transactional Outbox',
    ],
  },
  {
    id: 'data',
    heading: 'Data & Caching',
    items: ['PostgreSQL', 'Entity Framework Core', 'Redis', 'HybridCache'],
  },
  {
    id: 'messaging',
    heading: 'Messaging & Background Jobs',
    items: ['RabbitMQ', 'MassTransit', 'SignalR', 'Hangfire'],
  },
  {
    id: 'frontend',
    heading: 'Frontend',
    items: ['Vite', 'Tailwind CSS', 'Zustand', 'React Router', 'Axios'],
  },
  {
    id: 'quality',
    heading: 'Testing & DevOps',
    items: [
      'xUnit',
      'Testcontainers',
      'Playwright',
      'Vitest',
      'Docker',
      'GitHub Actions',
      'Git',
    ],
  },
]
