import ScenarioInputModal from '@/_pages/RiskRegister/ScenarioInputForm/ScenarioInputModal';
import { buildRiskRegisterResponse } from '@/mocks/builders/riskRegisterBuilders';
import { BaseDriver } from '../support/base-driver';

describe('Scenario Input Form (manual-only)', () => {
  let driver: BaseDriver;
  const scenario = buildRiskRegisterResponse({
    customer_scenario_id: 'SCEN-001',
    name: 'Manual Scenario',
    description: 'A manual test scenario',
  });

  beforeEach(() => {
    driver = new BaseDriver();
    cy.viewport(800, 800);
    driver.mock();
    cy.mockFrontegg([]);

    cy.intercept(
      'GET',
      `**/api/risk-scenarios/${scenario.scenario_id}`,
      { statusCode: 200, body: scenario }
    ).as('getScenario');

    cy.intercept(
      'PATCH',
      `**/api/risk-scenarios/${scenario.scenario_id}`,
      (req) => req.reply({ statusCode: 200, body: req.body })
    ).as('updateScenario');

    cy.mount(
      <ScenarioInputModal
        open={true}
        onOpenChange={() => null}
        scenario={scenario}
        scenarioType={scenario.scenario_type}
      />
    );
  });

  // ---------------------------------------------------------
  // LOAD EXISTING DATA
  // ---------------------------------------------------------

  it('should load scenario data into form fields', () => {
    cy.get('input[name="customer_scenario_id"]')
      .should('have.value', scenario.customer_scenario_id);

    cy.get('input[name="name"]')
      .should('have.value', scenario.name);

    cy.get('textarea[name="description"]')
      .should('have.value', scenario.description);
  });

  // ---------------------------------------------------------
  // UPDATE SCENARIO
  // ---------------------------------------------------------

  it('should update the scenario successfully', () => {
    cy.get('input[name="name"]')
      .clear()
      .type('Updated Manual Scenario');

    cy.get('textarea[name="description"]')
      .clear()
      .type('Updated manual description');

    cy.get('button[type="submit"]').click();

    cy.wait('@updateScenario').then((interception) => {
      const body = interception.request.body;

      expect(body.name).to.equal('Updated Manual Scenario');
      expect(body.description).to.equal('Updated manual description');

      // no CRQ fields should exist
      expect(body).to.not.have.property('crq_data');
      expect(body).to.not.have.property('annual_likelihood');
      expect(body).to.not.have.property('peer_base_rate');
    });
  });

  // ---------------------------------------------------------
  // VALIDATION
  // ---------------------------------------------------------

  it('should prevent submission if required fields are empty', () => {
    cy.get('input[name="name"]').clear();
    cy.get('button[type="submit"]').click();

    // modal should NOT close
    cy.get('input[name="name"]').should('exist');

    // if your UI shows an error message, assert it
    // cy.contains('Name is required').should('be.visible');
  });
});
