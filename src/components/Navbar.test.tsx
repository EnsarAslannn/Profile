import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Navbar from './Navbar'
import { renderWithRouter } from '../test/renderWithRouter'

describe('Navbar', () => {
  it('renders four links in order at the home route', () => {
    renderWithRouter(<Navbar />, '/')
    const items = screen.getAllByRole('listitem')
    expect(items.map((item) => item.textContent)).toEqual(['Hakkımda', 'Özgeçmiş', 'Projeler', 'İletişim'])
    const hrefs = items.map((item) => item.querySelector('a')?.getAttribute('href'))
    expect(hrefs).toEqual(['/#hakkimda', '/#ozgecmis', '/#projeler', '/#iletisim'])
  })

  it('keeps the same absolute-to-home hrefs on a project detail route', () => {
    renderWithRouter(<Navbar />, '/projects/dolfin')
    const items = screen.getAllByRole('listitem')
    const hrefs = items.map((item) => item.querySelector('a')?.getAttribute('href'))
    expect(hrefs).toEqual(['/#hakkimda', '/#ozgecmis', '/#projeler', '/#iletisim'])
    for (const href of hrefs) {
      expect(href).not.toContain('projects')
    }
  })

  it('keeps the brand link pointed at /#hakkimda on a project detail route', () => {
    renderWithRouter(<Navbar />, '/projects/dolfin')
    expect(screen.getByRole('link', { name: 'Portfolyo' })).toHaveAttribute('href', '/#hakkimda')
  })

  it('never renders a bare #-prefixed href on any route', () => {
    const { container } = renderWithRouter(<Navbar />, '/projects/dolfin')
    const anchors = Array.from(container.querySelectorAll('nav a'))
    for (const anchor of anchors) {
      expect(anchor.getAttribute('href')?.startsWith('#')).toBe(false)
    }
  })
})
