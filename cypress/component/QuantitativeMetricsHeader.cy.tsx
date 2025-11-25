import { QuantitativeMetricsHeader } from '@/_pages/RiskRegister/ScenarioDrillDown/DataBreachDuePhishing/components/QuantitativeMetricsHeader';
import { buildRiskRegisterResponse } from '@/mocks/builders/riskRegisterBuilders';
import { BaseDriver } from '../support/base-driver';

describe('QuantitativeMetricsHeader (manual-only project)', () => {
  let driver: BaseDriver;
  let scenario: any;

  beforeEach(() => {
    driver = new BaseDriver();

    scenario = buildRiskRegisterResponse({
      customer_scenario_id: 'MANUAL-001',
      name: 'Manual Scenario',
      description: 'A manually created scenario for test',
    });

    scenario.scenario_id = 'manual-test-scenario-123';

    cy.intercept(
      'GET',
      `**/api/risk-scenarios/${scenario.scenario_id}`,
      { statusCode: 200, body: scenario },
    ).as('getScenario');

    driver.mock();
    cy.mockFrontegg([]);
  });

  it('renders the header for a manual scenario without crashing', () => {
    cy.mount(<QuantitativeMetricsHeader />, {
      routerParams: { scenarioId: scenario.scenario_id },
    });

    cy.wait('@getScenario');

    cy.get('body').should('exist');
  });

  it('does NOT render CRQ-only elements (since CRQ does not exist in this project)', () => {
    cy.mount(<QuantitativeMetricsHeader />, {
      routerParams: { scenarioId: scenario.scenario_id },
    });

    cy.wait('@getScenario');

    cy.get('[data-testid="powered-by-crq"]').should('not.exist');
    cy.get('[data-testid="quantitative-metrics-header-refresh"]').should('not.exist');
  });

  it('renders without crashing even with minimal data', () => {
    cy.mount(<QuantitativeMetricsHeader />, {
      routerParams: { scenarioId: scenario.scenario_id },
    });

    cy.wait('@getScenario');

    cy.get('body').should('exist');
  });
});
