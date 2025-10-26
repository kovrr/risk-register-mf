import Provider from "@/components/molecules/ProviderComponent";
import { BaseDriver } from "../support/base-driver";

describe("ProviderComponent.cy.tsx", () => {
  const driver = new BaseDriver();
  beforeEach(() => {
    driver.mock();
  });

  it("playground", () => {
    cy.mount(<Provider />);
    cy.wait("@mockFronteggRefreshToken");
    cy.wait("@mockFronteggUser");
    cy.contains("This is Module Federation 2.0");
  });
});
