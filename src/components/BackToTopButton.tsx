import ArrowUpIcon from './icons/ArrowUpIcon'

const BUTTON_CLASS =
  'inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-white transition-[opacity] duration-200 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-on-accent active:opacity-80 motion-reduce:transition-none'

// prefers-reduced-motion is read at CLICK time, not at mount: the OS setting
// can change while the page is open, and re-reading per click is simpler
// than wiring up a change listener. Focus moves to #main AFTER the scroll
// call, with preventScroll so it does not fight the scroll we just issued -
// without this a keyboard user is scrolled to the top while focus stays in
// the footer, and the next Tab continues from there instead of from the top.
export default function BackToTopButton() {
  const handleClick = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    document.getElementById('main')?.focus({ preventScroll: true })
  }

  return (
    <button type="button" className={BUTTON_CLASS} onClick={handleClick}>
      <ArrowUpIcon className="h-4 w-4 shrink-0" />
      Yukarı çık
    </button>
  )
}
