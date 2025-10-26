import { BaseDriver } from "../support/base-driver";

describe("template spec", () => {
  const driver = new BaseDriver();

  beforeEach(() => {
    driver.mock();
  });

  it("passes", () => {
    cy.visit("/");
    cy.wait("@mockFronteggRefreshToken");
    cy.wait("@mockFronteggUser");
    cy.contains("This is Module Federation 2.0");
  });
});
