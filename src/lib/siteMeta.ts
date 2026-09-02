export const SITE_NAME = 'Ensar Aslan'
export const SITE_ROLE = 'Full Stack .NET Developer'
export const DEFAULT_TITLE = `${SITE_NAME} | ${SITE_ROLE}`

export const SITE_URL = 'https://ensaraslan.vercel.app'

const MAX_DESCRIPTION_LENGTH = 160

export function truncateForDescription(text: string, maxLength = MAX_DESCRIPTION_LENGTH): string {
  const collapsed = text.replace(/\s+/g, ' ').trim()
  if (collapsed.length <= maxLength) return collapsed

  const cut = collapsed.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:]$/, '')}...`
}

export function firstSentence(text: string): string {
  const match = /^.*?[.!?](?=\s|$)/.exec(text.trim())
  return (match ? match[0] : text).trim()
}
