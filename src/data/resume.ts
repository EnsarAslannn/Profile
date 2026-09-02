import type { Localized } from '../i18n/language'
import photo2020 from '../assets/2020.webp'
import photo2023 from '../assets/2023.webp'
import photo2024 from '../assets/2024.webp'
import photo2025 from '../assets/2025.webp'

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

export function toMachineDate(value: string): string {
  const [month, year] = value.split('/')
  return `${year}-${month}`
}

export type RoadmapEntry = ResumeEntry & {
  kind: string
  year: string
  photo?: { src: string; width: number; height: number }
}

const PHOTOS: Record<string, { src: string; width: number; height: number }> = {
  '2020': { src: photo2020, width: 1040, height: 778 },
  '2023': { src: photo2023, width: 614, height: 767 },
  '2024': { src: photo2024, width: 574, height: 767 },
  '2025': { src: photo2025, width: 1200, height: 654 },
}

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
