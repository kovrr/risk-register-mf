import { AverageFinancialLossMetric } from '@/_pages/RiskRegister/ScenarioDrillDown/DataBreachDuePhishing/components/AverageFinancialLossMetric';
import { CrqAALMetric } from '@/_pages/RiskRegister/ScenarioDrillDown/DataBreachDuePhishing/components/CrqAALMetric';
import { CrqAverageFinancialLossMetric } from '@/_pages/RiskRegister/ScenarioDrillDown/DataBreachDuePhishing/components/CrqAverageFinancialLossMetric';
import { NaiveAALMetric } from '@/_pages/RiskRegister/ScenarioDrillDown/DataBreachDuePhishing/components/NaiveAALMetric';
import { convertToInternationalCurrencySystemToFixed } from '@/components/ui/charts/utils';
import {
  buildMetricsHistory,
  buildRiskRegisterResponse,
} from '@/mocks/builders/riskRegisterBuilders';
import {
  RiskRegisterResponse,
  ScenarioMetricsHistory,
} from '@/types/riskRegister';
import { BaseDriver } from '../support/base-driver';

describe('Scenario Metrics Card', () => {
  let driver: BaseDriver,
    manualScenario: RiskRegisterResponse,
    crqScenario: RiskRegisterResponse,
    metricsHistory: ScenarioMetricsHistory;

  beforeEach(() => {
    driver = new BaseDriver();

    // Manual scenario for first test
    manualScenario = buildRiskRegisterResponse({
      customer_scenario_id: 'MANUAL-001',
      name: 'Manual Scenario',
      description: 'A manually created scenario for test',
    });
    manualScenario.scenario_id = 'manual-test-scenario-123';
    manualScenario.scenario_data = {
      ...manualScenario.scenario_data,
      risk_priority: 'Low',
      response_plan: 'Transfer',
      review_date: '2025-01-01',
    };

    crqScenario = buildRiskRegisterResponse({
      customer_scenario_id: 'CRQ-001',
      name: 'CRQ Scenario',
      description: 'A CRQ created scenario for test',
    });
    crqScenario.scenario_id = 'crq-test-scenario-123';
    crqScenario.scenario_data = {
      ...crqScenario.scenario_data,
      risk_priority: 'Low',
      response_plan: 'Transfer',
      review_date: '2025-01-01',
    };

    metricsHistory = buildMetricsHistory({
      scenario_id: crqScenario.scenario_id,
    });

    cy.intercept(
      'GET',
      `/api/risk-register/scenarios/${manualScenario.scenario_id}`,
      {
        statusCode: 200,
        body: manualScenario,
      },
    ).as('getManualScenario');

    cy.intercept(
      'GET',
      `/api/risk-register/scenarios/${crqScenario.scenario_id}`,
      {
        statusCode: 200,
        body: crqScenario,
      },
    ).as('getCRQScenario');

    cy.intercept(
      'GET',
      `/api/risk-register/scenarios/${crqScenario.scenario_id}/metrics-history`,
      {
        statusCode: 200,
        body: metricsHistory,
      },
    ).as('getCRQMetricsHistory');

    driver.mock();
    cy.mockFrontegg([]);
  });

  it('checks that annual events likelihood is displayed', () => {
    // Setup for manual scenario

    cy.mount(<NaiveAALMetric />, {
      routerParams: {
        scenarioId: manualScenario.scenario_id,
      },
    });
    cy.wait('@getManualScenario');

    cy.contains('Annual Events Likelihood').should('be.visible');
    cy.contains(
      'The estimated likelihood as a percentage that this scenario will occur within the next 12 months.',
    ).should('be.visible');
    cy.contains(manualScenario.scenario_data.annual_likelihood || 0);
    cy.contains(manualScenario.scenario_data.peer_base_rate || 0);
  });

  it('checks that financial loss is displayed', () => {
    // Setup for manual scenario
    const { value, suffix } = convertToInternationalCurrencySystemToFixed(
      manualScenario.scenario_data.average_loss || 0,
      2,
    );
    cy.mount(<AverageFinancialLossMetric />, {
      routerParams: {
        scenarioId: manualScenario.scenario_id,
      },
    });
    cy.wait('@getManualScenario');

    cy.contains('Average Financial Loss').should('be.visible');
    cy.contains(
      'The estimated average financial impact per occurrence, including direct and indirect costs.',
    ).should('be.visible');
    cy.contains(
      `${value}${suffix}${manualScenario.scenario_data.average_loss_currency}`,
    );
  });

  it('checks that CRQ annual events likelihood is displayed with correct chart data', () => {
    cy.mount(
      <CrqAALMetric metricsHistory={metricsHistory} isLoading={false} />,
    );

    cy.contains('Annual Events Likelihood').should('be.visible');
    cy.contains(
      'The estimated likelihood of cyber loss events occurring within the next 12 months, based on the selected risk scenario.',
    ).should('be.visible');

    const lastIndex = metricsHistory.metrics_history.length - 1;
    const currentLikelihood = (
      (metricsHistory.metrics_history[lastIndex]?.annual_likelihood ?? 0) * 100
    ).toFixed(2);
    cy.contains(`${currentLikelihood} %`).should('be.visible');

    const benchmark = (
      (metricsHistory.metrics_history[lastIndex]?.targeted_benchmark_annual_rate ?? 0) *
      100
    ).toFixed(2);
    cy.contains(`${benchmark}%`).should('be.visible');

    cy.get('[data-testid="crq-aal-chart"]').should('be.visible');

    cy.get('[data-testid="crq-aal-chart"] canvas').should('exist');

    cy.window().then(() => {
      expect(metricsHistory.metrics_history.length).to.equal(5);
    });
  });

  it('checks that CRQ financial loss is displayed with correct chart data', () => {
    cy.mount(
      <CrqAverageFinancialLossMetric
        impactDistribution={{
          one: 1000,
          twenty_five: 5000,
          fifty: 15000,
          seventy_five: 50000,
          ninety_nine: 200000,
        }}
        metricsHistory={metricsHistory}
        isLoading={false}
      />,
    );

    cy.contains('Average Financial Loss').should('be.visible');
    cy.contains(
      'The expected financial impact if this cyber risk scenario materializes.',
    ).should('be.visible');

    const lastIndex = metricsHistory.metrics_history.length - 1;
    const currentLoss = metricsHistory.metrics_history[lastIndex]?.average_loss ?? 0;
    const { value, suffix } = convertToInternationalCurrencySystemToFixed(
      currentLoss,
      2,
    );
    cy.contains(`${value} ${suffix}`).should('be.visible');

    const currency = metricsHistory.metrics_history[lastIndex]?.currency ?? 'USD';
    cy.contains(currency).should('be.visible');

    cy.get('[data-testid="crq-average-loss-chart"]').should('be.visible');

    cy.get('[data-testid="crq-average-loss-chart"] canvas').should('exist');

    cy.window().then(() => {
      expect(metricsHistory.metrics_history.length).to.equal(5);
    });
  });
});
