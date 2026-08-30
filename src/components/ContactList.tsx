import { CONTACT_ITEMS } from '../data/contact'
import { useLanguage } from '../i18n/LanguageContext'

export default function ContactList() {
  const { language } = useLanguage()

  return (
    <ul className="mt-6 space-y-3">
      {CONTACT_ITEMS[language].map((item) => {
        const Icon = item.icon
        return (
          <li key={item.id} className="flex items-center gap-3">
            <Icon className="h-5 w-5 shrink-0 text-accent-base" />
            <span className="sr-only">{item.label}</span>
            {item.href ? (
              <a
                href={item.href}
                className="-my-3 inline-flex items-center py-3 text-sm text-ink-body underline-offset-4 transition-colors duration-200 hover:text-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:text-accent-active"
              >
                {item.value}
              </a>
            ) : (
              <span className="text-sm text-ink-body">{item.value}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
