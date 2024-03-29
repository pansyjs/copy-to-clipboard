import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  globalName: 'copyToClipboard',
  format: ['esm', 'cjs', 'iife'],
  dts: { resolve: true },
  clean: true,
})
