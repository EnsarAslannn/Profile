import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import AppError from './AppError'
import LanguageProvider from '../i18n/LanguageProvider'
import { UI } from '../i18n/ui'

function renderAt(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <LanguageProvider>
        <AppError />
        <CurrentPath />
      </LanguageProvider>
    </MemoryRouter>,
  )
}

function CurrentPath() {
  return <output data-testid="path">{useLocation().pathname}</output>
}

describe('AppError', () => {
  it('announces itself and says what happened, in the reader language', () => {
    renderAt('/hakkimda')
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: UI.tr.errorTitle })).toBeInTheDocument()
    expect(screen.getByText(UI.tr.errorBody)).toBeInTheDocument()
  })

  it('speaks English on an English route', () => {
    renderAt('/en/hakkimda')
    expect(screen.getByRole('heading', { level: 1, name: UI.en.errorTitle })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: UI.en.errorAction })).toHaveAttribute('href', '/en')
  })

  it('points its way out at the home page of the language that failed', () => {
    renderAt('/projects/dolfin')
    expect(screen.getByRole('link', { name: UI.tr.errorAction })).toHaveAttribute('href', '/')
  })

  it('recovers with a real document navigation, not a router one', () => {
    renderAt('/')

    fireEvent.click(screen.getByRole('link', { name: UI.tr.errorAction }))

    expect(screen.getByTestId('path').textContent).toBe('/')
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('carries a focusable main, so the skip link still lands somewhere', () => {
    const { container } = renderAt('/')
    const main = container.querySelector('main#main')
    expect(main).not.toBeNull()
    expect(main).toHaveAttribute('tabindex', '-1')
  })
})
