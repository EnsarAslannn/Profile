import type { ComponentType } from 'react'
import MailIcon from '../components/icons/MailIcon'
import MapPinIcon from '../components/icons/MapPinIcon'
import PhoneIcon from '../components/icons/PhoneIcon'

import type { Localized } from '../i18n/language'

export type ContactItem = {
  id: string
  label: string
  value: string
  href: string | null
  icon: ComponentType<{ className?: string }>
}

const items = (labels: { email: string; phone: string; location: string }): ContactItem[] => [
  {
    id: 'email',
    label: labels.email,
    value: 'ensaraslannn@gmail.com',
    href: 'mailto:ensaraslannn@gmail.com',
    icon: MailIcon,
  },
  {
    id: 'phone',
    label: labels.phone,
    value: '+90 538 053 1778',
    href: 'tel:+905380531778',
    icon: PhoneIcon,
  },
  {
    id: 'location',
    label: labels.location,
    value: 'Türkiye / Kocaeli / İstanbul',
    href: null,
    icon: MapPinIcon,
  },
]

export const CONTACT_ITEMS: Localized<ContactItem[]> = {
  tr: items({ email: 'E-posta', phone: 'Telefon', location: 'Konum' }),
  en: items({ email: 'E-mail', phone: 'Phone', location: 'Location' }),
}
