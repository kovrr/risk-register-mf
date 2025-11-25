import { AddRiskScenarioButton } from '@/_pages/RiskRegister/components/AddScenarioButton';
import { Toaster } from '@/components/atoms/toaster';
import { BaseDriver } from '../support/base-driver';

describe('Add Risk Scenario Button (non-CRQ flow)', () => {
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

const openSimpleScenarioModal = () => {
  cy.get('[data-testid="add-risk-scenario-dropdown-button"]', {
    timeout: 5000,
  })
    .should('be.visible')
    .and('contain.text', 'Add Risk Scenario')
    .click();

  cy.get('[data-testid="dropdown-menu-content"]').should('be.visible');
  cy.get('[data-testid="dropdown-menu-item-0"]')
    .should('contain.text', 'Non-CRQ scenario')
    .click();
};

  it('renders the add scenario dropdown trigger', () => {
    driver.mock();
    mountComponent();

    cy.get('[data-testid="add-risk-scenario-dropdown-button"]', {
      timeout: 5000,
    })
      .should('be.visible')
      .and('contain.text', 'Add Risk Scenario');
  });

  it('opens the simple scenario modal when clicked', () => {
    driver.mock();
    mountComponent();

    openSimpleScenarioModal();

    cy.get('[role="dialog"]', { timeout: 3000 }).should('be.visible');
    cy.contains(/New.*Risk Scenario/i).should('be.visible');
  });
});
