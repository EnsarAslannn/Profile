import { describe, expect, it } from 'vitest'
import { RESUME_GROUPS, toMachineDate } from './resume'

describe('resume data', () => {
  it('exposes the two groups in owner order', () => {
    expect(RESUME_GROUPS.tr.map((g) => g.id)).toEqual(['education', 'experience'])
    expect(RESUME_GROUPS.tr.map((g) => g.heading)).toEqual(['Eğitim', 'Deneyim'])
  })

  it('lists education entries verbatim in owner order', () => {
    const education = RESUME_GROUPS.tr.find((g) => g.id === 'education')!
    expect(education.entries).toEqual([
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
    ])
  })

  it('lists experience entries verbatim in owner order', () => {
    const experience = RESUME_GROUPS.tr.find((g) => g.id === 'experience')!
    expect(experience.entries).toEqual([
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
    ])
  })

  it('uses stable non-numeric ids that are unique across all groups', () => {
    const ids = RESUME_GROUPS.tr.flatMap((g) => g.entries.map((e) => e.id))
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) {
      expect(id).not.toMatch(/^\d+$/)
    }
  })

  it('converts an MM/YYYY display date to a machine month', () => {
    expect(toMachineDate('08/2020')).toBe('2020-08')
    expect(toMachineDate('02/2023')).toBe('2023-02')
  })
})
