import { PROJECT_IMAGE_HEIGHT, PROJECT_IMAGE_WIDTH, getProjectImageAlt } from '../data/projectImages'
import type { ProjectScreen } from '../data/projects'
import { useLanguage } from '../i18n/LanguageContext'
import { UI } from '../i18n/ui'

type Props = {
  screens: ProjectScreen[]
  projectTitle: string
}

export default function ProjectScreens({ screens, projectTitle }: Props) {
  const { language } = useLanguage()

  return (
    <ul aria-label={UI[language].screensLabel} className="mt-8 space-y-8 sm:space-y-12">
      {screens.map((screen, index) => (
        <li key={screen.name} data-reveal>
          <figure>
            <div className="overflow-hidden rounded-2xl bg-surface-sunken">
              <img
                src={screen.src}
                alt={getProjectImageAlt(projectTitle, index, language)}
                width={PROJECT_IMAGE_WIDTH}
                height={PROJECT_IMAGE_HEIGHT}
                decoding="async"
                loading="lazy"
                className="aspect-project-cover w-full object-cover"
              />
            </div>
            {screen.caption && (
              <figcaption className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
                {screen.caption}
              </figcaption>
            )}
          </figure>
        </li>
      ))}
    </ul>
  )
}
