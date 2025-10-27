import ControlsPreview from '@/_pages/RiskRegister/ScenarioDrillDown/ControlsModal/ControlsPreview';
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

describe('RelevantControlsModal', () => {
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

    cy.intercept(
      'PATCH',
      `/api/risk-register/scenarios/${scenario.scenario_id}`,
      {
        statusCode: 200,
        body: scenario,
      },
    ).as('updateScenario');

    driver.withCompanies([company]).withFq([fq]).mock();
    cy.mockFrontegg([]);
    cy.mount(<ControlsPreview includeHeader={true} />, {
      routerParams: {
        scenarioId: scenario.scenario_id,
      },
    });
    cy.wait('@getScenario');
  });

  it('should display the correct number of controls for each framework', () => {
    const relevantControls = scenario.scenario_data.relevant_controls;

    if (relevantControls.relevant_cis_v8_safeguards.length > 0) {
      cy.get('[data-testid="framework-count-cis_v8_safeguards"]')
        .should('be.visible')
        .and('contain.text', relevantControls.relevant_cis_v8_safeguards.length);
    }

    if (relevantControls.relevant_cis_v8_controls.length > 0) {
      cy.get('[data-testid="framework-count-cis_v8"]')
        .should('be.visible')
        .and('contain.text', relevantControls.relevant_cis_v8_controls.length);
    }

    if (relevantControls.relevant_cis_controls.length > 0) {
      cy.get('[data-testid="framework-count-cis"]')
        .should('be.visible')
        .and('contain.text', relevantControls.relevant_cis_controls.length);
    }

    if (relevantControls.relevant_cis_v7_safeguards.length > 0) {
      cy.get('[data-testid="framework-count-cis_v7_safeguards"]')
        .should('be.visible')
        .and('contain.text', relevantControls.relevant_cis_v7_safeguards.length);
    }

    if (relevantControls.relevant_nist_controls.length > 0) {
      cy.get('[data-testid="framework-count-nist"]')
        .should('be.visible')
        .and('contain.text', relevantControls.relevant_nist_controls.length);
    }

    if (relevantControls.relevant_iso27001_controls.length > 0) {
      cy.get('[data-testid="framework-count-iso"]')
        .should('be.visible')
        .and('contain.text', relevantControls.relevant_iso27001_controls.length);
    }

    if (relevantControls.relevant_tisax_controls.length > 0) {
      cy.get('[data-testid="framework-count-tisax"]')
        .should('be.visible')
        .and('contain.text', relevantControls.relevant_tisax_controls.length);
    }
  });

  it('should expand frameworks and display control titles', () => {
    const relevantControls = scenario.scenario_data.relevant_controls;

    if (relevantControls.relevant_cis_v8_safeguards.length > 0) {
      cy.get('[data-testid="framework-collapsible-cis_v8_safeguards"]').click();

      relevantControls.relevant_cis_v8_safeguards.forEach((controlId) => {
        cy.get(`[data-testid="control-item-${controlId}"]`).should('be.visible');
        cy.get(`[data-testid="control-title-${controlId}"]`).should('be.visible');
        cy.get(`[data-testid="control-description-${controlId}"]`).should('be.visible');
      });
    }

    if (relevantControls.relevant_cis_v8_controls.length > 0) {
      cy.get('[data-testid="framework-collapsible-cis_v8"]').click();

      relevantControls.relevant_cis_v8_controls.forEach((controlId) => {
        cy.get(`[data-testid="control-item-${controlId}"]`).should('be.visible');
        cy.get(`[data-testid="control-title-${controlId}"]`).should('be.visible');
        cy.get(`[data-testid="control-description-${controlId}"]`).should('be.visible');
      });
    }

    if (relevantControls.relevant_cis_controls.length > 0) {
      cy.get('[data-testid="framework-collapsible-cis"]').click();

      relevantControls.relevant_cis_controls.forEach((controlId) => {
        cy.get(`[data-testid="control-item-${controlId}"]`).should('be.visible');
        cy.get(`[data-testid="control-title-${controlId}"]`).should('be.visible');
        cy.get(`[data-testid="control-description-${controlId}"]`).should('be.visible');
      });
    }

    if (relevantControls.relevant_nist_controls.length > 0) {
      cy.get('[data-testid="framework-collapsible-nist"]').click();

      relevantControls.relevant_nist_controls.forEach((controlId) => {
        cy.get(`[data-testid="control-item-${controlId}"]`).should('be.visible');
        cy.get(`[data-testid="control-title-${controlId}"]`).should('be.visible');
        cy.get(`[data-testid="control-description-${controlId}"]`).should('be.visible');
      });
    }

    if (relevantControls.relevant_tisax_controls.length > 0) {
      cy.get('[data-testid="framework-collapsible-tisax"]').click();

      relevantControls.relevant_tisax_controls.forEach((controlId) => {
        cy.get(`[data-testid="control-item-${controlId}"]`).should('be.visible');
        cy.get(`[data-testid="control-title-${controlId}"]`).should('be.visible');
        cy.get(`[data-testid="control-description-${controlId}"]`).should('be.visible');
      });
    }
  });

  it('should open modal when edit button is clicked', () => {
    cy.get('[data-testid="edit-controls-button"]').click();

    cy.get('[data-testid="modal-framework-title"]').should('be.visible');
    cy.get('[data-testid="save-changes-button"]').should('be.visible');
  });

  it('should display correct framework counts in modal', () => {
    cy.get('[data-testid="edit-controls-button"]').click();

    const relevantControls = scenario.scenario_data.relevant_controls;

    if (relevantControls.relevant_cis_v8_safeguards.length > 0) {
      cy.get('[data-testid="modal-framework-cis_v8_safeguards"]').click();
      cy.get('[data-testid="modal-framework-count-cis_v8_safeguards"]')
        .should('contain.text', relevantControls.relevant_cis_v8_safeguards.length);
    }

    if (relevantControls.relevant_cis_v8_controls.length > 0) {
      cy.get('[data-testid="modal-framework-cis_v8"]').click();
      cy.get('[data-testid="modal-framework-count-cis_v8"]')
        .should('contain.text', relevantControls.relevant_cis_v8_controls.length);
    }

    if (relevantControls.relevant_cis_controls.length > 0) {
      cy.get('[data-testid="modal-framework-cis"]').click();
      cy.get('[data-testid="modal-framework-count-cis"]')
        .should('contain.text', relevantControls.relevant_cis_controls.length);
    }

    if (relevantControls.relevant_nist_controls.length > 0) {
      cy.get('[data-testid="modal-framework-nist"]').click();
      cy.get('[data-testid="modal-framework-count-nist"]')
        .should('contain.text', relevantControls.relevant_nist_controls.length);
    }

    if (relevantControls.relevant_tisax_controls.length > 0) {
      cy.get('[data-testid="modal-framework-tisax"]').click();
      cy.get('[data-testid="modal-framework-count-tisax"]')
        .should('contain.text', relevantControls.relevant_tisax_controls.length);
    }
  });

  it('should save changes when save button is clicked', () => {
    cy.get('[data-testid="edit-controls-button"]').click();

    cy.get('[data-testid="save-changes-button"]').should('be.visible');

    cy.get('[data-testid="save-changes-button"]').click();

    cy.wait('@updateScenario').then((interception) => {
      expect(interception.request?.body).to.have.property('relevant_controls');
    });
  });

  it('should handle scenario with no controls', () => {
    const emptyScenario = buildCRQRiskRegisterResponse(
      {
        customer_scenario_id: 'RISK-002',
        name: 'Empty Risk Scenario',
        description: 'This scenario has no relevant controls',
      },
      'complete',
      { company_id: company.id },
    );

    emptyScenario.scenario_data.relevant_controls = {
      ...emptyScenario.scenario_data.relevant_controls,
      relevant_cis_controls: [],
      relevant_cis_v8_controls: [],
      relevant_cis_v8_safeguards: [],
      relevant_cis_v7_safeguards: [],
      relevant_nist_controls: [],
      relevant_iso27001_controls: [],
      relevant_tisax_controls: [],
    };

    cy.intercept(
      'GET',
      `/api/risk-register/scenarios/${emptyScenario.scenario_id}`,
      {
        statusCode: 200,
        body: emptyScenario,
      },
    ).as('getEmptyScenario');

    cy.mount(<ControlsPreview includeHeader={true} />, {
      routerParams: {
        scenarioId: emptyScenario.scenario_id,
      },
    });

    cy.wait('@getEmptyScenario');

    cy.get('[data-testid="no-controls-message"]').should('be.visible');

    cy.get('[data-testid="edit-controls-button"]').should('be.visible');
  });
});
