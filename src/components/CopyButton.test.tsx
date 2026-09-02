import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CopyButton from './CopyButton'

const setClipboard = (impl: (() => Promise<void>) | null) => {
  Object.defineProperty(navigator, 'clipboard', {
    value: impl ? { writeText: vi.fn(impl) } : undefined,
    configurable: true,
    writable: true,
  })
}

afterEach(() => {
  setClipboard(null)
})

describe('CopyButton', () => {
  it('names itself for the thing it copies, not just "kopyala"', () => {
    setClipboard(async () => {})
    render(<CopyButton value="a@b.com" label="E-posta" />)
    expect(screen.getByRole('button', { name: 'E-posta kopyala' })).toBeInTheDocument()
  })

  it('writes the value to the clipboard and confirms it', async () => {
    const writes: string[] = []
    setClipboard(async function (this: unknown) {
      return undefined
    })
    ;(navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mockImplementation(
      async (text: string) => {
        writes.push(text)
      },
    )

    render(<CopyButton value="ensaraslannn@gmail.com" label="E-posta" />)
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => expect(writes).toEqual(['ensaraslannn@gmail.com']))
    await waitFor(() =>
      expect(screen.getByText('E-posta panoya kopyalandı')).toBeInTheDocument(),
    )
  })

  it('reports a failure instead of pretending it worked', async () => {
    setClipboard(null)
    render(<CopyButton value="a@b.com" label="E-posta" />)
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(screen.getByText('E-posta kopyalanamadı')).toBeInTheDocument())
    expect(screen.queryByText('E-posta panoya kopyalandı')).not.toBeInTheDocument()
  })

  it('rejects a clipboard write that throws', async () => {
    setClipboard(async () => {
      throw new Error('denied')
    })
    render(<CopyButton value="a@b.com" label="E-posta" />)
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(screen.getByText('E-posta kopyalanamadı')).toBeInTheDocument())
  })

  it('is a button, not a link, because it performs an action', () => {
    setClipboard(async () => {})
    const { container } = render(<CopyButton value="a@b.com" label="E-posta" />)
    expect(container.querySelector('a')).toBeNull()
    expect(container.querySelector('button')).toHaveAttribute('type', 'button')
  })
})
