import { SKILL_GROUPS } from '../data/skills'
import { revealDelayClass } from '../lib/useReveal'

// Cards reuse the surface/border/shadow recipe already established by
// ProfileCard and ProjectCard rather than introducing a new one, so the
// section reads as part of the same page instead of a bolted-on block.
const CARD_CLASS =
  'flex flex-col rounded-2xl border border-line-subtle bg-surface-raised p-6 shadow-sm shadow-slate-950/5'

// Chips sit on surface-sunken so they separate from the raised card behind
// them without needing a second border weight. ink-body, not ink-muted:
// muted clears AA on surface-base but this section renders inside cards, and
// keeping one ink for all chip text avoids a contrast question per surface.
const CHIP_CLASS =
  'inline-flex items-center rounded-full bg-surface-sunken px-3 py-1.5 text-sm font-medium text-ink-body'

export default function Skills() {
  return (
    <section id="yetenekler" className="scroll-mt-8 border-t border-line-subtle py-16">
      <h2 data-reveal className="text-3xl font-bold text-ink-strong sm:text-4xl">
        Yetenekler
      </h2>
      {/* No intro paragraph: removed at the owner's request. The heading now
          leads straight into the grid, so the mt- value lives here rather
          than on a paragraph that no longer exists. */}
      <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {SKILL_GROUPS.map((group, index) => (
          <li key={group.id} data-reveal className={`${CARD_CLASS} ${revealDelayClass(index)}`}>
            {/* lang="en" is load-bearing, not decoration. The document is
                lang="tr", and CSS text-transform casing is locale-aware, so
                a Turkish-tagged "Architecture" uppercases to "ARCHİTECTURE"
                (dotted capital I) - Turkish maps i -> İ. Tagging the label as
                English restores ARCHITECTURE and also stops a screen reader
                reading these labels with Turkish pronunciation. */}
            <h3
              lang="en"
              className="text-xs font-semibold uppercase tracking-wider text-ink-muted"
            >
              {group.heading}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item} className={CHIP_CLASS}>
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}
