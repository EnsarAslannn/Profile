import { useEffect, useState } from 'react'

// Which section the reader is currently in, for the navbar's active underline
// and its aria-current.
//
// The navbar's six links all point at the SAME page, so unlike the wordmark
// there is no route to ask - "which one is current" is a scroll position and
// nothing else can answer it.
//
// Why a scroll sweep and not IntersectionObserver, again: an observer only
// fires when an element's intersection STATE changes, so jumping from the top
// of the page to the bottom in one go - a nav anchor, the End key, a flung
// touchpad - takes every section in between from below the fold to above it
// without ever intersecting, and the callback never runs. useReveal carries
// the same note and the same measurement behind it. A sweep asks the question
// directly instead, every frame that matters.
//
// The listener is passive, coalesced into one animation frame, and - unlike
// useReveal's - never stops, because unlike a reveal this has no finished
// state.

/**
 * The line a section's top has to cross to count as the one being read,
 * as a fraction of the viewport height.
 *
 * 0.35 rather than 0 or 0.5: a section becomes current once its heading is
 * into the upper third, which is roughly when a reader would say they are
 * "in" it. At 0 the change happens only as the previous section's last line
 * leaves, which feels late; at 0.5 a short section can never win at all.
 */
const ACTIVE_LINE = 0.35

/**
 * Picks the current section from measured tops.
 *
 * Pure and exported so it can be tested without layout - jsdom has none, so
 * every rect it reports is zero, and a test driving the real hook would be
 * asserting against a fiction.
 *
 * The rule is "the last section whose top has crossed the line", which is
 * what resolves the ambiguity of two sections being on screen at once: the
 * one most recently scrolled into wins.
 */
export function pickActiveSection(
  tops: readonly { anchor: string; top: number }[],
  line: number,
  atDocumentEnd: boolean,
): string | null {
  if (tops.length === 0) return null

  // At the very bottom of the document nothing can scroll further, so the
  // last section has to win whether or not its top ever crossed the line. On
  // a tall viewport a short closing section never crosses it, and without
  // this the underline would sit on the second-to-last link while the reader
  // stares at the last one.
  if (atDocumentEnd) return tops[tops.length - 1].anchor

  let active: string | null = null
  for (const { anchor, top } of tops) {
    if (top <= line) active = anchor
  }
  // Above the first section's line - only reachable if the page opens
  // scrolled up past everything - the first link is the honest answer.
  return active ?? tops[0].anchor
}

/**
 * @param anchors Section ids to track, in page order. Pass an empty array to
 *   switch tracking off - which is what the navbar does off the home route,
 *   where its links navigate AWAY rather than describing where the reader is.
 */
export function useActiveSection(anchors: readonly string[]): string | null {
  // The array is rebuilt on every render, so everything keys on its CONTENTS
  // rather than its identity.
  const key = anchors.join(',')

  // The key is stored beside the answer, and the answer is discarded during
  // render when the two disagree. Two things fall out of that, both of which
  // would otherwise need an effect: switching tracking off (an empty anchor
  // list, which is what the navbar passes off the home route) needs no
  // setState at all, and switching it back on cannot flash the previous
  // route's underline for the one frame before the first sweep lands.
  const [measured, setMeasured] = useState<{ key: string; anchor: string | null }>({
    key: '',
    anchor: null,
  })

  useEffect(() => {
    if (!key) return

    const ids = key.split(',')
    let frame = 0

    const sweep = () => {
      frame = 0
      const tops = ids
        .map((anchor) => ({ anchor, element: document.getElementById(anchor) }))
        .filter((entry) => entry.element !== null)
        .map(({ anchor, element }) => ({ anchor, top: element!.getBoundingClientRect().top }))

      const atDocumentEnd =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2

      const anchor = pickActiveSection(tops, window.innerHeight * ACTIVE_LINE, atDocumentEnd)
      setMeasured((previous) =>
        previous.key === key && previous.anchor === anchor ? previous : { key, anchor },
      )
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(sweep)
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    // The FIRST measurement is synchronous, not scheduled. Going through
    // requestAnimationFrame here meant the callback queued behind the initial
    // image decode: measured on the home route at 1440x900, the underline did
    // not appear for ~1.3 seconds, so the navbar sat blank and then something
    // lit up on its own a second later. The effect already runs after commit,
    // so the layout this reads is real, and it is six getBoundingClientRect
    // calls once per mount.
    //
    // oxlint-disable-next-line react/set-state-in-effect -- the value being
    // synchronised is scroll position against layout, which is precisely the
    // external system this rule exempts: it cannot be derived during render,
    // and deferring it is what produced the delay above.
    sweep()

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [key])

  return measured.key === key ? measured.anchor : null
}
