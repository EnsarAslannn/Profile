import { useEffect, useRef, useState } from 'react'
import CheckIcon from './icons/CheckIcon'
import CopyIcon from './icons/CopyIcon'
import { useLanguage } from '../i18n/LanguageContext'
import { UI } from '../i18n/ui'

type Props = {
  value: string
  label: string
}

type State = 'idle' | 'copied' | 'failed'

const FEEDBACK_MS = 2000

export default function CopyButton({ value, label }: Props) {
  const { language } = useLanguage()
  const ui = UI[language]
  const [state, setState] = useState<State>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const copy = async () => {
    if (timer.current) clearTimeout(timer.current)
    try {
      if (!navigator.clipboard) throw new Error('clipboard unavailable')
      await navigator.clipboard.writeText(value)
      setState('copied')
    } catch {
      setState('failed')
    }
    timer.current = setTimeout(() => setState('idle'), FEEDBACK_MS)
  }

  const copied = state === 'copied'

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? ui.copiedAriaLabel(label) : ui.copyAriaLabel(label)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-subtle bg-surface-raised text-ink-body transition-colors duration-200 hover:border-accent-base hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:text-accent-active"
      >
        {copied ? (
          <CheckIcon className="h-4 w-4 text-accent-hover" />
        ) : (
          <CopyIcon className="h-4 w-4" />
        )}
      </button>
      <span aria-live="polite" className="sr-only">
        {state === 'copied' ? ui.copyAnnouncement(label) : ''}
        {state === 'failed' ? ui.copyFailedAnnouncement(label) : ''}
      </span>
    </>
  )
}
