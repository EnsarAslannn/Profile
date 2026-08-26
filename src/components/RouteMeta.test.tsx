import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import RouteMeta from './RouteMeta'

function metaContent(selector: string) {
  return document.head.querySelector<HTMLMetaElement>(selector)?.content
}

function renderMeta(props: Partial<React.ComponentProps<typeof RouteMeta>> = {}, route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <RouteMeta
        title="TakeAuction | Ensar Aslan"
        description="Gerçek zamanlı, yüksek trafikli bir online açık artırma sistemi."
        image="/assets/homePage-abc123.webp"
        {...props}
      />
    </MemoryRouter>,
  )
}

describe('RouteMeta', () => {
  afterEach(() => {
    document.head.querySelectorAll('meta').forEach((tag) => tag.remove())
    document.title = ''
  })

  it('sets the document title', () => {
    renderMeta()
    expect(document.title).toBe('TakeAuction | Ensar Aslan')
  })

  it('sets description, Open Graph and Twitter tags', () => {
    renderMeta({ type: 'article' })

    const description = 'Gerçek zamanlı, yüksek trafikli bir online açık artırma sistemi.'
    expect(metaContent('meta[name="description"]')).toBe(description)
    expect(metaContent('meta[property="og:title"]')).toBe('TakeAuction | Ensar Aslan')
    expect(metaContent('meta[property="og:description"]')).toBe(description)
    expect(metaContent('meta[property="og:type"]')).toBe('article')
    expect(metaContent('meta[name="twitter:card"]')).toBe('summary_large_image')
    expect(metaContent('meta[name="twitter:description"]')).toBe(description)
  })

  it('resolves a bundled asset path to an absolute og:image URL', () => {
    renderMeta()
    const image = metaContent('meta[property="og:image"]')
    expect(image).toBe(`${window.location.origin}/assets/homePage-abc123.webp`)
    expect(metaContent('meta[name="twitter:image"]')).toBe(image)
  })

  it('leaves an already-absolute image URL alone', () => {
    renderMeta({ image: 'https://cdn.example.com/cover.webp' })
    expect(metaContent('meta[property="og:image"]')).toBe('https://cdn.example.com/cover.webp')
  })

  it('builds og:url from the current route', () => {
    renderMeta({}, '/projects/takeauction')
    expect(metaContent('meta[property="og:url"]')).toBe(
      `${window.location.origin}/projects/takeauction`,
    )
  })

  it('restores the previous title and tag values on unmount', () => {
    document.title = 'önceki'
    const existing = document.createElement('meta')
    existing.setAttribute('name', 'description')
    existing.setAttribute('content', 'statik varsayılan')
    document.head.appendChild(existing)

    const { unmount } = renderMeta()
    expect(metaContent('meta[name="description"]')).not.toBe('statik varsayılan')

    unmount()
    expect(document.title).toBe('önceki')
    expect(metaContent('meta[name="description"]')).toBe('statik varsayılan')
  })
})
