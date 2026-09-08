import type { Localized } from '../i18n/language'
import { SITE_GROUP, srcSetFor } from './imageSrcSet'
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

export type TimelinePhoto = {
  src: string
  width: number
  height: number
  srcSet: string | undefined
}

export type RoadmapEntry = ResumeEntry & {
  kind: string
  year: string
  photo?: TimelinePhoto
}

const timelinePhoto = (
  year: string,
  src: string,
  width: number,
  height: number,
): TimelinePhoto => ({
  src,
  width,
  height,
  srcSet: srcSetFor(`${SITE_GROUP}/${year}`, { src, width }),
})

const PHOTOS: Record<string, TimelinePhoto> = {
  '2020': timelinePhoto('2020', photo2020, 1040, 778),
  '2023': timelinePhoto('2023', photo2023, 614, 767),
  '2024': timelinePhoto('2024', photo2024, 574, 767),
  '2025': timelinePhoto('2025', photo2025, 1200, 654),
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
