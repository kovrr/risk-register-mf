import ScenarioInputModal from '@/_pages/RiskRegister/ScenarioInputForm/ScenarioInputModal';
import { scenarioTypes } from '@/types/riskRegister';
import { BaseDriver } from '../support/base-driver';

describe('Scenario Input Form (Manual Scenario)', () => {
  let driver: BaseDriver;

  beforeEach(() => {
    driver = new BaseDriver();
    cy.viewport(800, 800);

    driver.mock();
    cy.mockFrontegg([]);

    cy.mount(
      <ScenarioInputModal
        open={true}
        onOpenChange={() => null}
        scenarioType={scenarioTypes.MANUAL}
      />
    );

    cy.wait(500);
  });

  // -----------------------------------------------------------
  // REQUIRED FIELD VALIDATION
  // -----------------------------------------------------------

  it('should show validation errors for required fields when submitting empty form', () => {
    cy.get('[role="dialog"]').within(() => {
      cy.get('button[type="submit"]').click();
    });

    cy.contains('required').should('be.visible');
  });

  // -----------------------------------------------------------
  // BASIC FIELD INPUT
  // -----------------------------------------------------------

  it('should allow filling customer ID, name and description', () => {
    cy.get('[role="dialog"]').within(() => {
      cy.get('input[name="customer_scenario_id"]').type('RISK-001');
      cy.get('input[name="name"]').type('Test Risk Scenario');
      cy.get('textarea[name="description"]').type('Manual scenario for testing');

      cy.get('input[name="customer_scenario_id"]').should('have.value', 'RISK-001');
      cy.get('input[name="name"]').should('have.value', 'Test Risk Scenario');
      cy.get('textarea[name="description"]').should('have.value', 'Manual scenario for testing');
    });
  });

  // -----------------------------------------------------------
  // LIKELIHOOD & IMPACT SELECT
  // -----------------------------------------------------------

  it('should allow selecting likelihood and impact', () => {
    cy.get('[role="dialog"]').within(() => {
      cy.get('[data-testid="likelihood-select"]').click();
    });

    cy.get('body').find('[role="option"]').contains('Unlikely').click();

    cy.get('[role="dialog"]').within(() => {
      cy.get('[data-testid="impact-select"]').click();
    });

    cy.get('body').find('[role="option"]').contains('Minor').click();

    cy.get('[role="dialog"]').within(() => {
      cy.get('[data-testid="likelihood-select"]').should('contain', 'Unlikely');
      cy.get('[data-testid="impact-select"]').should('contain', 'Minor');
    });
  });

  // -----------------------------------------------------------
  // NUMERIC FIELDS (conditionally rendered)
  // -----------------------------------------------------------

  it('should allow filling numeric fields if available', () => {
    // annual_likelihood
    if (Cypress.$('input[name="annual_likelihood"]').length) {
      cy.get('input[name="annual_likelihood"]').type('10');
      cy.get('input[name="annual_likelihood"]').should('have.value', '10');
    }

    // peer_base_rate
    if (Cypress.$('input[name="peer_base_rate"]').length) {
      cy.get('input[name="peer_base_rate"]').type('5');
      cy.get('input[name="peer_base_rate"]').should('have.value', '5');
    }

    // average_loss
    if (Cypress.$('input[name="average_loss"]').length) {
      cy.get('input[name="average_loss"]').type('30000');
      cy.get('input[name="average_loss"]').should('have.value', '30000');
    }

    // currency-select (dropdown opens OUTSIDE the dialog)
    if (Cypress.$('[data-testid="currency-select"]').length) {
      cy.get('[data-testid="currency-select"]').click();

      cy.get('body')
        .find('[role="option"]')
        .contains('EUR')
        .click({ force: true });

      cy.get('[data-testid="currency-select"]').should('contain', 'EUR');
    }
  });

  // -----------------------------------------------------------
  // IMPACT DISTRIBUTION
  // -----------------------------------------------------------

  it('should allow opening and filling impact distribution', () => {
    if (Cypress.$('button:contains("Impact Distribution")').length) {
      cy.contains('button', 'Impact Distribution').click({ force: true });

      const fields = [
        'impact_distribution.one',
        'impact_distribution.twenty_five',
        'impact_distribution.fifty',
        'impact_distribution.seventy_five',
        'impact_distribution.ninety_nine'
      ];

      fields.forEach((name, index) => {
        if (Cypress.$(`input[name="${name}"]`).length) {
          cy.get(`input[name="${name}"]`).type(String((index + 1) * 1000));
          cy.get(`input[name="${name}"]`).should('have.value', String((index + 1) * 1000));
        }
      });
    }
  });

  // -----------------------------------------------------------
  // FORM SUBMISSION
  // -----------------------------------------------------------

  it('should submit the form successfully', () => {
    cy.intercept('POST', '**/api/risk-scenarios', {
      statusCode: 201,
      body: { scenario_id: 'new-id' }
    }).as('createScenario');

    cy.get('[role="dialog"]').within(() => {
      cy.get('input[name="customer_scenario_id"]').type('RISK-123');
      cy.get('input[name="name"]').type('Manual Scenario');
      cy.get('textarea[name="description"]').type('Description example');
      cy.get('[data-testid="likelihood-select"]').click();
    });

    cy.get('body').find('[role="option"]').contains('Likely').click();

    cy.get('[role="dialog"]').within(() => {
      cy.get('[data-testid="impact-select"]').click();
    });

    cy.get('body').find('[role="option"]').contains('Significant').click();

    cy.get('[role="dialog"]')
      .find('button[type="submit"]')
      .click();

    cy.wait('@createScenario').its('request.method').should('eq', 'POST');
  });
});
