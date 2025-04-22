import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ["./src/tests/**/*"],
        exclude: ["./backend/**"],
        environment: 'jsdom',  // Use jsdom as the test environment (for browser-like testing)
        globals: true,         // Enable global variables like `describe`, `it`, `expect`
        setupFiles: './src/tests/setupTests.ts', // Set up any global test configuration
        coverage: {
            provider: 'c8',      // Use c8 for test coverage reporting
            reporter: ['text', 'html'],
        },
    },
})