import type { ComponentType } from 'react'
import MailIcon from '../components/icons/MailIcon'
import MapPinIcon from '../components/icons/MapPinIcon'
import PhoneIcon from '../components/icons/PhoneIcon'

export type ContactItem = {
  id: string
  label: string
  value: string
  href: string | null
  icon: ComponentType<{ className?: string }>
}

export const CONTACT_ITEMS: ContactItem[] = [
  {
    id: 'email',
    label: 'E-posta',
    value: 'ensaraslannn@gmail.com',
    href: 'mailto:ensaraslannn@gmail.com',
    icon: MailIcon,
  },
  {
    id: 'phone',
    label: 'Telefon',
    value: '+90 538 053 1778',
    href: 'tel:+905380531778',
    icon: PhoneIcon,
  },
  {
    id: 'location',
    label: 'Konum',
    value: 'Türkiye / Kocaeli / İstanbul',
    href: null,
    icon: MapPinIcon,
  },
]
