export type SkillGroup = {
  id: string
  heading: string
  items: readonly string[]
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'languages',
    heading: 'Languages & Frameworks',
    items: ['C#', '.NET', 'TypeScript', 'React'],
  },
  {
    id: 'architecture',
    heading: 'Architecture & Patterns',
    items: ['Clean Architecture', 'Vertical Slice Architecture', 'CQRS', 'MediatR'],
  },
  {
    id: 'data',
    heading: 'Data & Caching',
    items: ['PostgreSQL', 'Entity Framework Core', 'Redis'],
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
