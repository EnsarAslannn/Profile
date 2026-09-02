type Props = {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  lang?: string
}

export default function SectionHeading({ title, subtitle, align = 'left', lang }: Props) {
  const centered = align === 'center'

  return (
    <div className={centered ? 'text-center' : ''}>
      <h2
        data-reveal
        {...(lang ? { lang } : {})}
        className="text-4xl font-bold tracking-tight text-ink-heading uppercase sm:text-5xl lg:text-6xl"
      >
        {title}
      </h2>
      {subtitle && (
        <p
          data-reveal
          className={`mt-6 font-serif text-lg italic leading-relaxed text-ink-body [--reveal-delay:80ms] sm:text-xl ${
            centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
