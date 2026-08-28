type Props = {
  className?: string
}

export default function GraduationCapIcon({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M22 9 12 4 2 9l10 5 10-5Z" />
      <path d="M6 11.5V17c0 1.1 2.7 3 6 3s6-1.9 6-3v-5.5" />
    </svg>
  )
}
