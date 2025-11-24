import ScenarioInputModal from '@/_pages/RiskRegister/ScenarioInputForm/ScenarioInputModal';
import { buildRiskRegisterResponse } from '@/mocks/builders/riskRegisterBuilders';
import { BaseDriver } from '../support/base-driver';

const mockScenario = buildRiskRegisterResponse();

describe('Scenario Input Form', () => {
  let driver: BaseDriver;
  beforeEach(() => {
    driver = new BaseDriver();
    cy.viewport(800, 800);
    driver.mock();
    cy.mockFrontegg([]);
    cy.intercept(
      'GET',
      `/api/risk-scenarios/${mockScenario.scenario_id}`,
      {
        statusCode: 200,
        body: mockScenario,
      },
    ).as('getScenario');
    cy.mount(
      <ScenarioInputModal
        open={true}
        onOpenChange={() => null}
        scenario={mockScenario}
        scenarioType={mockScenario.scenario_type}
      />,
    );
  });

  it('should load existing scenario data for editing', () => {
    // Verify form is populated with existing data
    cy.get('input[name="customer_scenario_id"]').should(
      'have.value',
      mockScenario.customer_scenario_id,
    );
    cy.get('input[name="name"]').should('have.value', mockScenario.name);
    cy.get('textarea[name="description"]').should(
      'have.value',
      mockScenario.description,
    );
    cy.get('[data-testid="likelihood-select"]').should(
      'contain',
      mockScenario.scenario_data.likelihood,
    );
    cy.get('[data-testid="impact-select"]').should(
      'contain',
      mockScenario.scenario_data.impact,
    );
    cy.get('input[name="annual_likelihood"]').should(
      'have.value',
      mockScenario.scenario_data.annual_likelihood,
    );
    cy.get('input[name="peer_base_rate"]').should(
      'have.value',
      mockScenario.scenario_data.peer_base_rate,
    );
    cy.get('input[name="average_loss"]').should(
      'have.value',
      mockScenario.scenario_data.average_loss,
    );
    cy.get('[data-testid="currency-select"]').should(
      'contain',
      mockScenario.scenario_data.average_loss_currency,
    );
  });

  it('should successfully update an existing scenario', () => {
    cy.intercept('PATCH', '**/api/risk-scenarios/*', {
      statusCode: 200,
    }).as('updateScenario');

    // Update some fields
    cy.get('input[name="name"]').clear().type('Updated Scenario Name');
    cy.get('textarea[name="description"]').clear().type('Updated description');
    cy.get('[data-testid="likelihood-select"]').click();
    cy.get('[role="option"]').contains('Unlikely').click();

    // Submit form
    cy.get('button[type="submit"]').click();

    // Verify the update request
    cy.wait('@updateScenario').then((interception) => {
      expect(interception.request.body).to.include({
        name: 'Updated Scenario Name',
        description: 'Updated description',
      });
    });
  });

  it('should not include results field in crq_data when updating', () => {
    cy.intercept('PATCH', '**/api/risk-scenarios/*', {
      statusCode: 200,
    }).as('updateScenario');

    // Update a field
    cy.get('input[name="name"]').clear().type('Updated Name');

    // Submit form
    cy.get('button[type="submit"]').click();

    // Verify the update request doesn't include results field
    cy.wait('@updateScenario').then((interception) => {
      const requestBody = interception.request.body;

      if (requestBody.crq_data) {
        expect(requestBody.crq_data).to.not.have.property('results');
      }
    });
  });
});
