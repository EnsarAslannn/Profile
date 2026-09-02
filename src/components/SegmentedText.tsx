import type { TextSegment } from '../data/about'

const EMPHASIS_CLASS = {
  bold: 'font-bold text-ink-strong',
  italic: 'font-serif italic text-ink-strong',
} as const

type Props = {
  segments: readonly TextSegment[]
}

export default function SegmentedText({ segments }: Props) {
  return (
    <>
      {segments.map((segment) => (
        <span
          key={segment.text}
          {...(segment.lang ? { lang: segment.lang } : {})}
          className={segment.emphasis ? EMPHASIS_CLASS[segment.emphasis] : undefined}
        >
          {segment.text}
        </span>
      ))}
    </>
  )
}
