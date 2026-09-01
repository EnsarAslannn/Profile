import { describe, expect, it } from 'vitest'
import { pickActiveSection } from './useActiveSection'

// The decision is tested and the measuring is not, on purpose: jsdom has no
// layout, so every getBoundingClientRect it reports is zero and a test driving
// the real hook would be asserting against a fiction. Splitting the pure
// choice out is what makes the interesting half checkable at all - the
// measuring half is verified in a browser instead.
//
// Tops are viewport-relative, so a section already scrolled past has a
// NEGATIVE top. The line is a pixel offset from the top of the viewport.
const LINE = 300

describe('pickActiveSection', () => {
  it('picks the last section whose top has crossed the line', () => {
    const tops = [
      { anchor: 'anasayfa', top: -1200 },
      { anchor: 'hakkimda', top: -400 },
      { anchor: 'projeler', top: 120 }, // crossed
      { anchor: 'ozgecmis', top: 900 }, // not yet
    ]
    expect(pickActiveSection(tops, LINE, false)).toBe('projeler')
  })

  // The ambiguity the line exists to resolve: two sections on screen at once.
  // The one most recently scrolled INTO wins, not the one taking up more room.
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

  // On a tall viewport the closing section's top never crosses the line -
  // there is not enough document left to scroll it up that far - so without
  // this clamp the underline sits on Stacks while the reader is looking at
  // İletişim, and nothing they can do will move it.
  it('gives the last section to a reader at the end of the document', () => {
    const tops = [
      { anchor: 'yetenekler', top: -200 },
      { anchor: 'iletisim', top: 610 },
    ]
    expect(pickActiveSection(tops, LINE, false)).toBe('yetenekler')
    expect(pickActiveSection(tops, LINE, true)).toBe('iletisim')
  })

  // Tracking is off: the navbar passes an empty list on every route but the
  // home page, where its links navigate away rather than describing where the
  // reader is.
  it('returns null when there is nothing to track', () => {
    expect(pickActiveSection([], LINE, false)).toBeNull()
    expect(pickActiveSection([], LINE, true)).toBeNull()
  })

  // Only reachable through overscroll, but it must not return null and blank
  // the underline mid-gesture.
  it('falls back to the first section when nothing has crossed the line', () => {
    const tops = [
      { anchor: 'anasayfa', top: 500 },
      { anchor: 'hakkimda', top: 1300 },
    ]
    expect(pickActiveSection(tops, LINE, false)).toBe('anasayfa')
  })
})
