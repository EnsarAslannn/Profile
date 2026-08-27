import { Link } from 'react-router-dom'
import { NAV_LINKS } from '../data/navigation'

const NAV_LINK_CLASS =
  'inline-flex items-center justify-center rounded px-3 py-3 text-sm font-medium text-white underline-offset-4 transition-[opacity] duration-200 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-on-accent active:opacity-80'

export default function FooterNav() {
  return (
    <nav
      aria-label="Alt bilgi gezinmesi"
      className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:gap-x-8"
    >
      {NAV_LINKS.map((link) => (
        <Link key={link.anchor} to={{ pathname: '/', hash: `#${link.anchor}` }} className={NAV_LINK_CLASS}>
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
