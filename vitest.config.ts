import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@pansy/toggle-selection': resolve(__dirname, 'packages/toggle-selection/src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: [
      resolve(__dirname, 'packages/.test/setup.ts')
    ],
    reporters: 'dot',
  }
})
