import type { ComponentType } from 'react'
import GitHubIcon from '../components/icons/GitHubIcon'
import LinkedInIcon from '../components/icons/LinkedInIcon'
import MailIcon from '../components/icons/MailIcon'
import MapPinIcon from '../components/icons/MapPinIcon'
import type { Language, Localized } from '../i18n/language'
import { CONTACT_ITEMS } from './contact'
import { SOCIAL_LINKS } from './social'

export type ContactRow = {
  id: string
  label: string
  value: string
  href: string | null
  external: boolean
  icon: ComponentType<{ className?: string }>
  note?: string
  copyable?: boolean
  lang?: string
}

const socialHref = (id: string) =>
  SOCIAL_LINKS.tr.find((link) => link.id === id)!.href
const contactItem = (lang: Language, id: string) =>
  CONTACT_ITEMS[lang].find((item) => item.id === id)!

const linkedInHandle = (href: string) => new URL(href).pathname.replace(/\/$/, '')
const gitHubHandle = (href: string) => `@${new URL(href).pathname.replace(/^\/|\/$/g, '')}`

const rows = (lang: Language, note: string): ContactRow[] => [
  {
    id: 'email',
    label: contactItem(lang, 'email').label,
    value: contactItem(lang, 'email').value,
    href: null,
    external: false,
    icon: MailIcon,
    copyable: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: linkedInHandle(socialHref('linkedin')),
    href: socialHref('linkedin'),
    external: true,
    icon: LinkedInIcon,
    lang: 'en',
  },
  {
    id: 'github',
    label: 'GitHub',
    value: gitHubHandle(socialHref('github')),
    href: socialHref('github'),
    external: true,
    icon: GitHubIcon,
    lang: 'en',
  },
  {
    id: 'location',
    label: contactItem(lang, 'location').label,
    value: contactItem(lang, 'location').value,
    href: null,
    external: false,
    icon: MapPinIcon,
    note,
  },
]

export const CONTACT_ROWS: Localized<ContactRow[]> = {
  tr: rows('tr', 'Remote çalışmaya açığım.'),
  en: rows('en', 'Open to remote work.'),
}
