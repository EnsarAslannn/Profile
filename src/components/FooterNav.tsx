import { Link } from 'react-router-dom'
import { NAV_LINKS } from '../data/navigation'
import { PROJECTS } from '../data/projects'

const LINK_CLASS =
  '-my-3 inline-flex items-center py-3 text-sm text-ink-muted underline-offset-4 transition-colors duration-200 hover:text-accent-hover hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:text-accent-active'

const HEADING_CLASS = 'text-sm font-semibold uppercase tracking-wider text-ink-strong'

export default function FooterNav() {
  return (
    <nav aria-label="Alt bilgi gezinmesi" className="grid grid-cols-2 gap-8">
      <div>
        <h3 className={HEADING_CLASS}>Bölümler</h3>
        <ul className="mt-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <li key={link.anchor}>
              <Link to={{ pathname: '/', hash: `#${link.anchor}` }} className={LINK_CLASS}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className={HEADING_CLASS}>Projeler</h3>
        <ul className="mt-4 space-y-1">
          {PROJECTS.map((project) => (
            <li key={project.slug}>
              <Link to={`/projects/${project.slug}`} className={LINK_CLASS}>
                {project.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
