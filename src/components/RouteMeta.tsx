import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { LANGUAGE_PARAM } from '../i18n/language'
import { DEFAULT_TITLE } from '../lib/siteMeta'

type Props = {
  title: string
  description: string
  image: string
  type?: 'website' | 'article'
}

export default function RouteMeta({ title, description, image, type = 'website' }: Props) {
  const location = useLocation()
  const { language } = useLanguage()

  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    const origin = window.location.origin
    const absoluteImage = image.startsWith('http') ? image : `${origin}${image}`

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
      setMetaByProperty('og:locale', language === 'en' ? 'en_US' : 'tr_TR'),
      setMetaByProperty('og:locale:alternate', language === 'en' ? 'tr_TR' : 'en_US'),
      setMetaByName('twitter:card', 'summary_large_image'),
      setMetaByName('twitter:title', title),
      setMetaByName('twitter:description', description),
      setMetaByName('twitter:image', absoluteImage),
      setLink('canonical', null, canonical),
      setLink('alternate', 'tr', turkishUrl),
      setLink('alternate', 'en', englishUrl),
      setLink('alternate', 'x-default', turkishUrl),
    ]

    return () => {
      document.title = previousTitle
      for (const restore of applied) restore()
    }
  }, [title, description, image, type, language, location.pathname])

  return null
}

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
