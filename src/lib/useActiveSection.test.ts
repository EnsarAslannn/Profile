import { describe, expect, it } from 'vitest'
import { pickActiveSection } from './useActiveSection'

const LINE = 300

describe('pickActiveSection', () => {
  it('picks the last section whose top has crossed the line', () => {
    const tops = [
      { anchor: 'anasayfa', top: -1200 },
      { anchor: 'hakkimda', top: -400 },
      { anchor: 'projeler', top: 120 },
      { anchor: 'ozgecmis', top: 900 },
    ]
    expect(pickActiveSection(tops, LINE, false)).toBe('projeler')
  })

  it('prefers the newer section when two are visible', () => {
    const tops = [
      { anchor: 'projeler', top: -800 },
      { anchor: 'ozgecmis', top: 250 },
    ]
    expect(pickActiveSection(tops, LINE, false)).toBe('ozgecmis')
  })

  it('holds the previous section until the next one reaches the line', () => {
    const tops = [
      { anchor: 'projeler', top: -800 },
      { anchor: 'ozgecmis', top: 301 },
    ]
    expect(pickActiveSection(tops, LINE, false)).toBe('projeler')
  })

  it('marks the first section at the top of the page', () => {
    const tops = [
      { anchor: 'anasayfa', top: 0 },
      { anchor: 'hakkimda', top: 800 },
    ]
    expect(pickActiveSection(tops, LINE, false)).toBe('anasayfa')
  })

  it('gives the last section to a reader at the end of the document', () => {
    const tops = [
      { anchor: 'yetenekler', top: -200 },
      { anchor: 'iletisim', top: 610 },
    ]
    expect(pickActiveSection(tops, LINE, false)).toBe('yetenekler')
    expect(pickActiveSection(tops, LINE, true)).toBe('iletisim')
  })

  it('returns null when there is nothing to track', () => {
    expect(pickActiveSection([], LINE, false)).toBeNull()
    expect(pickActiveSection([], LINE, true)).toBeNull()
  })

  it('falls back to the first section when nothing has crossed the line', () => {
    const tops = [
      { anchor: 'anasayfa', top: 500 },
      { anchor: 'hakkimda', top: 1300 },
    ]
    expect(pickActiveSection(tops, LINE, false)).toBe('anasayfa')
  })
})
