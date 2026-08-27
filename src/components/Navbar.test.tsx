import { act, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Navbar from './Navbar'
import { renderWithRouter } from '../test/renderWithRouter'

describe('Navbar', () => {
  it('renders three links in order at the home route', () => {
    renderWithRouter(<Navbar />, '/')
    const items = screen.getAllByRole('listitem')
    expect(items.map((item) => item.textContent)).toEqual(['Hakkımda', 'Projeler', 'Özgeçmiş'])
    const hrefs = items.map((item) => item.querySelector('a')?.getAttribute('href'))
    expect(hrefs).toEqual(['/#hakkimda', '/#projeler', '/#ozgecmis'])
  })

  it('keeps the same absolute-to-home hrefs on a project detail route', () => {
    renderWithRouter(<Navbar />, '/projects/dolfin')
    const items = screen.getAllByRole('listitem')
    const hrefs = items.map((item) => item.querySelector('a')?.getAttribute('href'))
    expect(hrefs).toEqual(['/#hakkimda', '/#projeler', '/#ozgecmis'])
    for (const href of hrefs) {
      expect(href).not.toContain('projects')
    }
  })

  it('keeps the brand link pointed at /#hakkimda on a project detail route', () => {
    renderWithRouter(<Navbar />, '/projects/dolfin')
    expect(screen.getByRole('link', { name: 'Anasayfa' })).toHaveAttribute('href', '/#hakkimda')
  })

  it('never renders a bare #-prefixed href on any route', () => {
    const { container } = renderWithRouter(<Navbar />, '/projects/dolfin')
    const anchors = Array.from(container.querySelectorAll('nav a'))
    for (const anchor of anchors) {
      expect(anchor.getAttribute('href')?.startsWith('#')).toBe(false)
    }
  })

  it('never puts ink-muted on the nav link list, since the bar can go fully transparent', () => {
    const { container } = renderWithRouter(<Navbar />, '/')
    const list = container.querySelector('nav ul')!
    expect(list.className.split(' ')).not.toContain('text-ink-muted')
    const anchors = Array.from(container.querySelectorAll('nav ul a'))
    expect(anchors.length).toBeGreaterThan(0)
    for (const anchor of anchors) {
      expect(anchor.className.split(' ')).not.toContain('text-ink-muted')
    }
  })

  it('starts transparent at the top of the page and switches to the scrolled state past the threshold', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    const { container } = renderWithRouter(<Navbar />, '/')
    const header = container.querySelector('header')!
    expect(header).toHaveAttribute('data-nav-state', 'top')

    Object.defineProperty(window, 'scrollY', { value: 50, writable: true, configurable: true })
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    expect(header).toHaveAttribute('data-nav-state', 'scrolled')
  })
})
