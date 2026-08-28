import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Hero from './Hero'
import { ABOUT_PARAGRAPHS } from '../data/about'

describe('Hero', () => {
  it('renders Hakkımda as the only h1', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1, name: 'Hakkımda' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading')).toHaveLength(1)
  })

  it('keeps the section anchor the footer links to', () => {
    const { container } = render(<Hero />)
    expect(container.querySelector('section#hakkimda')).not.toBeNull()
  })

  it('renders the About prose as four paragraphs', () => {
    const { container } = render(<Hero />)
    expect(container.querySelectorAll('p[data-about-paragraph]')).toHaveLength(4)
  })

  // Rendering is Hero's contract; the verbatim wording is guarded once, in
  // src/data/about.test.ts. Asserting the strings again here would mean a
  // third copy to update on every copy change, and would fail for the wrong
  // reason - a copy edit is not a Hero regression.
  it('renders every owner-supplied paragraph, in order', () => {
    const { container } = render(<Hero />)
    const rendered = [...container.querySelectorAll('p[data-about-paragraph]')].map(
      (paragraph) => paragraph.textContent,
    )
    expect(rendered).toEqual(ABOUT_PARAGRAPHS.map((paragraph) => paragraph.text))
  })

  it('renders the profile card alongside the prose', () => {
    render(<Hero />)
    expect(screen.getByRole('img', { name: 'Ensar Aslan' })).toBeInTheDocument()
  })

  it('places the card and the prose in adjacent grid columns separated by a real gap', () => {
    const { container } = render(<Hero />)
    const grid = container.querySelector('section#hakkimda > div')
    expect(grid).not.toBeNull()
    const gridClasses = grid!.className

    // Structure only, never the exact numbers - ui-agent must stay free to
    // retune the card width. Two tracks: a fixed card track, then a
    // minmax(0,1fr) prose track that absorbs the slack. The previous layout
    // put a `1fr` gutter BETWEEN them, which meant every pixel of slack piled
    // up in the middle - ~240px of empty space on a wide screen, reading as a
    // hole between two islands. minmax(0,...) rather than a bare 1fr so a long
    // unbreakable token cannot push the track past the container.
    expect(gridClasses).toMatch(/lg:grid-cols-\[\S+?_minmax\(0,1fr\)\]/)
    expect(gridClasses).toMatch(/xl:grid-cols-\[\S+?_minmax\(0,1fr\)\]/)
    // A gap utility is now the only thing separating the columns, so losing it
    // would butt the prose straight against the card.
    expect(gridClasses).toMatch(/lg:gap-[1-9]/)

    const cardWrapper = screen.getByRole('img', { name: 'Ensar Aslan' }).closest('div[class*="lg:sticky"]')
    expect(cardWrapper).not.toBeNull()
    expect(cardWrapper!.className).toMatch(/lg:col-start-1\b/)

    const proseWrapper = screen.getByRole('heading', { level: 1 }).closest('div[class*="lg:col-start-2"]')
    expect(proseWrapper).not.toBeNull()
    // min-w-0 is load-bearing: without it the prose track refuses to shrink
    // below its content's min-content width and overflows the container.
    expect(proseWrapper!.className).toMatch(/lg:min-w-0\b/)

    // The grid track is the sole measure authority, so a stale max-w-prose on
    // a paragraph would silently re-introduce the leftward drift this layout
    // was built to correct.
    const paragraphs = container.querySelectorAll('p[data-about-paragraph]')
    for (const paragraph of paragraphs) {
      expect(paragraph.className).not.toMatch(/max-w-prose/)
    }
  })
})
