import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { LANGUAGE_PARAM } from '../i18n/language'
import { DEFAULT_TITLE } from '../lib/siteMeta'

type Props = {
  /** Page title, already formatted (e.g. "TakeAuction | Ensar Aslan"). */
  title: string
  /** Plain-text summary for <meta name="description"> and og:description. */
  description: string
  /** Bundled asset URL for og:image / twitter:image. Resolved to absolute. */
  image: string
  /** Open Graph type: "website" for the home page, "article" for a project. */
  type?: 'website' | 'article'
}

/**
 * Applies per-route metadata to the document head.
 *
 * IMPORTANT LIMITATION: this runs in the browser. Crawlers that execute
 * JavaScript (Google) will see these values, but social-preview scrapers
 * (LinkedIn, X, Slack, WhatsApp) read the raw HTML response and do not run
 * scripts - they will only ever see the static defaults in index.html.
 * Real per-route link previews need prerendering or SSG; see CLAUDE.md.
 */
export default function RouteMeta({ title, description, image, type = 'website' }: Props) {
  const location = useLocation()
  const { language } = useLanguage()

  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    const origin = window.location.origin
    const absoluteImage = image.startsWith('http') ? image : `${origin}${image}`

    // The two language versions of this route. ?lang=en is the only address
    // the English site has, so it is a distinct page rather than a duplicate:
    // each version is canonical to ITSELF and the pair is tied together by
    // the hreflang alternates below. Pointing English at the Turkish URL
    // instead would be telling a crawler not to index it at all.
    const turkishUrl = `${origin}${location.pathname}`
    const englishUrl = `${turkishUrl}?${LANGUAGE_PARAM}=en`
    const canonical = language === 'en' ? englishUrl : turkishUrl

    const applied = [
      setMetaByName('description', description),
      setMetaByProperty('og:title', title),
      setMetaByProperty('og:description', description),
      setMetaByProperty('og:image', absoluteImage),
      setMetaByProperty('og:type', type),
      setMetaByProperty('og:url', canonical),
      // og:locale follows the language for the same reason <html lang> does:
      // it tells a scraper which of the two versions it is looking at.
      setMetaByProperty('og:locale', language === 'en' ? 'en_US' : 'tr_TR'),
      setMetaByProperty('og:locale:alternate', language === 'en' ? 'tr_TR' : 'en_US'),
      setMetaByName('twitter:card', 'summary_large_image'),
      setMetaByName('twitter:title', title),
      setMetaByName('twitter:description', description),
      setMetaByName('twitter:image', absoluteImage),
      setLink('canonical', null, canonical),
      setLink('alternate', 'tr', turkishUrl),
      setLink('alternate', 'en', englishUrl),
      // x-default is where a crawler sends a reader whose language matches
      // neither - Turkish, because it is this site's original.
      setLink('alternate', 'x-default', turkishUrl),
    ]

    return () => {
      document.title = previousTitle
      for (const restore of applied) restore()
    }
  }, [title, description, image, type, language, location.pathname])

  return null
}

/**
 * Sets a <link rel="..."> in the head, creating it if index.html does not
 * already ship one, and returns a function restoring the previous state -
 * the same contract upsertMeta keeps, and for the same reason: a route change
 * must not leave the previous route's canonical URL behind.
 *
 * `hreflang` is part of the key, not just an attribute: a page carries three
 * rel="alternate" links and they are told apart by nothing else.
 */
function setLink(rel: string, hreflang: string | null, href: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`
  const existing = document.head.querySelector<HTMLLinkElement>(selector)

  if (existing) {
    const previousHref = existing.getAttribute('href')
    existing.setAttribute('href', href)
    return () => {
      if (previousHref === null) existing.removeAttribute('href')
      else existing.setAttribute('href', previousHref)
    }
  }

  const created = document.createElement('link')
  created.setAttribute('rel', rel)
  if (hreflang) created.setAttribute('hreflang', hreflang)
  created.setAttribute('href', href)
  document.head.appendChild(created)
  return () => created.remove()
}

function setMetaByName(name: string, content: string) {
  return upsertMeta('name', name, content)
}

function setMetaByProperty(property: string, content: string) {
  return upsertMeta('property', property, content)
}

/**
 * Sets a meta tag, creating it if index.html does not already ship one, and
 * returns a function restoring the previous state so route changes cannot
 * leave a stale tag behind.
 */
function upsertMeta(keyAttribute: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${keyAttribute}="${key}"]`
  const existing = document.head.querySelector<HTMLMetaElement>(selector)

  if (existing) {
    const previousContent = existing.getAttribute('content')
    existing.setAttribute('content', content)
    return () => {
      if (previousContent === null) existing.removeAttribute('content')
      else existing.setAttribute('content', previousContent)
    }
  }

  const created = document.createElement('meta')
  created.setAttribute(keyAttribute, key)
  created.setAttribute('content', content)
  document.head.appendChild(created)
  return () => created.remove()
}

export { DEFAULT_TITLE }
