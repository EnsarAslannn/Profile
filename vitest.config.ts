import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

// Reuses the app's Vite config (React + Tailwind plugins, resolve rules) so
// components under test compile exactly as they do in dev and build.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      css: true,
      restoreMocks: true,
      // A real suite exists now (Hero/ProfileCard/ContactList/SocialLinks/App).
      // false so a broken `include` glob fails loudly instead of silently
      // passing with zero tests collected.
      passWithNoTests: false,
    },
  }),
)
