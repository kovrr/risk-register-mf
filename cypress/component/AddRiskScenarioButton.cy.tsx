import { AddRiskScenarioButton } from '@/_pages/RiskRegister/components/AddScenarioButton';
import { Toaster } from '@/components/atoms/toaster';
import { BaseDriver } from '../support/base-driver';

describe('Add Risk Scenario Button', () => {
  let driver: BaseDriver;
  beforeEach(() => {
    driver = new BaseDriver();
    cy.viewport(800, 600);

    driver.withRiskRegisterEnabled();
    cy.mockFrontegg([]);
  });
  const mountComponent = () => {
    cy.mount(
      <>
        <Toaster />
        <AddRiskScenarioButton />
      </>,
    );
  };

  it('should open create scenario dropdown and create simple scenario', () => {
    driver.withRiskRegisterCRQEnabled().mock();
    mountComponent();
    // weird bug, without this the dropdown menu is not visible
    cy.wait(1000);
    cy.contains('Add Risk Scenario').click();
    cy.get('[data-testid="dropdown-menu-content"]').within(() => {
      cy.get('[data-testid="dropdown-menu-item-0"]')
        .contains('Non-CRQ scenario')
        .click();
    });
    cy.contains('New Risk Scenario').should('exist');
  });

  it('should open CRQ scenario modal when user has enough quota', () => {
    driver.withRiskRegisterCRQEnabled().mock();
    // Mock the remaining licenses API call to return positive number
    cy.intercept('GET', '**/api/tenant/remaining_crq_scenarios_licenses', {
      statusCode: 200,
      body: { remaining_crq_scenarios_licenses: 5 },
    }).as('getRemainingLicenses');

    mountComponent();

    cy.wait(1000);
    cy.contains('Add Risk Scenario').click();
    cy.get('[data-testid="dropdown-menu-content"]').within(() => {
      cy.get('[data-testid="dropdown-menu-item-1"]')
        .contains('CRQ-Based Scenario')
        .click();
    });
    // Verify CRQ modal is opened
    cy.contains('New Risk Scenario').should('exist');
  });

  it('should show error toast when user has no remaining quota', () => {
    driver.withRiskRegisterCRQEnabled().mock();
    // Mock the remaining licenses API call to return 0
    cy.intercept('GET', '**/api/tenant/remaining_crq_scenarios_licenses', {
      statusCode: 200,
      body: { remaining_crq_scenarios_licenses: 0 },
    }).as('getRemainingLicenses');

    mountComponent();
    cy.wait(1000);

    cy.contains('Add Risk Scenario').click();

    cy.get('[data-testid="dropdown-menu-content"]').within(() => {
      cy.get('[data-testid="dropdown-menu-item-1"]')
        .contains('CRQ-Based Scenario')
        .click();
    });

    // Verify error toast is shown
    cy.contains('Limit Reached').should('exist');

    // Verify CRQ modal is not opened
    cy.contains('New Risk Scenario').should('not.exist');
  });

  it('should open the simple scenario modal when CRQ is disabled', () => {
    driver.mock();
    cy.mount(<AddRiskScenarioButton />);
    cy.wait(1000);
    cy.contains('Add Risk Scenario').click();
    cy.contains('New Risk Scenario').should('exist');
  });
});
