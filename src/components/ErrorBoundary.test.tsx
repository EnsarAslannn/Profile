import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ErrorBoundary from './ErrorBoundary'

function Boom(): never {
  throw new Error('boom')
}

function silenceReact() {
  return vi.spyOn(console, 'error').mockImplementation(() => {})
}

describe('ErrorBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders its children while nothing has thrown', () => {
    render(
      <ErrorBoundary fallback={<p>yedek</p>}>
        <p>içerik</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('içerik')).toBeInTheDocument()
    expect(screen.queryByText('yedek')).not.toBeInTheDocument()
  })

  it('shows the fallback instead of an empty page when a child throws', () => {
    silenceReact()

    render(
      <ErrorBoundary fallback={<p>yedek</p>}>
        <Boom />
      </ErrorBoundary>,
    )

    expect(screen.getByText('yedek')).toBeInTheDocument()
  })

  it('contains the failure, leaving everything outside it rendered', () => {
    silenceReact()

    render(
      <div>
        <header>navbar</header>
        <ErrorBoundary fallback={<p>yedek</p>}>
          <Boom />
        </ErrorBoundary>
        <footer>iletişim</footer>
      </div>,
    )

    expect(screen.getByText('navbar')).toBeInTheDocument()
    expect(screen.getByText('iletişim')).toBeInTheDocument()
    expect(screen.getByText('yedek')).toBeInTheDocument()
  })

  it('starts clean again when the key changes, so a failed route does not stick', () => {
    silenceReact()

    const { rerender } = render(
      <ErrorBoundary key="/patlak" fallback={<p>yedek</p>}>
        <Boom />
      </ErrorBoundary>,
    )
    expect(screen.getByText('yedek')).toBeInTheDocument()

    rerender(
      <ErrorBoundary key="/saglam" fallback={<p>yedek</p>}>
        <p>içerik</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('içerik')).toBeInTheDocument()
    expect(screen.queryByText('yedek')).not.toBeInTheDocument()
  })
})
