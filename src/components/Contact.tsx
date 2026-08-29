import ArrowUpRightIcon from './icons/ArrowUpRightIcon'
import CopyButton from './CopyButton'
import SectionHeading from './SectionHeading'
import { CONTACT_ROWS } from '../data/contactRows'
import { CONTENT_CONTAINER } from '../lib/layout'
import { SITE_NAME } from '../lib/siteMeta'
import { revealDelayClass, useReveal } from '../lib/useReveal'

// The reference design's CONTACT section, which is also where the page ends -
// it replaces the old Footer entirely. Rendered outside <Routes> in App.tsx,
// so a project detail page ends the same way the home page does.
//
// Rows are e-posta, LinkedIn, GitHub, konum (src/data/contactRows.ts). The
// phone number is deliberately NOT among them: five-owner-changes Task 5
// dropped the footer's tel: row, and it still lives in ProfileCard, now on
// /hakkimda.
const VALUE_CLASS = 'text-xl font-semibold sm:text-2xl lg:text-3xl'

export default function Contact() {
  const revealRoot = useReveal<HTMLElement>()

  return (
    <footer ref={revealRoot}>
      <div className={CONTENT_CONTAINER}>
        <section id="iletisim" className="scroll-mt-24 border-t border-line-subtle py-20 sm:py-24">
          <SectionHeading
            title="İletişim"
            subtitle="Yeni bir proje ya da ekip fırsatı için doğrudan yazabilirsiniz."
            align="center"
          />

          <dl className="mt-16 sm:mt-20">
            {CONTACT_ROWS.map((row, index) => {
              const Icon = row.icon
              return (
                <div
                  key={row.id}
                  data-reveal
                  className={`flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line-subtle py-7 last:border-b sm:py-8 ${revealDelayClass(index)}`}
                >
                  <dt
                    {...(row.lang ? { lang: row.lang } : {})}
                    className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-ink-muted uppercase sm:text-sm"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-accent-base" />
                    {row.label}
                  </dt>
                  <dd className="min-w-0 sm:text-right">
                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                      {row.href ? (
                        <a
                          href={row.href}
                          {...(row.external
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                          className={`group inline-flex items-center gap-4 rounded break-all text-ink-strong transition-colors duration-200 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:text-accent-active ${VALUE_CLASS}`}
                        >
                          {row.value}
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line-subtle transition-colors duration-200 group-hover:border-accent-base">
                            <ArrowUpRightIcon className="h-4 w-4" />
                          </span>
                        </a>
                      ) : (
                        <span className={`text-ink-strong ${VALUE_CLASS}`}>{row.value}</span>
                      )}
                      {row.copyable && <CopyButton value={row.value} label={row.label} />}
                    </div>
                    {row.note && (
                      <p className="mt-2 text-sm leading-relaxed text-ink-body">{row.note}</p>
                    )}
                  </dd>
                </div>
              )
            })}
          </dl>
        </section>

        <div className="flex flex-col items-center justify-between gap-4 py-10 sm:flex-row">
          {/* Availability. The dot is decoration - the sentence beside it says
              the same thing - so it is aria-hidden, and its pulse stops for a
              visitor who asked for less motion. */}
          <p className="flex items-center gap-2.5 text-sm text-ink-body">
            <span aria-hidden="true" className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-open opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-status-open" />
            </span>
            Yeni fırsatlara açık
          </p>
          <p className="text-sm text-ink-muted">
            &copy; {new Date().getFullYear()} {SITE_NAME}. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}
