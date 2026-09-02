import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import RouteMeta from './RouteMeta'
import { LanguageContext } from '../i18n/LanguageContext'
import type { Language } from '../i18n/language'

function metaContent(selector: string) {
  return document.head.querySelector<HTMLMetaElement>(selector)?.content
}

function linkHref(selector: string) {
  return document.head.querySelector<HTMLLinkElement>(selector)?.getAttribute('href')
}

function renderMeta(
  props: Partial<React.ComponentProps<typeof RouteMeta>> = {},
  route = '/',
  language: Language = 'tr',
) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <LanguageContext.Provider value={{ language, setLanguage: () => {} }}>
        <RouteMeta
          title="TakeAuction | Ensar Aslan"
          description="Gerçek zamanlı, yüksek trafikli bir online açık artırma sistemi."
          image="/assets/homePage-abc123.webp"
          {...props}
        />
      </LanguageContext.Provider>
    </MemoryRouter>,
  )
}

describe('RouteMeta', () => {
  afterEach(() => {
    document.head.querySelectorAll('meta').forEach((tag) => tag.remove())
    document.head.querySelectorAll('link').forEach((tag) => tag.remove())
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

  describe('canonical and hreflang', () => {
    it('makes the Turkish version canonical to its bare path', () => {
      renderMeta({}, '/hakkimda')
      const origin = window.location.origin
      expect(linkHref('link[rel="canonical"]')).toBe(`${origin}/hakkimda`)
      expect(metaContent('meta[property="og:url"]')).toBe(`${origin}/hakkimda`)
      expect(metaContent('meta[property="og:locale"]')).toBe('tr_TR')
    })

    it('makes the English version canonical to its own ?lang=en address', () => {
      renderMeta({}, '/hakkimda', 'en')
      const origin = window.location.origin
      expect(linkHref('link[rel="canonical"]')).toBe(`${origin}/hakkimda?lang=en`)
      expect(metaContent('meta[property="og:url"]')).toBe(`${origin}/hakkimda?lang=en`)
      expect(metaContent('meta[property="og:locale"]')).toBe('en_US')
    })

    it('publishes both alternates and an x-default, in either language', () => {
      const origin = window.location.origin
      for (const language of ['tr', 'en'] as const) {
        const { unmount } = renderMeta({}, '/projects/dolfin', language)
        expect(linkHref('link[rel="alternate"][hreflang="tr"]')).toBe(
          `${origin}/projects/dolfin`,
        )
        expect(linkHref('link[rel="alternate"][hreflang="en"]')).toBe(
          `${origin}/projects/dolfin?lang=en`,
        )
        expect(linkHref('link[rel="alternate"][hreflang="x-default"]')).toBe(
          `${origin}/projects/dolfin`,
        )
        unmount()
      }
    })

    it('keeps the canonical link separate from the three alternates', () => {
      renderMeta({}, '/')
      expect(document.head.querySelectorAll('link[rel="alternate"]')).toHaveLength(3)
      expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1)
    })
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
