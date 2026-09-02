import type { Localized } from '../i18n/language'

export type NavLink = {
  anchor: string
  label: string
  lang?: string
}

export const NAV_LINKS: Localized<NavLink[]> = {
  tr: [
    { anchor: 'anasayfa', label: 'Anasayfa' },
    { anchor: 'hakkimda', label: 'Hakkımda' },
    { anchor: 'projeler', label: 'Projeler' },
    { anchor: 'ozgecmis', label: 'Özgeçmiş' },
    { anchor: 'yetenekler', label: 'Stacks', lang: 'en' },
    { anchor: 'iletisim', label: 'İletişim' },
  ],
  en: [
    { anchor: 'anasayfa', label: 'Home' },
    { anchor: 'hakkimda', label: 'About' },
    { anchor: 'projeler', label: 'Projects' },
    { anchor: 'ozgecmis', label: 'Resume' },
    { anchor: 'yetenekler', label: 'Stacks' },
    { anchor: 'iletisim', label: 'Contact' },
  ],
}

export const SECTION_ANCHORS: readonly string[] = NAV_LINKS.tr.map((link) => link.anchor)

export const NO_ANCHORS: readonly string[] = []
