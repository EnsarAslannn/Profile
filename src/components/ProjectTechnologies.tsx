import { Fragment } from 'react'
import type { TechGroup } from '../data/projects'

import { useLanguage } from '../i18n/LanguageContext'
import { UI } from '../i18n/ui'

type Props = {
  groups: readonly TechGroup[]
}

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
