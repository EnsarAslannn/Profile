import { toMachineDate, type RoadmapEntry } from '../data/resume'

type Props = {
  entry: RoadmapEntry
  index: number
}

// One stop on the Özgeçmiş timeline. Split out of Resume.tsx because the
// left/right alternation needs a handful of conditional class strings, and
// inlining them would push the section past CLAUDE.md's 150-line limit.
export default function RoadmapCard({ entry, index }: Props) {
  const onRight = index % 2 === 1

  return (
    <li className="relative">
      {/* The dot rides the spine drawn by Resume.tsx: same left offset on
          mobile, same centre from md: up. ring-surface-base punches a hole in
          the line behind it so the dot reads as sitting ON the spine. */}
      <span
        aria-hidden="true"
        className="absolute top-8 left-0 z-10 h-4 w-4 rounded-full bg-accent-base ring-4 ring-surface-base md:left-1/2 md:-translate-x-1/2"
      />

      <div
        data-reveal
        className={`ml-10 md:ml-0 md:w-[calc(50%-2.5rem)] ${onRight ? 'md:ml-auto' : ''}`}
      >
        <div
          className={`relative overflow-hidden rounded-2xl border border-line-subtle bg-surface-raised p-7 shadow-sm shadow-slate-950/5 sm:p-8 ${
            onRight ? 'md:text-right' : ''
          }`}
        >
          {entry.background && (
            // The owner's photo for that year. 45% with saturate(1.7) was
            // measured, not chosen by eye: text sits directly on this, so the
            // limit is whatever keeps the DARKEST pixel the wash can produce
            // above the contrast floor for every colour on the card. Sweeping
            // the real rendered pixels put that boundary at 0.50 (ink-strong
            // 4.40:1, under the floor); 0.45 measures 5.24:1 and carries about
            // 2.5x the on-screen colour the earlier 0.14 wash did.
            //
            // Raising it further means darkening the text again, and there is
            // nothing darker left - every line is already ink-strong, which is
            // itself the price this opacity paid (the organisation line used
            // to be accent-coloured). Note that the site-wide contrast sweep
            // CANNOT catch a regression here: it compares text against the
            // parent's background-color and knows nothing about an image.
            //
            // Absolutely positioned, so it contributes nothing to layout and
            // cannot shift the card; the width/height attributes are the true
            // measured ones all the same.
            <img
              src={entry.background.src}
              alt=""
              width={entry.background.width}
              height={entry.background.height}
              loading="lazy"
              decoding="async"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.45] saturate-[1.7] select-none"
            />
          )}

          {/* Every line is ink-strong; the hierarchy is carried by size and
              weight instead of by colour, because no lighter ink clears 4.5:1
              against the wash above. */}
          <div className="relative">
            <span className="font-mono text-xs text-ink-strong">
              {String(index + 1).padStart(2, '0')}
            </span>

            <p className="mt-3 font-serif text-4xl font-bold italic tracking-tight text-ink-strong sm:text-5xl">
              {entry.year}
            </p>

            <p className="mt-5 text-base font-semibold text-ink-strong">{entry.title}</p>
            <p className="mt-1 text-sm font-medium text-ink-strong sm:text-base">
              {entry.organization}
            </p>
            <p className="mt-2 text-sm tabular-nums text-ink-strong">
              <time dateTime={toMachineDate(entry.start)}>{entry.start}</time>
              {' – '}
              <time dateTime={toMachineDate(entry.end)}>{entry.end}</time>
            </p>

            {/* The chip needs its own opaque ground now that the wash behind it
                is strong: surface-sunken at 45% photo underneath was no longer
                a reliable backdrop for small uppercase text. */}
            <p className={`mt-6 flex flex-wrap gap-2 ${onRight ? 'md:justify-end' : ''}`}>
              <span className="inline-flex items-center rounded-full bg-surface-raised px-3 py-1.5 text-xs font-semibold tracking-widest text-ink-strong uppercase ring-1 ring-line-strong">
                {entry.kind}
              </span>
            </p>
          </div>
        </div>
      </div>
    </li>
  )
}
