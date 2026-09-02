import profileDolfin from '../assets/profileDolfin.webp'
import profileTakeauction from '../assets/profileTakeauction.webp'
import profileAltitudelog from '../assets/profileAltitudelog.webp'

export type ProjectCover = {
  src: string
  width: number
  height: number
}

const PROJECT_COVERS: Record<string, ProjectCover> = {
  dolfin: { src: profileDolfin, width: 1600, height: 2162 },
  takeauction: { src: profileTakeauction, width: 1375, height: 905 },
  altitudelog: { src: profileAltitudelog, width: 1600, height: 1614 },
}

export function getProjectCover(slug: string): ProjectCover | undefined {
  return PROJECT_COVERS[slug]
}
