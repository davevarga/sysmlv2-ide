import { defineConfig } from 'vitest/config'

// One Vitest project per package, so backend and UI tests run (and fail) separately.
export default defineConfig({
  test: {
    projects: ['packages/language', 'apps/desktop']
  }
})
