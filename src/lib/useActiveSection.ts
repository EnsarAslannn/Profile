import { useEffect, useState } from 'react'

const ACTIVE_LINE = 0.35

export function pickActiveSection(
  tops: readonly { anchor: string; top: number }[],
  line: number,
  atDocumentEnd: boolean,
): string | null {
  if (tops.length === 0) return null

  if (atDocumentEnd) return tops[tops.length - 1].anchor

  let active: string | null = null
  for (const { anchor, top } of tops) {
    if (top <= line) active = anchor
  }
  return active ?? tops[0].anchor
}

export function useActiveSection(anchors: readonly string[]): string | null {
  const key = anchors.join(',')

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

    sweep()

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [key])

  return measured.key === key ? measured.anchor : null
}
