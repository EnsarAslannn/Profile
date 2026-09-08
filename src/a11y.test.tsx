import axe from 'axe-core'
import { describe, expect, it } from 'vitest'
import App from './App'
import { renderWithRouter } from './test/renderWithRouter'

const ROUTES = ['/', '/hakkimda', '/projects/dolfin', '/en', '/en/projects/dolfin']

const DISABLED_IN_JSDOM = {
  'color-contrast': { enabled: false },
  'meta-viewport': { enabled: false },
}

async function violationsOn(route: string) {
  const { container, unmount } = renderWithRouter(<App />, route)

  const results = await axe.run(container, {
    rules: DISABLED_IN_JSDOM,
    resultTypes: ['violations'],
  })

  unmount()
  return results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.length,
    help: violation.help,
    target: violation.nodes[0]?.target?.join(' '),
  }))
}

describe('axe', () => {
  it('is actually inspecting the DOM, and would fail if the page regressed', async () => {
    const broken = document.createElement('div')
    broken.innerHTML = '<img src="/x.webp"><button></button>'
    document.body.appendChild(broken)

    const results = await axe.run(broken, { rules: DISABLED_IN_JSDOM, resultTypes: ['violations'] })
    broken.remove()

    expect(results.violations.map((violation) => violation.id).sort()).toEqual([
      'button-name',
      'image-alt',
    ])
  }, 30_000)

  for (const route of ROUTES) {
    it(
      `finds no accessibility violation on ${route}`,
      async () => {
        expect(await violationsOn(route)).toEqual([])
      },
      30_000,
    )
  }
})
