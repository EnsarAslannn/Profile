import type { Localized } from '../i18n/language'
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

// Ids and dates are identical across both languages - they are facts, not
// prose. Organisation names follow a narrower rule: each one uses the name
// that organisation uses for ITSELF in that language, which is not the same
// as translating it.
//
// Karabük Üniversitesi publishes in English as Karabük University, so the
// English entry says that. The two internship employers have no English
// trading name - "Brisa Bridgestone Sabancı Lastik Sanayi ve Ticaret A.Ş." is
// the registered name and the only string an English reader could look up -
// so those stay exactly as they are. Never invent an English name for an
// employer that does not publish one.
export const RESUME_GROUPS: Localized<ResumeGroup[]> = {
  tr: [
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
  ],
  en: [
    {
      id: 'education',
      heading: 'Education',
      entries: [
        {
          id: 'karabuk-bm',
          title: 'Computer Engineering (fully English-taught)',
          organization: 'Karabük University',
          start: '08/2020',
          end: '08/2025',
        },
        {
          id: 'bielsko-erasmus',
          title: 'Computer Science - Erasmus+ Programme',
          organization: 'University of Bielsko-Biala',
          start: '02/2023',
          end: '06/2023',
        },
      ],
    },
    {
      id: 'experience',
      heading: 'Experience',
      entries: [
        {
          id: 'brisa-staj',
          title: 'Intern',
          organization: 'Brisa Bridgestone Sabancı Lastik Sanayi ve Ticaret A.Ş.',
          start: '08/2024',
          end: '09/2024',
        },
        {
          id: 'azr-staj',
          title: 'Intern',
          organization: 'AZR Bilişim Eğitim Mühendislik ve Danışmanlık',
          start: '06/2025',
          end: '07/2025',
        },
      ],
    },
  ],
}

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
  // Owner-supplied photo for that year, keyed by year below. A year with no
  // photo simply renders a text-only card, so the component must not assume
  // one exists. Dimensions are the true measured WebP sizes, per CLAUDE.md's
  // images rule.
  //
  // It was called `background` while it really was one - a washed-out image
  // behind the card's text. The owner asked for the photographs at full
  // strength with the text beside them instead, so it is now an ordinary
  // photo in its own column and the name says so.
  photo?: { src: string; width: number; height: number }
}

// Keyed by year rather than by entry id or array position, so reordering the
// groups or renaming an entry cannot silently pair 2024's card with 2025's
// photograph.
const PHOTOS: Record<string, { src: string; width: number; height: number }> = {
  '2020': { src: photo2020, width: 1040, height: 778 },
  '2023': { src: photo2023, width: 614, height: 767 },
  '2024': { src: photo2024, width: 574, height: 767 },
  '2025': { src: photo2025, width: 1200, height: 654 },
}

// Derived from RESUME_GROUPS in both languages rather than written out
// twice, so the timeline can never disagree with the source it is a view of.
const toRoadmap = (groups: ResumeGroup[]): RoadmapEntry[] =>
  groups
    .flatMap((group) =>
      group.entries.map((entry) => ({
        ...entry,
        kind: group.heading,
        year: entry.start.split('/')[1],
        photo: PHOTOS[entry.start.split('/')[1]],
      })),
    )
    .sort((a, b) => toMachineDate(a.start).localeCompare(toMachineDate(b.start)))

export const ROADMAP_ENTRIES: Localized<RoadmapEntry[]> = {
  tr: toRoadmap(RESUME_GROUPS.tr),
  en: toRoadmap(RESUME_GROUPS.en),
}
