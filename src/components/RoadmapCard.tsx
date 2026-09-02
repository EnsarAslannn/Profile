import { toMachineDate, type RoadmapEntry } from '../data/resume'

type Props = {
  entry: RoadmapEntry
  index: number
}

export default function RoadmapCard({ entry, index }: Props) {
  const onRight = index % 2 === 1

  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className="absolute top-8 left-0 z-10 h-4 w-4 rounded-full bg-accent-base ring-4 ring-surface-base md:left-1/2 md:-translate-x-1/2"
      />

      <div
        data-reveal
        className="ml-10 flex flex-col gap-6 md:ml-0 md:grid md:grid-cols-2 md:items-start md:gap-x-20"
      >
        {entry.photo && (
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
