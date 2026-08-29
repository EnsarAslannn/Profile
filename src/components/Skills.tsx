import { Fragment } from 'react'
import SectionHeading from './SectionHeading'
import { SKILL_GROUPS } from '../data/skills'
import { TECH_LOGOS, logosFirst } from '../data/techLogos'
import { revealDelayClass } from '../lib/useReveal'

// The stack section. The group label sits to the LEFT of its technologies
// rather than above them (owner's request), which is what a <dl> means: a
// name paired with its values. Same structure ProjectTechnologies already
// uses on the detail pages.
//
// Below sm: the pair stacks anyway - two 170px columns would break
// "Vertical Slice Architecture" across four lines.
export default function Skills() {
  return (
    <section id="yetenekler" className="scroll-mt-24 border-t border-line-subtle py-20 sm:py-24">
      <SectionHeading title="Stacks" lang="en" />

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
                {/* The number sits OUTSIDE the heading: inside, a screen
                    reader would announce "zero one Languages and Frameworks"
                    as the heading's name. Ordinal decoration, nothing more. */}
                <span aria-hidden="true" className="font-mono text-xs text-ink-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {/* lang="en" is load-bearing - see the note in
                    src/data/skills.ts: the page is lang="tr" and CSS uppercase
                    would otherwise render ARCHİTECTURE. */}
                <h3
                  lang="en"
                  className="text-xs font-semibold tracking-[0.2em] text-ink-strong uppercase sm:text-sm"
                >
                  {group.heading}
                </h3>
              </dt>

              <dd>
                {/* lang="en" again, on the names this time. They are not
                    uppercased here so casing is not the reason - pronunciation
                    is: a Turkish speech synthesiser reading "Entity Framework
                    Core" is not what these words are. */}
                <ul lang="en" className="flex flex-wrap items-center gap-x-7 gap-y-4 sm:gap-x-9">
                  {logosFirst(group.items).map((item) => {
                    const logo = TECH_LOGOS[item]
                    return (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-base text-ink-body transition-colors duration-200 hover:text-ink-strong sm:text-lg"
                      >
                        {logo && (
                          // Decoration: the technology's name is right beside
                          // it, so an alt text would just say the same word
                          // twice.
                          //
                          // Fixed HEIGHT, free width, capped at max-w-10. The
                          // supplied logos run from square marks to very wide
                          // wordmarks (axios is 2500x372); a square box would
                          // shrink those to an illegible sliver, and an
                          // uncapped width would let them run 160px wide. The
                          // height is what reserves the space, so the
                          // width/height attributes cannot cause a shift.
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
    </section>
  )
}
