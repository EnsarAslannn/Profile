import FooterLinkRow from './FooterLinkRow'
import FooterNav from './FooterNav'
import FooterWordmark from './FooterWordmark'
import { CONTACT_ITEMS } from '../data/contact'
import { SITE_NAME } from '../lib/siteMeta'

export default function Footer() {
  const location = CONTACT_ITEMS.find((item) => item.id === 'location')!

  return (
    <footer className="border-t border-line-subtle pt-12 pb-16 sm:pt-16 sm:pb-20">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pb-6 text-xs text-ink-muted sm:pb-8">
        <p>{location.value}</p>
        <p>
          &copy; {new Date().getFullYear()} {SITE_NAME}
        </p>
      </div>

      <div className="relative overflow-hidden rounded-3xl">
        <div className="relative z-10 flex flex-col items-center gap-6 bg-footer-from px-6 pt-12 pb-10 text-center sm:gap-8 sm:px-10 sm:pt-16 sm:pb-12 lg:px-14 lg:pt-20 lg:pb-14">
          <FooterNav />
          <FooterLinkRow />
        </div>
        <div className="relative aspect-[8/1] bg-[linear-gradient(to_bottom,var(--color-footer-from),var(--color-footer-to))]">
          <div className="absolute inset-x-0 top-0 left-1/2 w-[150%] -translate-x-1/2">
            <FooterWordmark />
          </div>
        </div>
      </div>
    </footer>
  )
}
