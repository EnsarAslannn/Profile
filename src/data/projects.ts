// Content here is owner-supplied and verbatim (Turkish project copy). Do not
// edit, embellish, or add fields (tech-stack chips, dates, repo links) without
// the owner - see CLAUDE.md's no-fabrication rule.
import { getProjectImages, type ProjectImage } from './projectImages'

export type Project = {
  slug: string
  title: string
  subtitle: string
  description: string
  images: ProjectImage[]
}

type ProjectInput = {
  slug: string
  title: string
  subtitle: string
  description: string
  imageOrder: readonly string[]
}

// Array order is the GRID DISPLAY order on the home page. Route lookup is by
// slug (getProjectBySlug), so reordering here never affects any URL.
//
// The asset folder name under src/assets/ equals `slug` - one identifier,
// one thing to get right when adding a project. See "Adding a project" in
// CLAUDE.md.
const PROJECT_INPUTS: ProjectInput[] = [
  {
    slug: 'takeauction',
    title: 'TakeAuction',
    subtitle: 'Gerçek Zamanlı Açık Artırma Sistemi',
    description:
      'Gerçek zamanlı, yüksek trafikli bir online açık artırma sistemi. .NET ve Vertical Slice Architecture ile geliştirildi, PostgreSQL üzerinde çalışıyor. RabbitMQ ile olay tabanlı mesajlaşma, Hangfire ile otomatik lot kapanışı, SignalR ile anlık teklif bildirimleri sağlandı. JWT ile kimlik doğrulama yapıldı; xUnit, Testcontainers ve Playwright ile test edildi, Docker ve GitHub Actions ile CI/CD sürecine entegre edildi.',
    imageOrder: ['homePage', 'homePage2'],
  },
  {
    slug: 'altitudelog',
    title: 'AltitudELog',
    subtitle: 'Uçuş & Mürettebat Yönetim Sistemi',
    description:
      'Pilotların uçuş kaydı tutup mürettebat atayabildiği bir uçuş ve mürettebat yönetim sistemi. Clean Architecture ve CQRS (MediatR) prensipleriyle, .NET ve PostgreSQL üzerinde geliştirildi. Hangfire ile arka planda çalışan işler sayesinde dış hava durumu servisinden otomatik veri entegrasyonu yapıldı, Redis ile önbellekleme uygulandı. JWT ile rol bazlı yetkilendirme sağlandı; xUnit ve Testcontainers ile test edildi, Docker üzerinden CI/CD sürecine entegre edilip canlıya alındı.',
    imageOrder: ['homePage', 'homePage2'],
  },
  {
    slug: 'dolfin',
    title: 'DOLFIN',
    subtitle: 'Finansal Portföy Yönetim Platformu',
    description:
      'Kullanıcıların sanal cüzdanla hisse senedi alıp satabildiği full-stack bir finansal portföy yönetim platformu. .NET ve PostgreSQL ile geliştirildi. JWT ve CSRF korumalı kimlik doğrulama ile güvenli kullanıcı girişi sağlandı, Redis ile performans artırıcı önbellekleme yapıldı. xUnit ve Playwright ile test edildi, Docker ve GitHub Actions ile CI/CD sürecine entegre edildi.',
    imageOrder: ['homePage', 'homePage2'],
  },
]

export const PROJECTS: Project[] = PROJECT_INPUTS.map((input) => ({
  slug: input.slug,
  title: input.title,
  subtitle: input.subtitle,
  description: input.description,
  images: getProjectImages(input.slug, input.imageOrder),
}))

export function getProjectBySlug(slug: string | undefined): Project | undefined {
  if (!slug) return undefined
  return PROJECTS.find((project) => project.slug === slug)
}
