import ScenarioInputModal from '@/_pages/RiskRegister/ScenarioInputForm/ScenarioInputModal';
import {
  buildCompanyWithSphere,
  buildLastQuantification,
} from '@/mocks/builders/companyBuilder';
import { buildQuantification } from '@/mocks/builders/quantificationBuilders';
import {
  cisResultsFQNewSchema,
  mockCisInputData,
} from '@/mocks/data/fqResults';
import { CompanyApiData, CompanyStatus } from '@/types/companyForm';
import { QuantificationData } from '@/types/quantificationData';
import { CRQData, scenarioTypes } from '@/types/riskRegister';
import { BaseDriver } from '../support/base-driver';
import {
  eventTypes,
  fillBasicScenarioDetails,
  fillFormCheckboxes,
  fillImpactMagnitude,
  fillQualitativeMetrics,
  initialAccessVectors,
  serverImpacts,
} from '../support/commands-lib/risk-register-form-helpers';

describe('Scenario Input Form', () => {
  let driver: BaseDriver, company: CompanyApiData, fq: QuantificationData;
  beforeEach(() => {
    driver = new BaseDriver();
    company = buildCompanyWithSphere({
      status: CompanyStatus.COMPLETED,
      last_quantification: buildLastQuantification({
        id: 'new-schema-cis-fq-id',
        results_narrative: {
          ...cisResultsFQNewSchema,
        },
      }),
    });
    fq = buildQuantification({
      id: 'new-schema-cis-fq-id',
      results_narrative: cisResultsFQNewSchema,
      input_data: mockCisInputData,
      status: 'Success',
    });

    if (company.last_quantification?.results_narrative?.simulation_exposure) {
      company.last_quantification.results_narrative.simulation_exposure.top_simulation_stats =
      {
        event_duration: {
          maximum: 1_000_000,
          avg: 0,
          std: 0,
          median: 0,
          percentiles: [],
        },
        event_loss: {
          maximum: 1_000_000,
          avg: 0,
          std: 0,
          median: 0,
          percentiles: [],
        },
        num_of_records_affected: {
          maximum: 1_000_000,
          avg: 0,
          std: 0,
          median: 0,
          percentiles: [],
        },
      };
    }

    cy.intercept('GET', '/api/companies?*', {
      body: {
        items: [company],
        total: 1,
        page: 1,
        size: 100,
      },
    });

    driver.withCompanies([company]).withFq([fq]).mock();
    cy.viewport(800, 800);
    cy.mockFrontegg([]);
    cy.mount(
      <ScenarioInputModal
        open={true}
        onOpenChange={() => null}
        scenarioType={scenarioTypes.CRQ}
      />,
    );
    cy.wait(1000);
  });

  it('should show validation errors for required fields when submitting empty form', () => {
    // Wait for form to be fully rendered
    cy.get('button[type="submit"]').should('exist').click();
    // Check required field error messages
    cy.contains('Modeling Entity is required').should('be.visible');
    cy.contains('Scenario ID is required').should('be.visible');
    cy.contains('Scenario Name is required').should('be.visible');
    cy.contains('Description is required').should('be.visible');
  });

  it('should allow filling basic scenario information', () => {
    fillBasicScenarioDetails(company);
  });
  it('should allow filling impact magnitude values', () => {
    cy.get('[data-testid="crq-entity-select-trigger"]').click();
    cy.get('[data-testid="crq-entity-select-input"]').type(
      `${company.name}{enter}`,
    );

    fillImpactMagnitude(company);
  });

  it('should allow selecting likelihood and impact values', () => {
    fillQualitativeMetrics();
  });


  it('should render initial access vectors section only when company data exists and match the vectors', () => {
    // Select company first
    cy.get('[data-testid="crq-entity-select-trigger"]').click();
    cy.get('[data-testid="crq-entity-select-input"]').type(
      `${company.name}{enter}`,
    );

    // Wait for company data to load
    cy.wait(1000);

    // Get available vectors from company data
    const availableVectors = Object.keys(
      company?.last_quantification?.results_narrative?.by_initial_vector_exposure || {},
    );

    if (availableVectors.length > 0) {
      // Check if section exists and has correct vectors
      cy.get('[data-testid="initial-access-vectors-checkboxes"]', { timeout: 8000 })
        .should('exist')
        .within(() => {
          // Check if select all and clear buttons exist
          cy.contains('button', 'Select All').should('exist');
          cy.contains('button', 'Clear').should('exist');

          // Get all checkboxes and verify their labels match expected vectors
          cy.get('label').then(($labels) => {
            const renderedVectors = Array.from($labels).map((el) =>
              el.innerText.trim().toLowerCase(),
            );
            const expectedVectors = availableVectors.map((v) => v.toLowerCase());

            expect(renderedVectors.sort()).to.deep.equal(
              expectedVectors.sort(),
              'Rendered vectors do not match company data vectors',
            );
          });

          // Verify checkbox functionality using force: true to handle pointer-events: none
          cy.get('input[type="checkbox"]').first().check({ force: true });
          cy.get('input[type="checkbox"]').first().should('be.checked');
        });
    } else {
      // Verify section doesn't exist when no vectors are available
      cy.get('[data-testid="initial-access-vectors-checkboxes"]', { timeout: 4000 })
        .should('not.exist');
      cy.log('No vectors data available - section not rendered, as expected');
    }
  });


  it('should submit form with complete data', () => {
    // Spy on console.log
    cy.intercept('POST', '/api/risk-register/scenarios/crq', {
      statusCode: 201,
    }).as('createScenario');

    fillBasicScenarioDetails(company);
    fillQualitativeMetrics();
    fillFormCheckboxes({ type: 'fill' });
    fillImpactMagnitude(company);

    // Submit form
    cy.get('button[type="submit"]').click();

    cy.wait('@createScenario').then((interception) => {
      expect(interception.request.method).to.equal('POST');
      const payload = interception.request.body;
      const crqData = interception.request.body.crq_data as CRQData;
      expect(payload.customer_scenario_id).to.equal('RISK-001');
      expect(payload.name).to.equal('Test Risk Scenario');
      expect(payload.description).to.equal(
        'This is a test risk scenario description',
      );
      initialAccessVectors.forEach((vector) => {
        expect(crqData.filters.initial_vector_filter).to.include(
          vector.toLowerCase(),
        );
      });

      eventTypes.forEach((eventType) => {
        expect(crqData.filters.event_type_filter).to.include(
          eventType.toLowerCase(),
        );
      });
      serverImpacts.forEach((impact) => {
        expect(crqData.filters.impact_type_filter).to.include(
          impact.toLowerCase(),
        );
      });
      expect(crqData.company_id).to.equal(company.id);
      expect(crqData.filters.max_damage_filter).to.equal(900000);
      expect(crqData.filters.max_duration_filter).to.equal(900000);
      expect(crqData.filters.max_number_of_records_filter).to.equal(900000);
      expect(crqData.filters.min_damage_filter).to.equal(100000);
      expect(crqData.filters.min_duration_filter).to.equal(100000);
      expect(crqData.filters.min_number_of_records_filter).to.equal(100000);
    });
  });
});
