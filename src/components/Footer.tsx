import FooterNav from './FooterNav'
import FooterWordmark from './FooterWordmark'
import { CONTACT_ITEMS } from '../data/contact'
import { SOCIAL_LINKS } from '../data/social'
import { SITE_NAME, SITE_ROLE } from '../lib/siteMeta'

const CONTACT_LINK_CLASS =
  '-my-3 inline-flex items-center py-3 text-sm text-ink-muted underline-offset-4 transition-colors duration-200 hover:text-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:text-accent-active'

const SOCIAL_LINK_CLASS =
  'flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-ink-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-hover hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:translate-y-0 active:text-accent-active motion-reduce:transition-none motion-reduce:hover:translate-y-0'

export default function Footer() {
  return (
    <footer className="border-t border-line-subtle py-12 sm:py-16">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-[2fr_1fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xl font-semibold tracking-tight text-ink-strong">{SITE_NAME}</p>
            <p className="mt-1 text-sm font-medium text-accent-base">{SITE_ROLE}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-strong">İletişim</h3>
            <ul className="mt-4 space-y-1">
              {CONTACT_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.id} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0 text-accent-base" />
                    <span className="sr-only">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className={CONTACT_LINK_CLASS}>
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-sm text-ink-muted">{item.value}</span>
                    )}
                  </li>
                )
              })}
            </ul>
            <ul className="mt-4 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon
                return (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={SOCIAL_LINK_CLASS}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        <FooterNav />
      </div>
      <div className="mt-14 border-t border-line-subtle pt-10 sm:mt-16 sm:pt-12">
        <FooterWordmark />
      </div>
      <p className="mt-10 text-sm text-ink-muted">
        &copy; {new Date().getFullYear()} {SITE_NAME}
      </p>
    </footer>
  )
}
