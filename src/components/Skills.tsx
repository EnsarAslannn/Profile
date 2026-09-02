import { Fragment } from 'react'
import SectionHeading from './SectionHeading'
import { SKILL_GROUPS } from '../data/skills'
import { TECH_LOGOS, logosFirst } from '../data/techLogos'
import { revealDelayClass } from '../lib/useReveal'
import { useLanguage } from '../i18n/LanguageContext'
import { UI } from '../i18n/ui'
import { CONTENT_CONTAINER } from '../lib/layout'

export default function Skills() {
  const { language } = useLanguage()

  return (
    <section id="yetenekler" className="scroll-mt-24 bg-surface-base py-20 sm:py-24">
      <div className={CONTENT_CONTAINER}>
        <SectionHeading title={UI[language].sectionStacks} lang="en" />

        <dl className="mt-14 sm:mt-16">
          {SKILL_GROUPS.map((group, index) => (
            <Fragment key={group.id}>
              <div
                data-reveal
                className={`grid gap-x-8 gap-y-4 border-t border-line-subtle py-7 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:py-8 lg:gap-x-12 ${revealDelayClass(index)} ${
                  index === SKILL_GROUPS.length - 1 ? 'border-b' : ''
                }`}
              >
                <dt className="flex items-baseline gap-4">
                  <span aria-hidden="true" className="font-mono text-xs text-ink-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3
                    lang="en"
                    className="text-xs font-semibold tracking-[0.2em] text-ink-strong uppercase sm:text-sm"
                  >
                    {group.heading}
                  </h3>
                </dt>

                <dd>
                  <ul lang="en" className="flex flex-wrap items-center gap-x-7 gap-y-4 sm:gap-x-9">
                    {logosFirst(group.items).map((item) => {
                      const logo = TECH_LOGOS[item]
                      return (
                        <li
                          key={item}
                          className="flex items-center gap-2.5 text-base text-ink-body transition-colors duration-200 hover:text-ink-strong sm:text-lg"
                        >
                          {logo && (
                            <img
                              src={logo}
                              alt=""
                              aria-hidden="true"
                              width={24}
                              height={24}
                              loading="lazy"
                              decoding="async"
                              className="h-6 w-auto max-w-10 shrink-0 object-contain"
                            />
                          )}
                          {item}
                        </li>
                      )
                    })}
                  </ul>
                </dd>
              </div>
            </Fragment>
          ))}
        </dl>
      </div>
    </section>
  )
}
