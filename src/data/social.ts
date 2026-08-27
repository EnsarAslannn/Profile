import type { ComponentType } from 'react'
import GitHubIcon from '../components/icons/GitHubIcon'
import LinkedInIcon from '../components/icons/LinkedInIcon'

export type SocialLink = {
  id: string
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn profili',
    href: 'https://linkedin.com/in/ensaraslannn',
    icon: LinkedInIcon,
  },
  {
    id: 'github',
    label: 'GitHub profili',
    href: 'https://github.com/EnsarAslannn',
    icon: GitHubIcon,
  },
]
