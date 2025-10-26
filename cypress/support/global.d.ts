// describe custom Cypress commands in this file

// load the global Cypress types
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    mockFrontegg(userPermissionKeys?: string[], userId?: string): void;
  }
}
