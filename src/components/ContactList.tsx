import type { ComponentType } from 'react'
import MailIcon from './icons/MailIcon'
import MapPinIcon from './icons/MapPinIcon'
import PhoneIcon from './icons/PhoneIcon'

type ContactItem = {
  id: string
  label: string
  value: string
  href: string | null
  icon: ComponentType<{ className?: string }>
}

const CONTACT_ITEMS: ContactItem[] = [
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
    value: 'Türkiye / Kocaeli',
    href: null,
    icon: MapPinIcon,
  },
]

export default function ContactList() {
  return (
    <ul className="mt-6 space-y-3">
      {CONTACT_ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <li key={item.id} className="flex items-center gap-3">
            <Icon className="h-5 w-5 shrink-0 text-accent-400" />
            <span className="sr-only">{item.label}</span>
            {item.href ? (
              <a
                href={item.href}
                className="-my-3 inline-flex items-center py-3 text-sm text-navy-300 underline-offset-4 transition-colors duration-200 hover:text-accent-400 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 active:text-accent-600"
              >
                {item.value}
              </a>
            ) : (
              <span className="text-sm text-navy-300">{item.value}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
