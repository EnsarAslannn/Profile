import { describe, expect, it } from 'vitest'
import { NAV_LINKS } from './navigation'

describe('NAV_LINKS', () => {
  it('every anchor is lowercase ASCII with no diacritics, uppercase letters, or spaces', () => {
    for (const link of NAV_LINKS) {
      expect(link.anchor).toMatch(/^[a-z]+$/)
    }
  })

  it('every label is non-empty', () => {
    for (const link of NAV_LINKS) {
      expect(link.label.length).toBeGreaterThan(0)
    }
  })

  it('anchors are unique', () => {
    const anchors = NAV_LINKS.map((link) => link.anchor)
    expect(new Set(anchors).size).toBe(anchors.length)
  })
})
