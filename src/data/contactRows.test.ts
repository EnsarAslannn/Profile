import { describe, expect, it } from 'vitest'
import { CONTACT_ROWS } from './contactRows'
import { CONTACT_ITEMS } from './contact'
import { SOCIAL_LINKS } from './social'

describe('CONTACT_ROWS.tr', () => {
  it('lists the four rows in the owner-specified order', () => {
    expect(CONTACT_ROWS.tr.map((row) => row.id)).toEqual([
      'email',
      'linkedin',
      'github',
      'location',
    ])
    expect(CONTACT_ROWS.tr.map((row) => row.label)).toEqual([
      'E-posta',
      'LinkedIn',
      'GitHub',
      'Konum',
    ])
  })

  it('derives every href and value from the existing contact and social data', () => {
    const email = CONTACT_ROWS.tr.find((row) => row.id === 'email')!
    expect(email.value).toBe(CONTACT_ITEMS.tr.find((item) => item.id === 'email')!.value)
    expect(email.href).toBeNull()
    expect(email.copyable).toBe(true)
    expect(CONTACT_ITEMS.tr.find((item) => item.id === 'email')!.href).toBe(
      'mailto:ensaraslannn@gmail.com',
    )

    const location = CONTACT_ROWS.tr.find((row) => row.id === 'location')!
    expect(location.value).toBe(CONTACT_ITEMS.tr.find((item) => item.id === 'location')!.value)
    expect(location.href).toBeNull()

    for (const id of ['linkedin', 'github']) {
      const row = CONTACT_ROWS.tr.find((r) => r.id === id)!
      const social = SOCIAL_LINKS.tr.find((s) => s.id === id)!
      expect(row.href).toBe(social.href)
      expect(new URL(social.href).pathname).toContain(row.value.replace(/^@/, ''))
      expect(row.value).not.toContain('http')
      expect(row.value).not.toContain('.com')
    }
    expect(CONTACT_ROWS.tr.find((row) => row.id === 'linkedin')!.value).toBe('/in/ensaraslannn')
    expect(CONTACT_ROWS.tr.find((row) => row.id === 'github')!.value).toBe('@EnsarAslannn')
  })

  it('states the location and the remote note the owner supplied', () => {
    const location = CONTACT_ROWS.tr.find((row) => row.id === 'location')!
    expect(location.value).toBe('Türkiye / Kocaeli / İstanbul')
    expect(location.note).toBe('Remote çalışmaya açığım.')
  })

  it('marks only the profile rows as external', () => {
    expect(CONTACT_ROWS.tr.filter((row) => row.external).map((row) => row.id)).toEqual([
      'linkedin',
      'github',
    ])
  })

  it('tags the English brand labels, and only those', () => {
    expect(CONTACT_ROWS.tr.filter((row) => row.lang === 'en').map((row) => row.id)).toEqual([
      'linkedin',
      'github',
    ])
  })

  it('still leaves the phone number out', () => {
    expect(CONTACT_ROWS.tr.some((row) => row.id === 'phone')).toBe(false)
    expect(CONTACT_ROWS.tr.some((row) => row.href?.startsWith('tel:'))).toBe(false)
  })
})
