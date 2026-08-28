import type { ComponentType } from 'react'
import { RESUME_GROUPS, toMachineDate } from '../data/resume'
import BriefcaseIcon from './icons/BriefcaseIcon'
import GraduationCapIcon from './icons/GraduationCapIcon'

// Keyed by ResumeGroup.id, not by array position, so reordering the groups in
// src/data/resume.ts never silently swaps the icons. A group whose id has no
// entry here simply renders without one rather than crashing.
const GROUP_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  education: GraduationCapIcon,
  experience: BriefcaseIcon,
}

export default function Resume() {
  return (
    <section id="ozgecmis" className="scroll-mt-8 border-t border-line-subtle py-16">
      <h2 className="text-3xl font-bold text-ink-strong sm:text-4xl">Özgeçmiş</h2>
      <div className="mt-10 space-y-14">
        {RESUME_GROUPS.map((group) => {
          const Icon = GROUP_ICONS[group.id]
          return (
            <div key={group.id}>
              <div className="flex items-center gap-4">
                {Icon && (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line-subtle bg-surface-raised text-accent-base shadow-sm shadow-slate-950/5">
                    <Icon className="h-5 w-5" />
                  </span>
                )}
                <h3 className="text-xl font-bold text-ink-strong sm:text-2xl">{group.heading}</h3>
              </div>

              {/* The timeline rail. `ml-6` is load-bearing at EVERY breakpoint,
                  not just sm:+ - it puts the border under the centre of the
                  12-unit icon box above it (half of 3rem), so the line reads as
                  dropping out of the icon rather than floating beside it. Each
                  dot then lands on that border by cancelling the ul's own
                  padding (`-left-5`/`sm:-left-8`) and shifting half its width. */}
              <ul className="mt-6 ml-6 space-y-8 border-l border-line-subtle pl-5 sm:pl-8">
                {group.entries.map((entry) => (
                  <li key={entry.id} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-5 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-accent-base ring-4 ring-surface-base sm:-left-8"
                    />
                    <p className="font-semibold text-ink-strong">{entry.title}</p>
                    <p className="mt-1 text-sm font-medium text-accent-base sm:text-base">
                      {entry.organization}
                    </p>
                    <p className="mt-1 text-sm tabular-nums text-ink-muted">
                      <time dateTime={toMachineDate(entry.start)}>{entry.start}</time>
                      {' – '}
                      <time dateTime={toMachineDate(entry.end)}>{entry.end}</time>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
