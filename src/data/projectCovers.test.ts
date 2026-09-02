import { describe, expect, it } from 'vitest'
import { getProjectCover } from './projectCovers'

describe('getProjectCover', () => {
  it('returns a defined cover for each project slug with a non-empty src', () => {
    for (const slug of ['dolfin', 'takeauction', 'altitudelog']) {
      const cover = getProjectCover(slug)
      expect(cover).toBeDefined()
      expect(cover!.src.length).toBeGreaterThan(0)
    }
  })

  it('has the exact measured dimensions per project', () => {
    expect(getProjectCover('dolfin')).toMatchObject({ width: 1600, height: 2162 })
    expect(getProjectCover('takeauction')).toMatchObject({ width: 1375, height: 905 })
    expect(getProjectCover('altitudelog')).toMatchObject({ width: 1600, height: 1614 })
  })

  it('returns undefined for an unknown slug', () => {
    expect(getProjectCover('nosuchproject')).toBeUndefined()
  })

  it('the featured (index 0) project has a portrait cover; the others do not', () => {
    const dolfin = getProjectCover('dolfin')!
    const takeauction = getProjectCover('takeauction')!
    const altitudelog = getProjectCover('altitudelog')!

    expect(dolfin.height / dolfin.width).toBeGreaterThan(1)
    expect(takeauction.height / takeauction.width).toBeLessThanOrEqual(1.05)
    expect(altitudelog.height / altitudelog.width).toBeLessThanOrEqual(1.05)
  })
})
