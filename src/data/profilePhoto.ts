import photo from '../assets/ea.webp'
import { SITE_GROUP, srcSetFor } from './imageSrcSet'

export const PROFILE_PHOTO = {
  src: photo,
  width: 640,
  height: 853,
  srcSet: srcSetFor(`${SITE_GROUP}/ea`, { src: photo, width: 640 }),
}
