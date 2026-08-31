// The site's single decorative gradient layer, and now the ONLY gradient on
// the site. It used to be a blue-100 wash strong enough that ink-muted failed
// against it; it is now a barely-perceptible sage breath fading into the exact
// hex of the cream page ground, which is what the owner asked a gradient here
// to be. Every colour on the site clears its floor against it.
//
// The hero is the one section that paints no ground of its own, precisely so
// this shows through - every band below it is opaque and covers it.
//
// Rendered once, outside <Routes>, so it is byte-identical on every route.
// `absolute`, not `fixed`: the band scrolls away with the page and never
// reappears further down
// (see App.tsx's `relative isolate` root for the positioning context this
// depends on). Never add overflow-hidden/transform/filter/contain to an
// ancestor of this element - any of them would change what `position:
// absolute` is sized against, and would break the sticky profile card in
// Hero.tsx. The footer card carries its own overflow-hidden, which is fine -
// it is a sibling of this element, never an ancestor.
export default function PageBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-dvh bg-[linear-gradient(to_bottom,var(--color-backdrop-from)_0%,var(--color-backdrop-to)_55%)]" />
  )
}
