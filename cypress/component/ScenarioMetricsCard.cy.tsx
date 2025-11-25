import { AverageFinancialLossMetric } from '@/_pages/RiskRegister/ScenarioDrillDown/DataBreachDuePhishing/components/AverageFinancialLossMetric';
import { NaiveAALMetric } from '@/_pages/RiskRegister/ScenarioDrillDown/DataBreachDuePhishing/components/NaiveAALMetric';
import { convertToInternationalCurrencySystemToFixed } from '@/components/ui/charts/utils';
import { buildRiskRegisterResponse } from '@/mocks/builders/riskRegisterBuilders';
import { RiskRegisterResponse } from '@/types/riskRegister';
import { BaseDriver } from '../support/base-driver';

describe('Scenario Metrics Card (manual-only project)', () => {
  let driver: BaseDriver;
  let manualScenario: RiskRegisterResponse;

  beforeEach(() => {
    // Prevent scenarioId hook error
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('scenarioId in the path')) return false;
    });

    driver = new BaseDriver();

    manualScenario = buildRiskRegisterResponse({
      customer_scenario_id: 'MANUAL-001',
      name: 'Manual Scenario',
      description: 'A manually created scenario for test',
    });

    manualScenario.scenario_id = 'manual-test-scenario-123';
    manualScenario.scenario_data = {
      ...manualScenario.scenario_data,
      annual_likelihood: 0.15,
      peer_base_rate: 0.11,
      average_loss: 50000,
      average_loss_currency: 'USD',
    };

    cy.intercept(
      'GET',
      `**/api/risk-scenarios/${manualScenario.scenario_id}`,
      { statusCode: 200, body: manualScenario },
    ).as('getScenario');

    driver.mock();
    cy.mockFrontegg([]);
  });

  it('displays Annual Events Likelihood for a manual scenario', () => {
    cy.mount(<NaiveAALMetric />, {
      routerParams: { scenarioId: manualScenario.scenario_id },
    });

    cy.wait('@getScenario');

    cy.contains('Annual Events Likelihood').should('be.visible');

    cy.contains('The estimated likelihood').should('be.visible');

    cy.contains('15').should('exist'); // 0.15 → 15%
    cy.contains('11').should('exist'); // peer base rate
  });

  it('displays Average Financial Loss for a manual scenario', () => {
    const { value, suffix } = convertToInternationalCurrencySystemToFixed(
      manualScenario.scenario_data.average_loss || 0,
      2
    );

    const expectedValue = `${value}${suffix}${manualScenario.scenario_data.average_loss_currency}`;

    cy.mount(<AverageFinancialLossMetric />, {
      routerParams: { scenarioId: manualScenario.scenario_id },
    });

    cy.wait('@getScenario');

    cy.contains('Average Financial Loss').should('be.visible');

    cy.contains('financial impact').should('be.visible');

    cy.contains(expectedValue).should('exist');
  });
});
