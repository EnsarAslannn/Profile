import { Fragment } from 'react'
import type { TechGroup } from '../data/projects'

import { useLanguage } from '../i18n/LanguageContext'
import { UI } from '../i18n/ui'

type Props = {
  groups: readonly TechGroup[]
}

// A <dl> rather than the flat <ul> this replaced: each row is genuinely a
// name (Backend) paired with its values, which is what a description list
// means. The group label is a real <dt>, so a screen reader announces which
// part of the stack it is reading instead of one undifferentiated run of
// forty names.
//
// ink-body, never ink-muted: this block sits in the first viewport, where
// ink-muted drops to ~3.90:1 against the PageBackdrop gradient's bluest
// point - see CLAUDE.md's contrast rule.
export default function ProjectTechnologies({ groups }: Props) {
  const { language } = useLanguage()

  return (
    <dl
      data-reveal
      aria-label={UI[language].technologiesUsed}
      className="mt-10 space-y-5 sm:grid sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-x-8 sm:gap-y-4 sm:space-y-0"
    >
      {groups.map((group) => (
        <Fragment key={group.label}>
          <dt className="text-xs font-semibold uppercase tracking-wider text-ink-strong sm:pt-0.5 sm:text-sm">
            {group.label}
          </dt>
          <dd className="mt-2 flex flex-wrap items-center gap-y-1 text-sm text-ink-body sm:mt-0 sm:text-base">
            {group.items.map((item, index) => (
              <span key={item}>
                {item}
                {index < group.items.length - 1 && (
                  <span aria-hidden="true" className="mx-2 text-ink-body">
                    ·
                  </span>
                )}
              </span>
            ))}
          </dd>
        </Fragment>
      ))}
    </dl>
  )
}
