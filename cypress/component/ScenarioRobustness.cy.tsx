import { ScenarioRobustness } from '@/_pages/RiskRegister/ScenarioDrillDown/DataBreachDuePhishing/components/ScenarioRobustness';
import { buildLeanSimulationExposure } from '@/mocks/builders/quantificationBuilders';
import { buildCRQRiskRegisterResponse } from '@/mocks/builders/riskRegisterBuilders';
import { RiskRegisterResponse } from '@/types/riskRegister';
import { BaseDriver } from '../support/base-driver';

describe('Scenario Robustness', () => {
  let driver: BaseDriver,
    scenario: RiskRegisterResponse;

  beforeEach(() => {
    driver = new BaseDriver();

    // Create a mock scenario with CRQ data
    scenario = buildCRQRiskRegisterResponse(
      {
        customer_scenario_id: 'RISK-001',
        name: 'Test Risk Scenario',
        description: 'This is a test risk scenario description',
      },
      'complete',
      {
        results: {
          lean_simulation_exposure: buildLeanSimulationExposure({
            match_count: 0.75,
            diversity_score: 0.82,
          }),
        },
      }
    );

    driver.mock();
    cy.mockFrontegg([]);
  });

  it('should display the correct normalized numbers', () => {
    cy.mount(<ScenarioRobustness scenario={scenario} />);

    cy.contains('75%').should('be.visible');

    cy.contains('82%').should('be.visible');
  });
});
