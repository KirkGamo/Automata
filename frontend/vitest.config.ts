import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Use happy-dom to avoid jsdom ESM interop issues in some environments
    environment: 'happy-dom'
  }
})
