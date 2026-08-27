import { RESUME_GROUPS, toMachineDate } from '../data/resume'

export default function Resume() {
  return (
    <section id="ozgecmis" className="scroll-mt-8 border-t border-line-subtle py-16">
      <h2 className="text-3xl font-bold text-ink-strong">Özgeçmiş</h2>
      <div className="mt-10 space-y-12">
        {RESUME_GROUPS.map((group) => (
          <div key={group.id}>
            <h3 className="text-lg font-semibold text-ink-strong sm:text-xl">{group.heading}</h3>
            <ul className="mt-5 space-y-5">
              {group.entries.map((entry) => (
                <li
                  key={entry.id}
                  className="border-b border-line-subtle pb-5 last:border-b-0 last:pb-0"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <div className="min-w-0 sm:flex-1">
                      <p className="font-medium text-ink-strong">{entry.title}</p>
                      <p className="text-sm text-ink-body sm:text-base">{entry.organization}</p>
                    </div>
                    <p className="shrink-0 text-sm tabular-nums text-ink-muted sm:text-right">
                      <time dateTime={toMachineDate(entry.start)}>{entry.start}</time>
                      {' – '}
                      <time dateTime={toMachineDate(entry.end)}>{entry.end}</time>
                    </p>
                  </div>
                  {entry.description && (
                    <p data-resume-description className="mt-3 text-sm leading-relaxed text-ink-body sm:text-base">
                      {entry.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
