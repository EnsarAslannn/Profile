// The site's single decorative gradient layer. Rendered once, outside
// <Routes>, so it is byte-identical on every route. `absolute`, not `fixed`:
// the blue band scrolls away with the page and never reappears further down
// (see App.tsx's `relative isolate` root for the positioning context this
// depends on). Never add overflow-hidden/transform/filter/contain to an
// ancestor of this element - any of them would change what `position:
// absolute` is sized against and can break the sticky navbar/profile card
// elsewhere on the page.
export default function PageBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-dvh bg-[linear-gradient(to_bottom,var(--color-backdrop-from)_0%,var(--color-backdrop-to)_55%)]" />
  )
}
