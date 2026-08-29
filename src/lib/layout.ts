// The one content column every route shares: same max width, same horizontal
// padding ramp. It used to be a class string copy-pasted into <main> and the
// footer wrapper, guarded by a test that compared the two - which caught
// drift between exactly those two elements and nothing else.
//
// The redesign made that arrangement untenable: the Marquee strips are
// full-bleed, so <main> can no longer be the padded box, and the column now
// wraps several separate blocks per page. A shared constant makes the
// invariant structural instead of asserted - there is only one string, so
// there is nothing to drift.
//
// Written as a literal (not composed from parts) because Tailwind scans
// source text: an interpolated class name would never be generated.
export const CONTENT_CONTAINER = 'mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 xl:px-12'
