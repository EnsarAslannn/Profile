import type { ComponentType } from 'react'
import GitHubIcon from './icons/GitHubIcon'
import LinkedInIcon from './icons/LinkedInIcon'

type SocialLink = {
  id: string
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
}

const SOCIAL_LINKS: SocialLink[] = [
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

export default function SocialLinks() {
  return (
    <ul className="mt-6 flex items-center gap-3">
      {SOCIAL_LINKS.map((link) => {
        const Icon = link.icon
        return (
          <li key={link.id}>
            <a
              href={link.href}
              aria-label={link.label}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-500 text-navy-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-400 hover:text-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 active:translate-y-0 active:text-accent-600 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <Icon className="h-5 w-5" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
