import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  globalName: 'toggleSelection',
  format: ['esm', 'cjs', 'iife'],
  dts: { resolve: true },
  clean: true,
})
