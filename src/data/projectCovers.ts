import profileDolfin from '../assets/profileDolfin.webp'
import profileTakeauction from '../assets/profileTakeauction.webp'
import profileAltitudelog from '../assets/profileAltitudelog.webp'
import { SITE_GROUP, srcSetFor } from './imageSrcSet'

export type ProjectCover = {
  src: string
  width: number
  height: number
  srcSet: string | undefined
}

const cover = (name: string, src: string, width: number, height: number): ProjectCover => ({
  src,
  width,
  height,
  srcSet: srcSetFor(`${SITE_GROUP}/${name}`, { src, width }),
})

const PROJECT_COVERS: Record<string, ProjectCover> = {
  dolfin: cover('profileDolfin', profileDolfin, 1600, 2162),
  takeauction: cover('profileTakeauction', profileTakeauction, 1375, 905),
  altitudelog: cover('profileAltitudelog', profileAltitudelog, 1600, 1614),
}

export function getProjectCover(slug: string): ProjectCover | undefined {
  return PROJECT_COVERS[slug]
}
