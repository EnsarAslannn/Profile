import { describe, expect, it } from 'vitest'
import { SITE_GROUP, srcSetFor } from './imageSrcSet'
import { getProjectCover } from './projectCovers'
import { HERO_IMAGES } from './hero'
import { PROFILE_PHOTO } from './profilePhoto'
import { ROADMAP_ENTRIES } from './resume'
import { PROJECTS } from './projects'

function widthsOf(srcSet: string): number[] {
  return srcSet.split(', ').map((candidate) => Number(candidate.split(' ')[1].replace('w', '')))
}

describe('srcSetFor', () => {
  it('lists the variants ascending and ends at the full-size original', () => {
    const cover = getProjectCover('dolfin')!
    const widths = widthsOf(cover.srcSet!)

    expect(widths).toEqual([...widths].sort((a, b) => a - b))
    expect(widths.at(-1)).toBe(cover.width)
    expect(widths.length).toBeGreaterThan(1)
  })

  it('gives every candidate a real URL and a width descriptor', () => {
    for (const candidate of getProjectCover('dolfin')!.srcSet!.split(', ')) {
      const [url, descriptor] = candidate.split(' ')
      expect(url.length).toBeGreaterThan(0)
      expect(descriptor).toMatch(/^\d+w$/)
    }
  })

  it('never offers a variant wider than the source it was cut from', () => {
    for (const cover of ['dolfin', 'takeauction', 'altitudelog'].map((s) => getProjectCover(s)!)) {
      for (const width of widthsOf(cover.srcSet!)) {
        expect(width).toBeLessThanOrEqual(cover.width)
      }
    }
  })

  it('returns undefined rather than a one-entry srcset when nothing was generated', () => {
    expect(srcSetFor(`${SITE_GROUP}/yoktur`, { src: '/x.webp', width: 1600 })).toBeUndefined()
  })

  it('returns undefined when every variant is as wide as the original', () => {
    expect(srcSetFor(`${SITE_GROUP}/ea`, { src: '/ea.webp', width: 400 })).toBeUndefined()
  })
})

describe('the images the home page loads', () => {
  it('offers a smaller candidate for every hero gallery tile', () => {
    for (const image of HERO_IMAGES) {
      expect(image.srcSet, image.id).toBeDefined()
      expect(widthsOf(image.srcSet!)[0], image.id).toBeLessThan(image.width)
    }
  })

  it('offers a smaller candidate for every project cover in the mosaic', () => {
    for (const project of PROJECTS.tr) {
      expect(project.cover?.srcSet, project.slug).toBeDefined()
    }
  })

  it('offers a smaller candidate for every timeline photograph', () => {
    const photos = ROADMAP_ENTRIES.tr.map((entry) => entry.photo).filter((photo) => photo)
    expect(photos.length).toBeGreaterThan(0)
    for (const photo of photos) {
      expect(photo!.srcSet).toBeDefined()
    }
  })

  it('offers a smaller candidate for the profile photograph', () => {
    expect(PROFILE_PHOTO.srcSet).toBeDefined()
    expect(widthsOf(PROFILE_PHOTO.srcSet!).at(-1)).toBe(PROFILE_PHOTO.width)
  })

  it('offers a smaller candidate for every project screenshot', () => {
    for (const project of PROJECTS.tr) {
      for (const screen of project.screens) {
        expect(screen.srcSet, `${project.slug}/${screen.name}`).toBeDefined()
      }
    }
  })
})
