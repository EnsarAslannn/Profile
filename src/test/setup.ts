import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// React Testing Library does not auto-clean when Vitest globals are disabled.
afterEach(() => {
  cleanup()
})

// jsdom implements neither Element.prototype.scrollIntoView (undefined ->
// TypeError) nor window.scrollTo (logs "Not implemented"). ScrollToHash
// calls both on navigation, so every router test needs these no-ops. Plain
// assignments, not vi.spyOn, so `restoreMocks: true` in vitest.config.ts
// (which only restores spies) does not undo them between tests.
Element.prototype.scrollIntoView = () => {}
window.scrollTo = () => {}
