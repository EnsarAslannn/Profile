import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

function collectTsxFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectTsxFiles(fullPath))
    } else if (entry.name.endsWith('.tsx')) {
      files.push(fullPath)
    }
  }
  return files
}

describe('theme token migration', () => {
  it('no component still references a literal-colour token', () => {
    const files = collectTsxFiles(join(process.cwd(), 'src'))
    const pattern = /\b(?:navy|accent-(?:300|400|600))-/
    const offenders = files.filter((file) => pattern.test(readFileSync(file, 'utf-8')))
    expect(offenders).toEqual([])
  })
})

describe('heading rule removal', () => {
  it('no component still renders the heading accent bar', () => {
    const files = collectTsxFiles(join(process.cwd(), 'src'))
    const offenders = files.filter((file) => {
      const lines = readFileSync(file, 'utf-8').split('\n')
      return lines.some(
        (line) => line.includes('h-1') && line.includes('w-12') && line.includes('bg-accent-base'),
      )
    })
    expect(offenders).toEqual([])
  })
})
