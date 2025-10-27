import { QuantitativeMetricsHeader } from '@/_pages/RiskRegister/ScenarioDrillDown/DataBreachDuePhishing/components/QuantitativeMetricsHeader';
import {
  buildCompanyWithSphere,
  buildLastQuantification,
} from '@/mocks/builders/companyBuilder';
import { buildQuantification } from '@/mocks/builders/quantificationBuilders';
import { buildCRQRiskRegisterResponse, buildRiskRegisterResponse } from '@/mocks/builders/riskRegisterBuilders';
import {
  cisResultsFQNewSchema,
  mockCisInputData,
} from '@/mocks/data/fqResults';
import { CompanyApiData, CompanyStatus } from '@/types/companyForm';
import { QuantificationData } from '@/types/quantificationData';
import { RiskRegisterResponse } from '@/types/riskRegister';
import { BaseDriver } from '../support/base-driver';

describe('Quantitative Metrics Header', () => {
  let driver: BaseDriver,
    company: CompanyApiData,
    fq: QuantificationData,
    manualScenario: RiskRegisterResponse,
    crqScenario: RiskRegisterResponse;

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
      created_at: '2026-06-22T10:00:00.000Z',
      updated_at: '2026-06-22T10:00:00.000Z',
    });

    // Manual scenario for first test
    manualScenario = buildRiskRegisterResponse(
      {
        customer_scenario_id: 'MANUAL-001',
        name: 'Manual Scenario',
        description: 'A manually created scenario for test',
      },


    );
    manualScenario.scenario_id = 'manual-test-scenario-123';
    manualScenario.scenario_data = {
      ...manualScenario.scenario_data,
      risk_priority: 'Low',
      response_plan: 'Transfer',
      review_date: '2025-01-01',
    };

    // CRQ scenario for other tests
    crqScenario = buildCRQRiskRegisterResponse(
      {
        customer_scenario_id: 'CRQ-001',
        name: 'CRQ Risk Scenario',
        description: 'This is a CRQ risk scenario description',

      },
      'complete',
      { company_id: company.id },
    );
    crqScenario.scenario_type = 'crq';
    crqScenario.scenario_id = 'crq-test-scenario-456'; // Fixed ID for easy navigation
    crqScenario.scenario_data = {
      ...crqScenario.scenario_data,
      risk_priority: 'High',
      response_plan: 'Mitigate',
      review_date: '2025-01-01',
      crq_data: {
        fq_id: fq.id,
        company_id: company.id,
        is_crq_up_to_date: false, // Set to false to show refresh button
        filters: {},
      },
    };

    driver.withCompanies([company]).withFq([fq]).mock();
    cy.mockFrontegg([]);
  });

  it('should verify that the "Powered By CRQ" badge is not visible for a manual scenario', () => {
    // Setup for manual scenario
    cy.intercept(
      'GET',
      `/api/risk-register/scenarios/${manualScenario.scenario_id}`,
      {
        statusCode: 200,
        body: manualScenario,
      },
    ).as('getManualScenario');

    cy.mount(<QuantitativeMetricsHeader />, {
      routerParams: {
        scenarioId: manualScenario.scenario_id,
      },
    });
    cy.wait('@getManualScenario');

    // Test that CRQ badge is not visible
    cy.get('[data-testid="powered-by-crq"]').should('not.exist');
  });

  it('should verify that company name and fq date appear in the description of the header', () => {
    // Setup for CRQ scenario
    cy.intercept(
      'GET',
      `/api/risk-register/scenarios/${crqScenario.scenario_id}`,
      {
        statusCode: 200,
        body: crqScenario,
      },
    ).as('getCRQScenario');

    cy.intercept('GET', `/api/companies/${company.id}`, {
      statusCode: 200,
      body: company,
    }).as('getCompany');

    cy.intercept('GET', `/api/fq/${fq.id}`, {
      statusCode: 200,
      body: fq,
    }).as('getFQ');

    cy.mount(<QuantitativeMetricsHeader />, {
      routerParams: {
        scenarioId: crqScenario.scenario_id,
      },
    });

    // Wait for all data to load
    cy.wait('@getCRQScenario');
    cy.wait('@getCompany');
    cy.wait('@getFQ');

    // Check for the full description text
    cy.contains('All the metrics below are retrieved from the quantification of').should('be.visible');

    // Check for company name
    cy.contains(company.name).should('be.visible');


    cy.get('.text-sm.text-text-base-secondary').should('contain', company.name);
    cy.get('.text-sm.text-text-base-secondary').should('contain', 'June 22, 2026');
  });

  it('should verify that clicking on "Refresh" triggers an update request and opens a success modal', () => {
    // Setup for CRQ scenario with refresh functionality
    cy.intercept(
      'GET',
      `/api/risk-register/scenarios/${crqScenario.scenario_id}`,
      {
        statusCode: 200,
        body: crqScenario,
      },
    ).as('getCRQScenario');

    cy.intercept('GET', `/api/companies/${company.id}`, {
      statusCode: 200,
      body: company,
    }).as('getCompany');

    cy.intercept('GET', `/api/fq/${fq.id}`, {
      statusCode: 200,
      body: fq,
    }).as('getFQ');

    // Mock the update CRQ scenario API - use POST method
    cy.intercept('POST', `/api/risk-register/scenarios/crq/${crqScenario.scenario_id}/update-crq`, {
      statusCode: 200,
      body: { message: 'Scenario updated successfully' },
    }).as('updateCRQScenario');

    cy.mount(<QuantitativeMetricsHeader />, {
      routerParams: {
        scenarioId: crqScenario.scenario_id,
      },
    });

    // Wait for data to load
    cy.wait('@getCRQScenario');
    cy.wait('@getCompany');
    cy.wait('@getFQ');

    // Click the refresh button
    cy.get('[data-testid="quantitative-metrics-header-refresh"]').click();

    // Verify the API call was made
    cy.wait('@updateCRQScenario');

    // Check that success modal appears
    cy.get('[data-testid="success-modal"]').should('exist');


  });
});
