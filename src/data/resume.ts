// Owner-supplied Özgeçmiş content, verbatim. Lives here rather than at the
// top of Resume.tsx so it can be unit-tested (including the date-format
// helper) without rendering, matching the src/data/about.ts precedent.
export type ResumeEntry = {
  id: string
  title: string
  organization: string
  start: string
  end: string
  description?: string
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
        description:
          'Üretim sektöründeki kurumsal yazılım geliştirme süreçleri gözlemlenerek toplantılara katılım sağlandı. Agile iş akışları ve proje yönetimi metodolojilerinin analiz edilmesine katkı sağlandı.',
      },
      {
        id: 'azr-staj',
        title: 'Stajyer',
        organization: 'AZR Bilişim Eğitim Mühendislik ve Danışmanlık',
        start: '06/2025',
        end: '07/2025',
        description:
          'Uzaktan çalışma modelinde; ekip proje planlama ve yazılım geliştirme süreçlerinde aktif görev alındı.',
      },
    ],
  },
]

// 'MM/YYYY' -> 'YYYY-MM', the machine-readable form required by <time datetime>.
export function toMachineDate(value: string): string {
  const [month, year] = value.split('/')
  return `${year}-${month}`
}
