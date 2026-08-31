import { toMachineDate, type RoadmapEntry } from '../data/resume'

type Props = {
  entry: RoadmapEntry
  index: number
}

// One stop on the Özgeçmiş timeline: the photograph on one side of the spine,
// its text on the other, alternating down the page (owner's example.png).
//
// The photo and the copy are SIBLINGS across the spine, not two columns of one
// card. That is the whole point of this layout and it is easy to undo by
// accident - an earlier round put the text in a second column *inside* the
// card, which reads as a caption rather than as the timeline entry it is.
//
// It also retired a real problem. The photo used to sit absolutely positioned
// behind the copy at 45% (later 22%) opacity, and that number was a measured
// contrast budget rather than a taste setting: the ceiling on how much photo
// could show before text stopped clearing 4.5:1 against it. It cost the card
// its whole colour hierarchy, because no ink lighter than the strongest one
// survived a photograph underneath. With the text on the band itself, the
// photo has no contrast budget at all - swapping one in can never darken a
// word - and the hierarchy is carried by colour again.
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

      {/* Two grid columns with a 5rem gutter, so each half stops 2.5rem short
          of the centre line and the spine runs cleanly between them. Below md:
          the grid collapses and the pair simply stacks to the right of the
          mobile spine. `items-start` rather than `items-center` keeps the
          photo and the year on the same top edge, which is where the dot is. */}
      <div
        data-reveal
        className="ml-10 flex flex-col gap-6 md:ml-0 md:grid md:grid-cols-2 md:items-start md:gap-x-20"
      >
        {entry.photo && (
          // Full colour, no opacity and no filter. `aspect` + `object-cover`
          // gives every stop on the timeline the same silhouette - the four
          // photographs run from a 0.75 portrait to a 1.83 landscape, and
          // letting each keep its own ratio makes the alternating cards lurch.
          // It is also what reserves the box before the image decodes, so the
          // true width/height attributes cannot produce a shift.
          //
          // alt="" because it is decorative: the year, the role and the
          // organisation are all beside it as real text, and no owner-supplied
          // description of these photographs exists to use instead. Inventing
          // one is what CLAUDE.md forbids.
          <img
            src={entry.photo.src}
            alt=""
            width={entry.photo.width}
            height={entry.photo.height}
            loading="lazy"
            decoding="async"
            className={`aspect-[4/3] w-full rounded-2xl object-cover md:row-start-1 ${
              onRight ? 'md:col-start-2' : 'md:col-start-1'
            }`}
          />
        )}

        {/* The copy sits on the band itself - no card, no ground of its own.
            It hugs the spine from either side: left-aligned when it is in the
            right-hand column, right-aligned when it is in the left one, so the
            reading edge is always the centre line. */}
        <div
          className={`md:row-start-1 ${
            onRight ? 'md:col-start-1 md:text-right' : 'md:col-start-2'
          }`}
        >
          <span className="font-mono text-xs text-ink-muted">
            {String(index + 1).padStart(2, '0')}
          </span>

          <p className="mt-3 font-serif text-4xl font-bold italic tracking-tight text-ink-heading sm:text-5xl">
            {entry.year}
          </p>

          <p className="mt-5 text-base font-semibold text-ink-strong sm:text-lg">{entry.title}</p>
          <p className="mt-1 text-sm font-medium text-accent-base sm:text-base">
            {entry.organization}
          </p>
          <p className="mt-2 text-sm tabular-nums text-ink-body">
            <time dateTime={toMachineDate(entry.start)}>{entry.start}</time>
            {' – '}
            <time dateTime={toMachineDate(entry.end)}>{entry.end}</time>
          </p>

          <p className={`mt-6 flex flex-wrap gap-2 ${onRight ? 'md:justify-end' : ''}`}>
            <span className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold tracking-widest text-ink-body uppercase ring-1 ring-line-strong">
              {entry.kind}
            </span>
          </p>
        </div>
      </div>
    </li>
  )
}
