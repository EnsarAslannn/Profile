import type { ComponentType } from 'react'
import BackToTopButton from './BackToTopButton'
import GitHubIcon from './icons/GitHubIcon'
import LinkedInIcon from './icons/LinkedInIcon'
import MailIcon from './icons/MailIcon'
import { CONTACT_ITEMS } from '../data/contact'
import { SOCIAL_LINKS } from '../data/social'

type FooterRowItem = {
  id: string
  text: string
  href: string
  icon: ComponentType<{ className?: string }>
  external: boolean
}

// Visible text deliberately differs from SOCIAL_LINKS[].label ("LinkedIn
// profili"), which is correct as an aria-label for the icon-only
// SocialLinks.tsx but clunky as visible row text here - see CLAUDE.md's
// note on per-component presentation over shared data. Hrefs are RESOLVED
// from data by id, never re-typed.
const ROW_ITEMS: FooterRowItem[] = [
  {
    id: 'linkedin',
    text: 'LinkedIn',
    href: SOCIAL_LINKS.find((s) => s.id === 'linkedin')!.href,
    icon: LinkedInIcon,
    external: true,
  },
  {
    id: 'github',
    text: 'GitHub',
    href: SOCIAL_LINKS.find((s) => s.id === 'github')!.href,
    icon: GitHubIcon,
    external: true,
  },
  {
    id: 'email',
    text: 'E-posta',
    href: CONTACT_ITEMS.find((item) => item.id === 'email')!.href!,
    icon: MailIcon,
    external: false,
  },
]

const ROW_LINK_CLASS =
  'inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-white transition-[opacity] duration-200 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-on-accent active:opacity-80'

export default function FooterLinkRow() {
  return (
    <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:mt-8 sm:gap-x-10">
      {ROW_ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <li key={item.id}>
            <a
              href={item.href}
              className={ROW_LINK_CLASS}
              {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <Icon className="h-5 w-5 shrink-0 text-white" />
              {item.text}
            </a>
          </li>
        )
      })}
      <li>
        <BackToTopButton />
      </li>
    </ul>
  )
}
