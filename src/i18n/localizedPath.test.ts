import { describe, expect, it } from 'vitest'
import { languageFromPath, stripLanguage, withLanguage } from './localizedPath'

describe('languageFromPath', () => {
  it('reads English off the first segment', () => {
    expect(languageFromPath('/en')).toBe('en')
    expect(languageFromPath('/en/')).toBe('en')
    expect(languageFromPath('/en/hakkimda')).toBe('en')
    expect(languageFromPath('/en/projects/dolfin')).toBe('en')
  })

  it('returns null for an unprefixed path, which is the Turkish original', () => {
    expect(languageFromPath('/')).toBeNull()
    expect(languageFromPath('/hakkimda')).toBeNull()
    expect(languageFromPath('/projects/dolfin')).toBeNull()
  })

  it('matches a whole segment, never a prefix of one', () => {
    expect(languageFromPath('/english')).toBeNull()
    expect(languageFromPath('/entrepreneur')).toBeNull()
    expect(languageFromPath('/projects/en')).toBeNull()
  })

  it('does not treat the default language as a prefix, since it never has one', () => {
    expect(languageFromPath('/tr')).toBeNull()
    expect(languageFromPath('/tr/hakkimda')).toBeNull()
  })
})

describe('stripLanguage', () => {
  it('removes the prefix, leaving the shared base path', () => {
    expect(stripLanguage('/en')).toBe('/')
    expect(stripLanguage('/en/')).toBe('/')
    expect(stripLanguage('/en/hakkimda')).toBe('/hakkimda')
    expect(stripLanguage('/en/projects/dolfin')).toBe('/projects/dolfin')
  })

  it('leaves an unprefixed path untouched', () => {
    expect(stripLanguage('/')).toBe('/')
    expect(stripLanguage('/hakkimda')).toBe('/hakkimda')
    expect(stripLanguage('/english')).toBe('/english')
  })
})

describe('withLanguage', () => {
  it('prefixes a base path for English', () => {
    expect(withLanguage('/', 'en')).toBe('/en')
    expect(withLanguage('/hakkimda', 'en')).toBe('/en/hakkimda')
    expect(withLanguage('/projects/dolfin', 'en')).toBe('/en/projects/dolfin')
  })

  it('leaves Turkish unprefixed, because Turkish is the original', () => {
    expect(withLanguage('/', 'tr')).toBe('/')
    expect(withLanguage('/hakkimda', 'tr')).toBe('/hakkimda')
  })

  it('switches a path from one language to the other without stacking prefixes', () => {
    expect(withLanguage('/en/hakkimda', 'tr')).toBe('/hakkimda')
    expect(withLanguage('/en/hakkimda', 'en')).toBe('/en/hakkimda')
    expect(withLanguage('/en', 'tr')).toBe('/')
    expect(withLanguage('/en', 'en')).toBe('/en')
  })

  it('is idempotent, so the URL-normalising effect cannot loop', () => {
    for (const path of ['/', '/hakkimda', '/en', '/en/projects/dolfin']) {
      for (const language of ['tr', 'en'] as const) {
        const once = withLanguage(path, language)
        expect(withLanguage(once, language)).toBe(once)
      }
    }
  })
})
