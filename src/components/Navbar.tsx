import { Link } from 'react-router-dom'

const links = [
  { anchor: 'hakkimda', label: 'Hakkımda' },
  { anchor: 'ozgecmis', label: 'Özgeçmiş' },
  { anchor: 'projeler', label: 'Projeler' },
  { anchor: 'iletisim', label: 'İletişim' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-navy-700 bg-navy-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1 sm:px-8 lg:px-10 xl:px-12">
        <Link
          to={{ pathname: '/', hash: '#hakkimda' }}
          className="inline-flex items-center rounded py-3 font-semibold text-navy-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
        >
          Portfolyo
        </Link>
        <ul className="flex gap-6 text-sm text-navy-400">
          {links.map((link) => (
            <li key={link.anchor}>
              <Link
                to={{ pathname: '/', hash: `#${link.anchor}` }}
                className="inline-flex items-center rounded px-2 py-3 transition-colors hover:text-accent-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
