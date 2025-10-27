import { MASScenarioView } from '@/_pages/RiskRegister/ScenarioView/MASView/MASScenarioView';
import {
  buildCompanyWithSphere,
  buildLastQuantification,
} from '@/mocks/builders/companyBuilder';
import { buildQuantification } from '@/mocks/builders/quantificationBuilders';
import { buildCRQRiskRegisterResponse } from '@/mocks/builders/riskRegisterBuilders';
import {
  cisResultsFQNewSchema,
  mockCisInputData,
} from '@/mocks/data/fqResults';
import { CompanyApiData, CompanyStatus } from '@/types/companyForm';
import { QuantificationData } from '@/types/quantificationData';
import { RiskRegisterResponse } from '@/types/riskRegister';
import { BaseDriver } from '../support/base-driver';

describe('MAS Scenario View', () => {
  let driver: BaseDriver,
    company: CompanyApiData,
    fq: QuantificationData,
    scenario: RiskRegisterResponse;
  beforeEach(() => {
    driver = new BaseDriver();
    company = buildCompanyWithSphere({
      status: CompanyStatus.COMPLETED,
      last_quantification: buildLastQuantification({
        id: 'new-schema-cis-fq-id',
        results_narrative: cisResultsFQNewSchema,
      }),
    });
    fq = buildQuantification({
      id: 'new-schema-cis-fq-id',
      results_narrative: cisResultsFQNewSchema,
      input_data: mockCisInputData,
      status: 'Success',
    });
    scenario = buildCRQRiskRegisterResponse(
      {
        customer_scenario_id: 'RISK-001',
        name: 'Test Risk Scenario',
        description: 'This is a test risk scenario description',
      },
      'complete',
      { company_id: company.id },
    );
    scenario.scenario_data = {
      ...scenario.scenario_data,
      risk_priority: 'Low',
      response_plan: 'Transfer',
      review_date: '2025-01-01',
    };

    cy.intercept(
      'GET',
      '/api/companies?page=1&size=100&fields=id&fields=name&fields=status',
      {
        body: {
          items: [company],
          total: 1,
          page: 1,
          size: 100,
        },
      },
    );
    cy.intercept(
      'GET',
      `/api/risk-register/scenarios/${scenario.scenario_id}`,
      {
        statusCode: 200,
        body: scenario,
      },
    ).as('getScenario');

    driver.withCompanies([company]).withFq([fq]).mock();
    cy.mockFrontegg([]);
    cy.mount(<MASScenarioView />, {
      routerParams: {
        scenarioId: scenario.scenario_id,
      },
    });
    cy.wait(1000);
  });

  it('should show risk management tabs and navigate between them', () => {
    cy.get('[data-testid="risk-management-tab-risk-management"]').should(
      'have.attr',
      'aria-selected',
      'true',
    );
    ['relevant-controls', 'notes'].forEach((tab) => {
      cy.get(`[data-testid="risk-management-tab-${tab}"]`).should(
        'have.attr',
        'aria-selected',
        'false',
      );
      cy.get(`[data-testid="risk-management-tab-${tab}"]`).click();
      cy.get(`[data-testid="risk-management-tab-${tab}"]`).should(
        'have.attr',
        'aria-selected',
        'true',
      );
    });
  });

  it('should show controls recommendations tabs and navigate between them', () => {
    cy.get(
      '[data-testid="controls-recommendations-tab-controls-recommendations"]',
    ).should('have.attr', 'aria-selected', 'true');

    cy.get('[data-testid="controls-recommendations-tab-damage-types"]').should(
      'have.attr',
      'aria-selected',
      'false',
    );
    cy.get(
      '[data-testid="controls-recommendations-tab-simulation-event-examples"]',
    ).should('have.attr', 'aria-selected', 'false');
    ['damage-types', 'simulation-event-examples'].forEach((tab) => {
      cy.get(`[data-testid="controls-recommendations-tab-${tab}"]`).click();
      cy.get(`[data-testid="controls-recommendations-tab-${tab}"]`).should(
        'have.attr',
        'aria-selected',
        'true',
      );
    });
  });

  it('edits risk management form', () => {
    cy.intercept(
      'PATCH',
      `/api/risk-register/scenarios/${scenario.scenario_id}`,
      scenario,
    ).as('updateScenario');
    cy.get('[name="sub-category"]').type('Test Sub Category');
    cy.wait('@updateScenario').then((interception) => {
      expect(interception.request?.body.sub_category).to.equal(
        'Test Sub Category',
      );
    });
    cy.get('[name="mitigation-cost"]').type('10');
    cy.wait('@updateScenario').then((interception) => {
      expect(interception.request?.body.mitigation_cost).to.equal(10);
    });
    cy.get('[data-testid="priority-dropdown"]').contains('Low').click();
    cy.contains('High').click();
    cy.wait('@updateScenario').then((interception) => {
      expect(interception.request?.body.risk_priority).to.equal('High');
    });
    cy.get('[data-testid="response-plan-dropdown"]')
      .contains('Transfer')
      .click();
    cy.contains('Mitigate').click();
    cy.wait('@updateScenario').then((interception) => {
      expect(interception.request?.body.response_plan).to.equal('Mitigate');
    });
  });
});
