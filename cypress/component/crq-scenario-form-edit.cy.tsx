import ScenarioInputModal from '@/_pages/RiskRegister/ScenarioInputForm/ScenarioInputModal';
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
import { RiskRegisterResponse, scenarioTypes } from '@/types/riskRegister';
import { BaseDriver } from '../support/base-driver';

describe('Scenario Input Form', () => {
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
      `/api/companies?page=1&size=1&fields=id&fields=name&fields=last_quantification.results_narrative.simulation_exposure.top_simulation_stats.event_duration.maximum&fields=last_quantification.results_narrative.simulation_exposure.top_simulation_stats.event_loss.maximum&fields=last_quantification.results_narrative.simulation_exposure.top_simulation_stats.num_of_records_affected.maximum&fields=currency&id=${company.id}`,
      {
        body: {
          items: [company],
          total: 1,
          page: 1,
          size: 1,
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
    cy.viewport(800, 800);
    cy.mockFrontegg([]);
    cy.mount(
      <ScenarioInputModal
        open={true}
        onOpenChange={() => null}
        scenarioType={scenarioTypes.CRQ}
        scenario={scenario}
      />,
    );
    cy.wait(1000);
  });

  it('should show validation errors for required fields when submitting empty form', () => {
    // Wait for form to be fully rendered
    cy.get('[data-testid="crq-entity-select-trigger"]').contains(company.name);
    cy.get('input[name="customer_scenario_id"]').should(
      'have.value',
      scenario.customer_scenario_id,
    );
    cy.get('input[name="name"]').should('have.value', scenario.name);
    cy.get('textarea[name="description"]').should(
      'have.value',
      scenario.description,
    );
    cy.get('[data-testid="likelihood-select"]').should(
      'contain',
      scenario.scenario_data.likelihood,
    );
    cy.get('[data-testid="impact-select"]').should(
      'contain',
      scenario.scenario_data.impact,
    );

    // Verify that initial access vectors checkboxes are disabled and match the scenario data
    cy.get('[data-testid="initial-access-vectors-checkboxes"]').within(() => {
      // Check that all checkboxes are disabled
      cy.get('input[type="checkbox"]').each(($checkbox) => {
        cy.wrap($checkbox).should('be.disabled');
      });

      // Verify that checked boxes match the filter values from scenario data
      scenario.scenario_data?.crq_data?.filters?.initial_vector_filter?.forEach(
        (vector) => {
          cy.get(`input[name="${vector.toLowerCase()}"]`).should('be.checked');
        },
      );
    });

    // Also verify event types and impact types are disabled and match scenario data
    cy.get('[data-testid="event-types-checkboxes"]').within(() => {
      cy.get('input[type="checkbox"]').each(($checkbox) => {
        cy.wrap($checkbox).should('be.disabled');
      });

      scenario.scenario_data?.crq_data?.filters?.event_type_filter?.forEach(
        (eventType) => {
          cy.get(`input[name="${eventType.toLowerCase()}"]`).should(
            'be.checked',
          );
        },
      );
    });

    cy.get('[data-testid="impact-types-checkboxes"]').within(() => {
      cy.get('input[type="checkbox"]').each(($checkbox) => {
        cy.wrap($checkbox).should('be.disabled');
      });
    });

    // Verify that impact magnitude sliders are disabled and show the correct values
    cy.get('[data-testid="impact-magnitude-sliders"]')
      .scrollIntoView()
      .within(() => {
        // Check if sliders are disabled
        cy.get('[role="slider"]').each(($slider) => {
          cy.wrap($slider).should('have.attr', 'data-disabled');
        });

        // Verify data records compromised slider values
        cy.get(
          '[data-testid="data-records-compromised-slider-container"]',
        ).within(() => {
          const minRecords =
            scenario.scenario_data?.crq_data?.filters
              ?.min_number_of_records_filter ?? 0;
          const maxRecords =
            scenario.scenario_data?.crq_data?.filters
              ?.max_number_of_records_filter ?? 0;

          // Check min value
          cy.get('[role="slider"][aria-label="Minimum"]').should(
            'have.attr',
            'aria-valuenow',
            minRecords.toString(),
          );

          // Check max value
          cy.get('[role="slider"][aria-label="Maximum"]').should(
            'have.attr',
            'aria-valuenow',
            maxRecords.toString(),
          );
        });

        // Verify event duration slider values
        cy.get('[data-testid="event-duration-slider-container"]').within(() => {
          const minDuration =
            scenario.scenario_data?.crq_data?.filters?.min_duration_filter ?? 0;
          const maxDuration =
            scenario.scenario_data?.crq_data?.filters?.max_duration_filter ?? 0;

          // Check min value
          cy.get('[role="slider"][aria-label="Minimum"]').should(
            'have.attr',
            'aria-valuenow',
            minDuration.toString(),
          );

          // Check max value
          cy.get('[role="slider"][aria-label="Maximum"]').should(
            'have.attr',
            'aria-valuenow',
            maxDuration.toString(),
          );
        });

        // Verify event cost slider values
        cy.get('[data-testid="event-cost-slider-container"]').within(() => {
          const minDamage =
            scenario.scenario_data?.crq_data?.filters?.min_damage_filter ?? 0;
          const maxDamage =
            scenario.scenario_data?.crq_data?.filters?.max_damage_filter ?? 0;

          // Check min value
          cy.get('[role="slider"][aria-label="Minimum"]').should(
            'have.attr',
            'aria-valuenow',
            minDamage.toString(),
          );

          // Check max value
          cy.get('[role="slider"][aria-label="Maximum"]').should(
            'have.attr',
            'aria-valuenow',
            maxDamage.toString(),
          );
        });
      });
  });

  it('should update a scenario with new data', () => {
    cy.intercept('PATCH', '**/api/risk-register/scenarios/*', {
      statusCode: 200,
    }).as('updateScenario');
    cy.get('input[name="name"]').type('New Name');
    cy.get('textarea[name="description"]').clear().type('New Description');
    cy.get('button[type="submit"]').click();
    cy.wait('@updateScenario').then((interception) => {
      expect(interception.request.method).to.equal('PATCH');
      const payload = interception.request.body;
      expect(payload.name).to.equal('New Name');
      expect(payload.description).to.equal('New Description');
      expect(payload.crq_data.company_id).to.equal(company.id);
      expect(payload.crq_data.filters.initial_vector_filter).to.deep.equal(
        scenario.scenario_data?.crq_data?.filters?.initial_vector_filter,
      );
      const newEventTypeFilter = scenario.scenario_data?.crq_data?.filters
        ?.event_type_filter
        ? [
          ...scenario.scenario_data?.crq_data?.filters?.event_type_filter?.filter(
            (eventType) =>
              eventType !== 'interruption' &&
              eventType !== 'service_provider_interruption' &&
              eventType !== 'data_breach' &&
              eventType !== 'service_provider_data_breach',
          ),

          ...(scenario.scenario_data?.crq_data?.filters?.event_type_filter?.includes(
            'interruption',
          )
            ? ['interruption', 'service_provider_interruption']
            : []),
          ...(scenario.scenario_data?.crq_data?.filters?.event_type_filter?.includes(
            'data_breach',
          )
            ? ['data_breach', 'service_provider_data_breach']
            : []),
        ]
        : [];
      expect(payload.crq_data.filters.event_type_filter).to.deep.equal(
        newEventTypeFilter,
      );
      expect(payload.crq_data.filters.impact_type_filter).to.deep.equal(
        scenario.scenario_data?.crq_data?.filters?.impact_type_filter,
      );
      expect(payload.crq_data.filters.min_number_of_records_filter).to.equal(
        scenario.scenario_data?.crq_data?.filters?.min_number_of_records_filter,
      );
      expect(payload.crq_data.filters.max_number_of_records_filter).to.equal(
        scenario.scenario_data?.crq_data?.filters?.max_number_of_records_filter,
      );
      expect(payload.crq_data.filters.min_duration_filter).to.equal(
        scenario.scenario_data?.crq_data?.filters?.min_duration_filter,
      );
      expect(payload.crq_data.filters.max_duration_filter).to.equal(
        scenario.scenario_data?.crq_data?.filters?.max_duration_filter,
      );
      expect(payload.crq_data.filters.min_damage_filter).to.equal(
        scenario.scenario_data?.crq_data?.filters?.min_damage_filter,
      );
      expect(payload.crq_data.filters.max_damage_filter).to.equal(
        scenario.scenario_data?.crq_data?.filters?.max_damage_filter,
      );
    });
  });
});
