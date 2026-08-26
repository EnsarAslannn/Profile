import { render, type RenderResult } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'

// Test helper, not a suite: this filename does not match
// src/**/*.{test,spec}.{ts,tsx}, so Vitest does not collect it.
export function renderWithRouter(ui: ReactElement, route?: string): RenderResult {
  return render(<MemoryRouter initialEntries={[route ?? '/']}>{ui}</MemoryRouter>)
}
