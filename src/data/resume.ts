import photo2020 from '../assets/2020.webp'
import photo2023 from '../assets/2023.webp'
import photo2024 from '../assets/2024.webp'
import photo2025 from '../assets/2025.webp'

// Owner-supplied Özgeçmiş content, verbatim. Lives here rather than at the
// top of Resume.tsx so it can be unit-tested (including the date-format
// helper) without rendering, matching the src/data/about.ts precedent.
export type ResumeEntry = {
  id: string
  title: string
  organization: string
  start: string
  end: string
}

export type ResumeGroup = {
  id: string
  heading: string
  entries: ResumeEntry[]
}

export const RESUME_GROUPS: ResumeGroup[] = [
  {
    id: 'education',
    heading: 'Eğitim',
    entries: [
      {
        id: 'karabuk-bm',
        title: 'Bilgisayar Mühendisliği (%100 İngilizce)',
        organization: 'Karabük Üniversitesi',
        start: '08/2020',
        end: '08/2025',
      },
      {
        id: 'bielsko-erasmus',
        title: 'Computer Science - Erasmus+ Program',
        organization: 'University of Bielsko-Biala',
        start: '02/2023',
        end: '06/2023',
      },
    ],
  },
  {
    id: 'experience',
    heading: 'Deneyim',
    entries: [
      {
        id: 'brisa-staj',
        title: 'Stajyer',
        organization: 'Brisa Bridgestone Sabancı Lastik Sanayi ve Ticaret A.Ş.',
        start: '08/2024',
        end: '09/2024',
      },
      {
        id: 'azr-staj',
        title: 'Stajyer',
        organization: 'AZR Bilişim Eğitim Mühendislik ve Danışmanlık',
        start: '06/2025',
        end: '07/2025',
      },
    ],
  },
]

// 'MM/YYYY' -> 'YYYY-MM', the machine-readable form required by <time datetime>.
export function toMachineDate(value: string): string {
  const [month, year] = value.split('/')
  return `${year}-${month}`
}

// The Roadmap view of the same data (example.mp4 redesign). The reference
// design is one chronological spine with cards alternating left and right, so
// the two groups are flattened and re-sorted by start date instead of being
// rendered as two columns. Nothing is added: `year` is derived from `start`
// and `kind` is the group's own heading, which becomes the card's chip. The
// reference cards also carry a prose paragraph - this site's entries
// deliberately have none, because the owner had the internship descriptions
// removed (five-owner-changes), and inventing replacements is exactly what
// CLAUDE.md's no-fabrication rule forbids.
export type RoadmapEntry = ResumeEntry & {
  kind: string
  year: string
  // Owner-supplied photo behind the card, keyed by year below. A year with no
  // photo simply renders a plain card - the background is decoration, and the
  // component must not assume one exists. Dimensions are the true measured
  // WebP sizes, per CLAUDE.md's images rule.
  background?: { src: string; width: number; height: number }
}

// Keyed by year rather than by entry id or array position, so reordering the
// groups or renaming an entry cannot silently pair 2024's card with 2025's
// photograph.
const BACKGROUNDS: Record<string, { src: string; width: number; height: number }> = {
  '2020': { src: photo2020, width: 1040, height: 778 },
  '2023': { src: photo2023, width: 614, height: 767 },
  '2024': { src: photo2024, width: 574, height: 767 },
  '2025': { src: photo2025, width: 1200, height: 654 },
}

export const ROADMAP_ENTRIES: RoadmapEntry[] = RESUME_GROUPS.flatMap((group) =>
  group.entries.map((entry) => ({
    ...entry,
    kind: group.heading,
    year: entry.start.split('/')[1],
    background: BACKGROUNDS[entry.start.split('/')[1]],
  })),
).sort((a, b) => toMachineDate(a.start).localeCompare(toMachineDate(b.start)))
