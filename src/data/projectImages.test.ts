import { describe, expect, it } from 'vitest'
import { getProjectImages, PROJECT_IMAGE_HEIGHT, PROJECT_IMAGE_WIDTH } from './projectImages'

describe('getProjectImages', () => {
  it('returns 5 images for dolfin, 4 for takeauction, 6 for altitudelog', () => {
    expect(getProjectImages('dolfin', [])).toHaveLength(5)
    expect(getProjectImages('takeauction', [])).toHaveLength(4)
    expect(getProjectImages('altitudelog', [])).toHaveLength(6)
  })

  it('every returned image has a non-empty src and a name with no .webp extension', () => {
    for (const image of getProjectImages('dolfin', [])) {
      expect(image.src.length).toBeGreaterThan(0)
      expect(image.name.length).toBeGreaterThan(0)
      expect(image.name).not.toMatch(/\.webp$/)
    }
  })

  it('places preferredOrder names first, in order, remainder alphabetical', () => {
    const names = getProjectImages('dolfin', ['homePage', 'homePage2']).map((i) => i.name)
    expect(names).toEqual(['homePage', 'homePage2', 'companyProfile', 'searchPage', 'walletPage'])
  })

  it('with an empty preferredOrder, falls back to plain alphabetical order', () => {
    const names = getProjectImages('dolfin', []).map((i) => i.name)
    expect(names[0]).toBe('companyProfile')
  })

  it('skips a preferredOrder name that does not exist on disk, without throwing', () => {
    expect(() => getProjectImages('dolfin', ['nope', 'homePage'])).not.toThrow()
    const names = getProjectImages('dolfin', ['nope', 'homePage']).map((i) => i.name)
    expect(names).not.toContain('nope')
    expect(names[0]).toBe('homePage')
  })

  it('returns an empty array for an unknown project folder', () => {
    expect(getProjectImages('nosuchproject', [])).toEqual([])
  })

  it('keeps the nominal aspect ratio between 1.7 and 1.95', () => {
    const ratio = PROJECT_IMAGE_WIDTH / PROJECT_IMAGE_HEIGHT
    expect(ratio).toBeGreaterThan(1.7)
    expect(ratio).toBeLessThan(1.95)
  })
})
