import { PROJECT_IMAGE_HEIGHT, PROJECT_IMAGE_WIDTH, getProjectImageAlt, type ProjectImage } from '../data/projectImages'

type Props = {
  images: ProjectImage[]
  projectTitle: string
}

export default function ProjectGallery({ images, projectTitle }: Props) {
  return (
    <ul className="mt-10 space-y-8 sm:space-y-12">
      {images.map((image, index) => (
        <li key={image.name}>
          <img
            src={image.src}
            alt={getProjectImageAlt(projectTitle, index)}
            width={PROJECT_IMAGE_WIDTH}
            height={PROJECT_IMAGE_HEIGHT}
            decoding="async"
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : undefined}
            className="aspect-project-cover w-full rounded-2xl object-cover"
          />
        </li>
      ))}
    </ul>
  )
}
