// Cover images for the home-page mosaic and each detail page's LCP figure.
//
// This is a small hand-maintained table, not a glob like projectImages.ts,
// and deliberately so: there are exactly three covers (one per project),
// added once and rarely changed, and each carries a genuinely different
// aspect ratio that is load-bearing for the asymmetric mosaic layout - a
// glob only yields a hashed URL string with no dimension metadata, and the
// whole point here is to keep the TRUE intrinsic width/height per file. The
// glob's per-file-table-would-rot argument does not apply at this scale.
//
// Files live flat in src/assets/ (not inside src/assets/<slug>/), which
// keeps them outside the screenshot glob pattern '../assets/*/*.webp' in
// projectImages.ts - that pattern requires exactly one intervening
// directory, so a cover here is invisible to getProjectImages.
//
// Filenames are case-sensitive on Vercel's Linux build hosts even though
// Windows is not - match the on-disk casing exactly.
import profileDolfin from '../assets/profileDolfin.webp'
import profileTakeauction from '../assets/profileTakeauction.webp'
import profileAltitudelog from '../assets/profileAltitudelog.webp'

export type ProjectCover = {
  src: string
  width: number
  height: number
}

const PROJECT_COVERS: Record<string, ProjectCover> = {
  dolfin: { src: profileDolfin, width: 1600, height: 2161 },
  takeauction: { src: profileTakeauction, width: 1379, height: 909 },
  altitudelog: { src: profileAltitudelog, width: 1600, height: 1613 },
}

export function getProjectCover(slug: string): ProjectCover | undefined {
  return PROJECT_COVERS[slug]
}
