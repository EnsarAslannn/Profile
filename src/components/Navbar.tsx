const links = [
  { href: '#hakkimda', label: 'Hakkımda' },
  { href: '#ozgecmis', label: 'Özgeçmiş' },
  { href: '#projeler', label: 'Projeler' },
  { href: '#iletisim', label: 'İletişim' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#hakkimda" className="font-semibold text-neutral-100">
          Portfolyo
        </a>
        <ul className="flex gap-6 text-sm text-neutral-400">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors hover:text-amber-400">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
