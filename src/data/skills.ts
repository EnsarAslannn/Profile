// Yetenekler content. NOTHING here is invented: every entry already appears
// either in the owner's own Hakkımda copy (src/data/about.ts) or in a
// project's verified technology list (src/data/projects/<slug>.ts, itself
// sourced from that project's GitHub repo). The grouping and the group names
// are editorial - the facts are not.
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

export const SKILLS_INTRO =
  'Aşağıdaki teknolojileri hobi düzeyinde değil, bu sayfada yer alan projelerin içinde uçtan uca kullandım.'

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'languages',
    heading: 'Diller & Çatılar',
    items: ['C#', '.NET', 'ASP.NET Core', 'TypeScript', 'React'],
  },
  {
    id: 'architecture',
    heading: 'Mimari & Desenler',
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
    heading: 'Veri & Önbellek',
    items: ['PostgreSQL', 'Entity Framework Core', 'Redis', 'HybridCache'],
  },
  {
    id: 'messaging',
    heading: 'Mesajlaşma & Arka Plan',
    items: ['RabbitMQ', 'MassTransit', 'SignalR', 'Hangfire'],
  },
  {
    id: 'frontend',
    heading: 'Frontend Araçları',
    items: ['Vite', 'Tailwind CSS', 'Zustand', 'React Router', 'Axios'],
  },
  {
    id: 'quality',
    heading: 'Test & DevOps',
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
