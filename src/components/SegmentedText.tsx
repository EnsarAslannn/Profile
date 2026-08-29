import type { TextSegment } from '../data/about'

// Paints a run of copy that carries mixed weights (the reference design leans
// on bold and serif-italic emphasis inside otherwise plain sentences). The
// TEXT is never authored here - it comes from src/data/, already split - so
// this component cannot change what the page says, only how it looks.
//
// Both emphases resolve to ink-strong. In the Hakkımda statement the
// surrounding text is already ink-strong, so it is a no-op there; in the hero,
// where the paragraph is ink-body, it is what makes the emphasis read.
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
