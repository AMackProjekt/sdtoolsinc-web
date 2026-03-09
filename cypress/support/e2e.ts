// Cypress E2E Support File
// This file runs before every test file
// Add global commands, configurations, and behaviors here

// Import Cypress commands
import './commands'

// Prevent TypeScript errors
export {}

// Add custom commands to Cypress namespace
declare global {
  namespace Cypress {
    interface Chainable {
      // Add custom command type definitions here if needed
    }
  }
}
