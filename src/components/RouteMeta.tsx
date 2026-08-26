import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
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

  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    const origin = window.location.origin
    const absoluteImage = image.startsWith('http') ? image : `${origin}${image}`
    const url = `${origin}${location.pathname}`

    const applied = [
      setMetaByName('description', description),
      setMetaByProperty('og:title', title),
      setMetaByProperty('og:description', description),
      setMetaByProperty('og:image', absoluteImage),
      setMetaByProperty('og:type', type),
      setMetaByProperty('og:url', url),
      setMetaByName('twitter:card', 'summary_large_image'),
      setMetaByName('twitter:title', title),
      setMetaByName('twitter:description', description),
      setMetaByName('twitter:image', absoluteImage),
    ]

    return () => {
      document.title = previousTitle
      for (const restore of applied) restore()
    }
  }, [title, description, image, type, location.pathname])

  return null
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
