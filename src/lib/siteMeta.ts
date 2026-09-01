// Site-wide metadata defaults and the helpers that derive per-route values
// from owner-supplied copy. Nothing here invents prose: the home description
// is trimmed from the first Hakkımda paragraph, and a project description is
// that project's own first sentence.

export const SITE_NAME = 'Ensar Aslan'
export const SITE_ROLE = 'Full Stack .NET Developer'
export const DEFAULT_TITLE = `${SITE_NAME} | ${SITE_ROLE}`

// The deployed origin, no trailing slash.
//
// canonical, og:url and the hreflang alternates all have to be ABSOLUTE, and
// two of the three consumers cannot ask the browser for it: index.html is a
// static file and scripts/build-seo-files.mjs runs in Node. So the origin is
// written down once here and imported by everything that is able to import
// it, rather than each place deriving its own from window.location.
export const SITE_URL = 'https://ensaraslan.vercel.app'

// Search engines truncate around 160 characters; going much past that just
// wastes the snippet.
const MAX_DESCRIPTION_LENGTH = 160

/**
 * Trims text to a whole word within the snippet budget. Text already inside
 * the budget is returned untouched.
 */
export function truncateForDescription(text: string, maxLength = MAX_DESCRIPTION_LENGTH): string {
  const collapsed = text.replace(/\s+/g, ' ').trim()
  if (collapsed.length <= maxLength) return collapsed

  const cut = collapsed.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:]$/, '')}...`
}

/**
 * First sentence of a description.
 *
 * The lookahead matters: several project descriptions contain ".NET", and a
 * naive split on "." would cut there. Requiring whitespace (or end of string)
 * after the terminator keeps ".NET" intact.
 */
export function firstSentence(text: string): string {
  const match = /^.*?[.!?](?=\s|$)/.exec(text.trim())
  return (match ? match[0] : text).trim()
}
