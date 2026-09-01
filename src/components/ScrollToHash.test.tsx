import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ScrollToHash from './ScrollToHash'

function renderAt(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <section id="projeler">Projeler</section>
      <ScrollToHash />
    </MemoryRouter>,
  )
}

describe('ScrollToHash', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('scrolls the matching section into view when the location has a hash', () => {
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')
    renderAt('/#projeler')
    expect(scrollIntoView).toHaveBeenCalled()
  })

  it('scrolls to the top when the location has no hash', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo')
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')
    renderAt('/')
    expect(scrollTo).toHaveBeenCalledWith(0, 0)
    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('does nothing and does not throw when the hash matches no element', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo')
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')
    expect(() => renderAt('/#yoktur')).not.toThrow()
    expect(scrollTo).not.toHaveBeenCalled()
    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('re-scrolls on a repeat navigation to the same hash', () => {
    // Navigates within ONE mounted tree, so the effect only re-runs if it
    // genuinely depends on location.key. A remount-based test would pass even
    // with an empty dependency array and would protect nothing.
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')

    function GoToProjeler() {
      const navigate = useNavigate()
      return <button onClick={() => navigate({ pathname: '/', hash: '#projeler' })}>git</button>
    }

    render(
      <MemoryRouter initialEntries={['/']}>
        <section id="projeler">Projeler</section>
        <GoToProjeler />
        <ScrollToHash />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'git' }))
    expect(scrollIntoView).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: 'git' }))
    expect(scrollIntoView).toHaveBeenCalledTimes(2)
  })

  // A language switch is a `replace` navigation that changes only the query
  // string, and React Router mints a fresh location.key for it - so without
  // the search-only guard below this component fires scrollTo(0, 0) and throws
  // a reader who had scrolled down to Projeler straight back to the top.
  it('does not scroll when a navigation changes only the query string', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo')

    render(
      <MemoryRouter initialEntries={['/']}>
        <SwitchLanguage />
        <ScrollToHash />
      </MemoryRouter>,
    )

    const before = scrollTo.mock.calls.length
    fireEvent.click(screen.getByRole('button', { name: 'EN' }))
    expect(scrollTo.mock.calls.length).toBe(before)
  })

  it('does not re-scroll to the hash when a query-only navigation keeps it', () => {
    // The same switch, but from a URL that already carries an anchor.
    // Re-running scrollIntoView is less violent than jumping to the top, but
    // it is still a jump the reader did not ask for - they may well have
    // scrolled on past the anchor before reaching for the language control.
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')

    render(
      <MemoryRouter initialEntries={['/#projeler']}>
        <section id="projeler">Projeler</section>
        <SwitchLanguage />
        <ScrollToHash />
      </MemoryRouter>,
    )

    expect(scrollIntoView).toHaveBeenCalledTimes(1)
    fireEvent.click(screen.getByRole('button', { name: 'EN' }))
    expect(scrollIntoView).toHaveBeenCalledTimes(1)
  })
})

// Shaped exactly like LanguageProvider.setLanguage: a replace navigation that
// carries pathname and hash through untouched and only rewrites the search.
function SwitchLanguage() {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <button
      onClick={() =>
        navigate(
          { pathname: location.pathname, search: '?lang=en', hash: location.hash },
          { replace: true },
        )
      }
    >
      EN
    </button>
  )
}
