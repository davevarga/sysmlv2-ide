import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const fromHere = (path: string): string => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@renderer': fromHere('./src/renderer/src'),
      // UI tests use the language package's source, so they never need a build first.
      '@sysmlv2-ide/language': fromHere('../../packages/language/src/index.ts')
    }
  },
  test: {
    name: 'ui',
    include: ['test/**/*.test.ts'],
    environment: 'node'
  }
})
