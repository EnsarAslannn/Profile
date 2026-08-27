import { SOCIAL_LINKS } from '../data/social'

export default function SocialLinks() {
  return (
    <ul className="mt-6 flex items-center gap-3">
      {SOCIAL_LINKS.map((link) => {
        const Icon = link.icon
        return (
          <li key={link.id}>
            <a
              href={link.href}
              aria-label={link.label}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-ink-body transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-hover hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:translate-y-0 active:text-accent-active motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <Icon className="h-5 w-5" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
