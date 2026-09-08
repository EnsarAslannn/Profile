import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(path.resolve(__dirname, 'index.css'), 'utf8')

function blockAfter(marker: string): string {
  const start = css.indexOf(marker)
  expect(start, `${marker} is gone from src/index.css`).toBeGreaterThan(-1)

  const open = css.indexOf('{', start)
  let depth = 0
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth += 1
    else if (css[i] === '}') {
      depth -= 1
      if (depth === 0) return css.slice(open, i)
    }
  }
  throw new Error(`${marker} is not closed in src/index.css`)
}

function tokensIn(text: string): Record<string, string> {
  return Object.fromEntries(
    [...text.matchAll(/--color-([a-z-]+):\s*(#[0-9a-fA-F]{6})/g)].map((match) => [
      match[1],
      match[2],
    ]),
  )
}

const LIGHT = tokensIn(blockAfter('@theme'))
const DARK = { ...LIGHT, ...tokensIn(blockAfter("[data-tone='dark']")) }

const WHITE = '#ffffff'
const BLACK = '#000000'

const TEXT_FLOOR = 4.5
const UI_FLOOR = 3

function channels(hex: string): number[] {
  return [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16))
}

function luminance(hex: string): number {
  const [r, g, b] = channels(hex).map((value) => {
    const channel = value / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function ratio(foreground: string, background: string): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
  return (lighter + 0.05) / (darker + 0.05)
}

function over(top: string, bottom: string, alpha: number): string {
  const under = channels(bottom)
  return `#${channels(top)
    .map((channel, index) =>
      Math.round(alpha * channel + (1 - alpha) * under[index])
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`
}

const NAVBAR_TINT = 0.8
const navbarOver = (band: string) => over(LIGHT['surface-base'], band, NAVBAR_TINT)

describe('every token pair the palette actually renders', () => {
  const clears = (label: string, foreground: string, background: string, floor: number) => {
    it(`${label} clears ${floor}:1`, () => {
      expect(ratio(foreground, background)).toBeGreaterThanOrEqual(floor)
    })
  }

  describe('on the cream and soft-white grounds', () => {
    for (const ink of ['ink-strong', 'ink-body', 'ink-muted', 'ink-heading'] as const) {
      clears(`${ink} on surface-base`, LIGHT[ink], LIGHT['surface-base'], TEXT_FLOOR)
      clears(`${ink} on surface-raised`, LIGHT[ink], LIGHT['surface-raised'], TEXT_FLOOR)
    }
    clears('accent-base on surface-base', LIGHT['accent-base'], LIGHT['surface-base'], TEXT_FLOOR)
    clears('accent-ink on accent-soft', LIGHT['accent-ink'], LIGHT['accent-soft'], TEXT_FLOOR)
    clears('cta-ink on cta-base', LIGHT['cta-ink'], LIGHT['cta-base'], TEXT_FLOOR)
    clears('cta-ink on cta-hover', LIGHT['cta-ink'], LIGHT['cta-hover'], TEXT_FLOOR)
    clears('cta-ink on cta-active', LIGHT['cta-ink'], LIGHT['cta-active'], TEXT_FLOOR)
    clears('the focus ring on surface-base', LIGHT['focus'], LIGHT['surface-base'], UI_FLOOR)
    clears('the availability dot on surface-base', LIGHT['status-open'], LIGHT['surface-base'], UI_FLOOR)
  })

  describe('inside a data-tone="dark" band', () => {
    for (const ink of ['ink-strong', 'ink-body', 'ink-muted', 'ink-heading'] as const) {
      clears(`${ink} on the band`, DARK[ink], DARK['surface-base'], TEXT_FLOOR)
      clears(`${ink} on surface-raised`, DARK[ink], DARK['surface-raised'], TEXT_FLOOR)
    }
    clears('accent-base on the band', DARK['accent-base'], DARK['surface-base'], TEXT_FLOOR)
    clears('accent-base on surface-raised', DARK['accent-base'], DARK['surface-raised'], TEXT_FLOOR)
    clears('cta-ink on cta-base', DARK['cta-ink'], DARK['cta-base'], TEXT_FLOOR)
    clears('the focus ring on the band', DARK['focus'], DARK['surface-base'], UI_FLOOR)
  })

  describe('through the translucent navbar, which no DOM sweep can measure', () => {
    const bands: [string, string][] = [
      ['cream', LIGHT['surface-base']],
      ['the neutral strip', LIGHT['surface-sunken']],
      ['a deep-green band', DARK['surface-base']],
      ['a white photograph', WHITE],
      ['a black photograph', BLACK],
    ]

    for (const [name, band] of bands) {
      clears(`ink-strong over ${name}`, LIGHT['ink-strong'], navbarOver(band), TEXT_FLOOR)
      clears(
        `the active underline over ${name}`,
        LIGHT['accent-base'],
        navbarOver(band),
        UI_FLOOR,
      )
    }
  })
})

describe('the figures CLAUDE.md quotes', () => {
  const pins: [string, number, number][] = [
    ['ink-muted on cream', ratio(LIGHT['ink-muted'], LIGHT['surface-base']), 4.87],
    ['ink-muted on soft white', ratio(LIGHT['ink-muted'], LIGHT['surface-raised']), 5.25],
    ['ink-muted on the neutral strip', ratio(LIGHT['ink-muted'], LIGHT['surface-sunken']), 4.43],
    ['ink-muted on the backdrop wash', ratio(LIGHT['ink-muted'], LIGHT['backdrop-from']), 4.74],
    ['accent-base on cream', ratio(LIGHT['accent-base'], LIGHT['surface-base']), 5.33],
    ['accent-ink on accent-soft', ratio(LIGHT['accent-ink'], LIGHT['accent-soft']), 5.11],
    ['white on accent-soft', ratio(WHITE, LIGHT['accent-soft']), 3.69],
    ['accent-base on accent-ink', ratio(LIGHT['accent-base'], LIGHT['accent-ink']), 3.2],
    ['cta-ink on cta-base', ratio(LIGHT['cta-ink'], LIGHT['cta-base']), 13.26],
    ['cta-ink on cta-hover', ratio(LIGHT['cta-ink'], LIGHT['cta-hover']), 9.5],
    ['cta-ink on cta-active', ratio(LIGHT['cta-ink'], LIGHT['cta-active']), 15.94],
    [
      'accent-active on surface-raised in a dark band',
      ratio(DARK['accent-active'], DARK['surface-raised']),
      4.2,
    ],
    [
      'accent-active on the dark band itself',
      ratio(DARK['accent-active'], DARK['surface-base']),
      5.02,
    ],
    [
      'the worst ink on a RoadmapCard',
      ratio(DARK['ink-muted'], DARK['surface-raised']),
      4.99,
    ],
    ['ink-strong through the navbar over cream', ratio(LIGHT['ink-strong'], navbarOver(LIGHT['surface-base'])), 17.05],
    ['ink-strong through the navbar over the strip', ratio(LIGHT['ink-strong'], navbarOver(LIGHT['surface-sunken'])), 16.73],
    ['ink-strong through the navbar over deep green', ratio(LIGHT['ink-strong'], navbarOver(DARK['surface-base'])), 11.73],
    ['ink-strong through the navbar over white', ratio(LIGHT['ink-strong'], navbarOver(WHITE)), 17.38],
    ['ink-strong through the navbar over black', ratio(LIGHT['ink-strong'], navbarOver(BLACK)), 10.64],
    ['the underline through the navbar over cream', ratio(LIGHT['accent-base'], navbarOver(LIGHT['surface-base'])), 5.33],
    ['the underline through the navbar over deep green', ratio(LIGHT['accent-base'], navbarOver(DARK['surface-base'])), 3.67],
    ['the underline through the navbar over the strip', ratio(LIGHT['accent-base'], navbarOver(LIGHT['surface-sunken'])), 5.23],
  ]

  for (const [label, measured, documented] of pins) {
    it(`${label} is still ${documented}:1`, () => {
      expect(measured).toBeCloseTo(documented, 1)
    })
  }
})

describe('the two pairs CLAUDE.md marks as out of bounds', () => {
  it('ink-muted on the neutral strip is still under the floor, which is why nothing renders it there', () => {
    expect(ratio(LIGHT['ink-muted'], LIGHT['surface-sunken'])).toBeLessThan(TEXT_FLOOR)
  })

  it('accent-active on a dark card is still under the floor, which is why no link sits in one', () => {
    expect(ratio(DARK['accent-active'], DARK['surface-raised'])).toBeLessThan(TEXT_FLOOR)
  })
})
