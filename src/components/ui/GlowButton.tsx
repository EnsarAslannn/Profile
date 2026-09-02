import type { ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type Props = {
  children: ReactNode
  to?: LinkProps['to']
  href?: string
  download?: boolean
  external?: boolean
}

export default function GlowButton({
  children,
  to,
  href,
  download,
  external,
}: Props) {
  const shell =
    'group relative isolate inline-flex overflow-hidden rounded-full bg-accent-base/15 p-0.5 transition-transform duration-300 hover:scale-105 active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none motion-reduce:hover:scale-100'

  const face =
    'inline-flex items-center gap-3 rounded-full bg-cta-base px-6 py-4 text-sm font-semibold tracking-widest whitespace-nowrap text-cta-ink uppercase transition-colors duration-200 group-hover:bg-cta-hover group-active:bg-cta-active'

  const inner = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/2 -left-1/2 -z-10 h-[200%] w-[200%] animate-glow-spin bg-[image:linear-gradient(var(--color-accent-base),var(--color-accent-base))] bg-[length:50%_30%] bg-[position:100%_50%] bg-no-repeat blur-[6px] motion-reduce:hidden"
      />
      <span className={face}>{children}</span>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={shell}>
        {inner}
      </Link>
    )
  }

  return (
    <a
      href={href}
      className={shell}
      {...(download ? { download: true } : {})}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {inner}
    </a>
  )
}
