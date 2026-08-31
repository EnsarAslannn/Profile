import type { ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type Props = {
  children: ReactNode
  /** Router destination. Mutually exclusive with `href`. */
  to?: LinkProps['to']
  /** Plain URL, for a static asset or an off-site link. */
  href?: string
  /** Save the target instead of navigating to it (the CV). */
  download?: boolean
  /** Open off-site, with the rel that has to accompany it. */
  external?: boolean
}

// The pill CTA used across the site, with the rotating rim the owner supplied
// as a shadcn-style `button-ui.tsx`.
//
// It is that component's effect, not that component's code, and three things
// changed on the way in - each because the original targets a different stack:
//
//  1. `"use client"` is a Next.js directive and means nothing under Vite.
//  2. The supplied colours (`bg-white/15`, `bg-gray-900/80`, a white sweep)
//     are a dark-theme button. On this light ground a white sweep is invisible,
//     so the rim is `accent-base` at 15% and the sweep is `accent-base` solid -
//     dark-on-pale, which is the same contrast relationship the original had
//     the other way up.
//
// There is ONE face, not two. It used to take a `variant` prop - a solid fill
// and an outline that kept the page ground inside - but the owner asked for
// the hero's three buttons to be identical, which left `outline` with no
// caller at all. An unused variant with a test pinning it is worse than
// either keeping or dropping it honestly, so it is gone; re-adding one is a
// few lines if a second button style is ever wanted.
//
// The face is the deep green carrying a white label (cta-*, 13.3:1). That is
// its own token family rather than the accent, because filling with
// accent-soft would have dragged the project-card hover bar and the language
// pill along with it - see the note in src/index.css. Hover goes LIGHTER,
// inverted from every other hover on the site, because cta-base is already
// near the dark end of the palette and a darker hover reads as black rather
// than as a state change. All of it resolves through the tone scope, so on a
// deep-green band the same classes give a cream face with deep-green ink.
//  3. The `@keyframes` moved out of an inline <style> tag into an @theme token
//     (`--animate-glow-spin`), because a <style> tag re-declares them once per
//     instance and cannot carry a `motion-reduce:` variant.
//
// It renders the real element rather than wrapping one: `<a>` navigates and
// `<button>` acts (CLAUDE.md), and a decorative <div> wrapped around a link
// would put the focus ring on the wrong box. That matters more than it looks -
// the rim needs `overflow-hidden` to clip the sweep, and `overflow-hidden`
// clips a DESCENDANT's outline. Keeping the interactive element as the outer
// box means the focus ring is the element's own outline, which its own
// overflow cannot clip.
export default function GlowButton({
  children,
  to,
  href,
  download,
  external,
}: Props) {
  // `isolate` is what makes the sweep's -z-10 stay inside this button: within
  // a stacking context the element's own background paints first and negative
  // children paint on top of it, so the sweep lands over the pale rim and
  // under the opaque face - which is the whole effect.
  const shell =
    'group relative isolate inline-flex overflow-hidden rounded-full bg-accent-base/15 p-0.5 transition-transform duration-300 hover:scale-105 active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none motion-reduce:hover:scale-100'

  const face =
    'inline-flex items-center gap-3 rounded-full bg-cta-base px-6 py-4 text-sm font-semibold tracking-widest whitespace-nowrap text-cta-ink uppercase transition-colors duration-200 group-hover:bg-cta-hover group-active:bg-cta-active'

  const inner = (
    <>
      {/* The sweep. A single accent-coloured blob, sized to a fraction of a
          box twice the button's size and parked at its right edge, so one
          rotation walks it all the way around the rim. blur softens it into a
          gradient without needing one. Hidden outright under reduced motion
          rather than merely paused: parked, it reads as a lopsided smudge on
          one side, and the pale rim alone is the better still frame. */}
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
