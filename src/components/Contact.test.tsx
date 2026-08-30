import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Contact from './Contact'
import { renderWithRouter } from '../test/renderWithRouter'
import { CONTACT_ITEMS } from '../data/contact'
import { CONTACT_ROWS } from '../data/contactRows'
import { SOCIAL_LINKS } from '../data/social'
import { SITE_NAME } from '../lib/siteMeta'

describe('Contact', () => {
  it('carries the iletisim anchor the navbar links to', () => {
    const { container } = renderWithRouter(<Contact />)
    expect(container.querySelector('section#iletisim')).not.toBeNull()
    expect(screen.getByRole('heading', { level: 2, name: 'İletişim' })).toBeInTheDocument()
    expect(container.textContent).not.toMatch(/\[\d{3}]/)
  })

  it('renders the four rows in order, labels first', () => {
    const { container } = renderWithRouter(<Contact />)
    expect(Array.from(container.querySelectorAll('dt')).map((dt) => dt.textContent)).toEqual([
      'E-posta',
      'LinkedIn',
      'GitHub',
      'Konum',
    ])
    // A dd holds more than the value now (a copy button's live region, the
    // location note), so this asserts containment rather than equality.
    const values = Array.from(container.querySelectorAll('dd'))
    expect(values).toHaveLength(CONTACT_ROWS.tr.length)
    for (const [i, dd] of values.entries()) {
      expect(dd.textContent).toContain(CONTACT_ROWS.tr[i].value)
    }
  })

  // Owner's request: the address is copyable, not clickable. Neither the
  // e-posta row nor konum may contain a link - only the two profile rows do.
  it('renders e-posta and konum as plain text, with no mailto', () => {
    const { container } = renderWithRouter(<Contact />)
    const email = CONTACT_ITEMS.tr.find((item) => item.id === 'email')!
    expect(screen.getByText(email.value).closest('a')).toBeNull()
    expect(container.querySelector('a[href^="mailto:"]')).toBeNull()

    for (const label of ['E-posta', 'Konum']) {
      const dt = Array.from(container.querySelectorAll('dt')).find(
        (candidate) => candidate.textContent === label,
      )!
      expect(dt.parentElement?.querySelector('a'), label).toBeNull()
    }
  })

  it('opens the two profile rows in a new tab, safely', () => {
    const { container } = renderWithRouter(<Contact />)
    for (const social of SOCIAL_LINKS.tr) {
      const row = CONTACT_ROWS.tr.find((r) => r.id === social.id)!
      const link = Array.from(container.querySelectorAll('dd a')).find(
        (a) => a.getAttribute('href') === social.href,
      )!
      expect(link, `${social.id} row link`).toBeTruthy()
      expect(link.textContent).toContain(row.value)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  // The labels are CSS-uppercased and the page is lang="tr", where casing maps
  // i -> İ: untagged, these render LİNKEDIN and GİTHUB.
  it('declares the English brand labels English, and the Turkish ones not', () => {
    const { container } = renderWithRouter(<Contact />)
    const byLabel = Object.fromEntries(
      Array.from(container.querySelectorAll('dt')).map((dt) => [dt.textContent, dt]),
    )
    expect(byLabel['LinkedIn'].getAttribute('lang')).toBe('en')
    expect(byLabel['GitHub'].getAttribute('lang')).toBe('en')
    expect(byLabel['E-posta'].getAttribute('lang')).toBeNull()
    expect(byLabel['Konum'].getAttribute('lang')).toBeNull()
  })

  // The phone number was dropped from the footer at the owner's request
  // (five-owner-changes Task 5) and still lives in ProfileCard, now on
  // /hakkimda. Adding rows must not quietly reinstate it.
  it('does not reinstate the phone number the owner removed from the footer', () => {
    const { container } = renderWithRouter(<Contact />)
    const phone = CONTACT_ITEMS.tr.find((item) => item.id === 'phone')!
    expect(container.textContent).not.toContain(phone.value)
    expect(container.querySelector('a[href^="tel:"]')).toBeNull()
  })

  it('gives every row its own icon, hidden from screen readers', () => {
    const { container } = renderWithRouter(<Contact />)
    const labels = Array.from(container.querySelectorAll('dt'))
    expect(labels).toHaveLength(CONTACT_ROWS.tr.length)
    for (const dt of labels) {
      const icon = dt.querySelector('svg')
      expect(icon).not.toBeNull()
      // The label beside it already names the row; an announced icon would
      // just be a second, worse name for the same thing.
      expect(icon!.getAttribute('aria-hidden')).toBe('true')
    }
  })

  // The owner asked for the handle rather than the domain. Asserting the
  // domain's absence is what stops a later "make it clearer" edit pasting the
  // full URL back in.
  it('shows handles, not domains, for the profile rows', () => {
    const { container } = renderWithRouter(<Contact />)
    expect(container.textContent).toContain('/in/ensaraslannn')
    expect(container.textContent).toContain('@EnsarAslannn')
    expect(container.textContent).not.toContain('linkedin.com/')
    expect(container.textContent).not.toContain('github.com/')
  })

  it('offers a copy control for the e-posta row, and only that row', () => {
    renderWithRouter(<Contact />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(1)
    expect(buttons[0]).toHaveAccessibleName('E-posta kopyala')
  })

  it('states the remote-working note beside the konum row', () => {
    const { container } = renderWithRouter(<Contact />)
    expect(container.textContent).toContain('Türkiye / Kocaeli / İstanbul')
    expect(container.textContent).toContain('Remote çalışmaya açığım.')
  })

  // The dot is decoration - the sentence beside it says the same thing - so
  // it must not be announced, and its pulse must stop for a visitor who asked
  // for less motion.
  it('shows the availability line with a decorative status dot', () => {
    const { container } = renderWithRouter(<Contact />)
    const line = screen.getByText(/Yeni fırsatlara açık/)
    const dot = line.querySelector('[aria-hidden="true"]')
    expect(dot).not.toBeNull()
    expect(dot!.textContent).toBe('')
    expect(container.innerHTML).toMatch(/motion-reduce:hidden/)
  })

  // Removed at the owner's request: LinkedIn/GitHub/E-posta pills that
  // duplicated three of the four rows directly above them.
  it('no longer repeats the profile links as footer pills', () => {
    const { container } = renderWithRouter(<Contact />)
    // Every link left in the block is a row value.
    for (const link of Array.from(container.querySelectorAll('a'))) {
      expect(link.closest('dd')).not.toBeNull()
    }
  })

  it('closes with the copyright line, in sentence case', () => {
    const { container } = renderWithRouter(<Contact />)
    const copyright = screen.getByText(/Tüm hakları saklıdır/)
    expect(copyright.textContent).toBe(
      `© ${new Date().getFullYear()} ${SITE_NAME}. Tüm hakları saklıdır.`,
    )
    // It used to be CSS-uppercased with a bullet separator; the owner asked
    // for it softened.
    expect(copyright.className).not.toMatch(/\buppercase\b/)
    expect(container.textContent).not.toContain('•')
  })

  // The old footer's oversized cursor-tracking wordmark was removed at the
  // owner's request for this redesign. Asserting its absence keeps a later
  // "bring back the nice bit" edit deliberate.
  it('renders no decorative wordmark', () => {
    const { container } = renderWithRouter(<Contact />)
    expect(container.querySelector('[data-wordmark]')).toBeNull()
    expect(container.querySelectorAll('svg[aria-hidden="true"]').length).toBeGreaterThan(0)
  })
})
