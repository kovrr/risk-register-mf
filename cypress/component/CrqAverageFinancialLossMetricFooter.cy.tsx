import { CrqAverageFinancialLossMetricFooter } from '@/_pages/RiskRegister/ScenarioDrillDown/DataBreachDuePhishing/components/chart/CrqAverageFinancialLossMetricFooter';
import { buildMetricsHistory } from '@/mocks/builders/riskRegisterBuilders';
import {
  ScenarioMetricsHistory,
  ImpactDistribution,
} from '@/types/riskRegister';
import { BaseDriver } from '../support/base-driver';

describe('CrqAverageFinancialLossMetricFooter', () => {
  let driver: BaseDriver;
  let metricsHistory: ScenarioMetricsHistory;
  let impactDistribution: ImpactDistribution;

  beforeEach(() => {
    driver = new BaseDriver();

    // Create test metrics history using the builder
    metricsHistory = buildMetricsHistory({
      scenario_id: 'test-scenario-123',
    });

    // Create test impact distribution data
    impactDistribution = {
      ninety_nine: 200000,
      seventy_five: 50000,
      fifty: 15000,
      twenty_five: 5000,
      one: 1000,
    };

    driver.mock();
    cy.mockFrontegg([]);
  });

  it('should display the chart and "Full Impact Distribution" button', () => {
    cy.mount(
      <CrqAverageFinancialLossMetricFooter
        metricsHistory={metricsHistory}
        impactDistribution={impactDistribution}
      />,
    );

    // Check that the chart container is displayed
    cy.get('[data-testid="crq-average-loss-chart"]').should('be.visible');

    // Check that the chart canvas is rendered
    cy.get('[data-testid="crq-average-loss-chart"] canvas').should('exist');

    // Check that the "Full Impact Distribution" button is displayed
    cy.contains('Full Impact Distribution').should('be.visible');
  });

  it('should open modal when "Full Impact Distribution" button is clicked', () => {
    cy.mount(
      <CrqAverageFinancialLossMetricFooter
        metricsHistory={metricsHistory}
        impactDistribution={impactDistribution}
      />,
    );

    // Click the "Full Impact Distribution" button
    cy.contains('Full Impact Distribution').click();

    // Check that the modal is opened
    cy.get('[role="dialog"]').should('be.visible');
  });

  it('should close modal when close button is clicked', () => {
    cy.mount(
      <CrqAverageFinancialLossMetricFooter
        metricsHistory={metricsHistory}
        impactDistribution={impactDistribution}
      />,
    );

    // Click the "Full Impact Distribution" button
    cy.contains('Full Impact Distribution').click();

    // Check that the modal is opened
    cy.get('[role="dialog"]').should('be.visible');

    // Click the close button (using Chakra UI's close button)
    cy.get('[aria-label="Close"]').click();

    // Check that the modal is closed
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('should close modal when clicking the X button', () => {
    cy.mount(
      <CrqAverageFinancialLossMetricFooter
        metricsHistory={metricsHistory}
        impactDistribution={impactDistribution}
      />,
    );

    // Click the "Full Impact Distribution" button
    cy.contains('Full Impact Distribution').click();

    // Check that the modal is opened
    cy.get('[role="dialog"]').should('be.visible');

    // Click the X button to close the modal
    cy.get('[aria-label="Close"]').click();

    // Check that the modal is closed
    cy.get('[role="dialog"]').should('not.exist');
  });
});
