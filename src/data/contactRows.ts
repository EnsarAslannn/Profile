import type { ComponentType } from 'react'
import GitHubIcon from '../components/icons/GitHubIcon'
import LinkedInIcon from '../components/icons/LinkedInIcon'
import MailIcon from '../components/icons/MailIcon'
import MapPinIcon from '../components/icons/MapPinIcon'
import type { Language, Localized } from '../i18n/language'
import { CONTACT_ITEMS } from './contact'
import { SOCIAL_LINKS } from './social'

// The İletişim section's rows, in the order the owner asked for: e-posta,
// LinkedIn, GitHub, konum.
//
// Every value is RESOLVED from the existing data, never re-typed - the two
// profile handles are derived from their own hrefs, so a URL changed in
// src/data/social.ts moves the visible text with it and the row can never
// display one account while linking to another.
export type ContactRow = {
  id: string
  label: string
  value: string
  href: string | null
  external: boolean
  icon: ComponentType<{ className?: string }>
  /** Shown under the value; used for the working-location note. */
  note?: string
  /** Offers a copy-to-clipboard control beside the value. */
  copyable?: boolean
  /**
   * Set on rows whose LABEL is an English brand name. The labels are
   * CSS-uppercased and the Turkish page is lang="tr", where casing maps
   * i -> İ: untagged, these render LİNKEDIN and GİTHUB. See
   * englishLabels.test.tsx. Kept in the English rows too, where it is
   * redundant rather than wrong - lang="en" inside a lang="en" document
   * changes nothing, and one row shape is simpler than two.
   */
  lang?: string
}

// Resolved per language, but note what that does NOT change: hrefs and
// handles are identical in both, because they come from the same URLs.
const socialHref = (id: string) =>
  SOCIAL_LINKS.tr.find((link) => link.id === id)!.href
const contactItem = (lang: Language, id: string) =>
  CONTACT_ITEMS[lang].find((item) => item.id === id)!

// "https://linkedin.com/in/ensaraslannn" -> "/in/ensaraslannn"
// "https://github.com/EnsarAslannn"      -> "@EnsarAslannn"
//
// The owner asked for the handle rather than the whole domain on screen. Both
// forms are cut from the href itself rather than written out again: the path
// is the account, and the "@" is the convention GitHub itself uses.
const linkedInHandle = (href: string) => new URL(href).pathname.replace(/\/$/, '')
const gitHubHandle = (href: string) => `@${new URL(href).pathname.replace(/^\/|\/$/g, '')}`

const rows = (lang: Language, note: string): ContactRow[] => [
  {
    // href is deliberately null: the owner asked for the address to be
    // copyable rather than clickable, so there is no mailto and no arrow
    // button - just the text and the copy control. CONTACT_ITEMS still
    // carries the mailto for ProfileCard on /hakkimda, which does link it.
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
  // The note is owner-supplied and verbatim in Turkish.
  tr: rows('tr', 'Remote çalışmaya açığım.'),
  en: rows('en', 'Open to remote work.'),
}
