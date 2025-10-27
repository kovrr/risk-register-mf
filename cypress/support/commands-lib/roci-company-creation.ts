import { ROCICompanyFormInput } from '@/mocks/builders/companyBuilder';
import {
  CIS_V8_CONTROLS_KEY,
  COMPANY_DATA_KEY,
  ContinueRunUpdateConfig,
  MINIMAL_SPHERE_KEY
} from '_pages/ROCI/CompanyCreation/Form/utils/types';
import { Interception } from 'cypress/types/net-stubbing';

export const getReadyFormSubmitROCIInitialValues = (
  companyFormData: ROCICompanyFormInput
) => {
  return {
    integration_source: ['alloyscanlite'],
    security_posture: {
      scope: { label: 'control', value: 'control' },
      controls: {
        [CIS_V8_CONTROLS_KEY]: {
          by_theme: {
            ICHA: 2,
            ICSA: 2,
            MD: 2,
            DP: 2,
            CVM: 2,
            CUAP: 2,
            SCHS: 2,
            MMAAL: 2,
            EWBP: 2,
            LCNPPS: 2,
            DRC: 2,
            SCND: 2,
            BD: 2,
            CAB: 2,
            WAC: 2,
            AMC: 2,
            ISA: 2,
            ASS: 2,
            IRM: 2,
            PTRT: 2,
          },
          by_control: {
            ICHA: 3,
            ICSA: 3,
            MD: 3,
            DP: 3,
            CVM: 3,
            CUAP: 3,
            SCHS: 3,
            MMAAL: 3,
            EWBP: 3,
            LCNPPS: 3,
            DRC: 3,
            SCND: 3,
            BD: 3,
            CAB: 3,
            WAC: 3,
            AMC: 3,
            ISA: 3,
            ASS: 3,
            IRM: 3,
            PTRT: 3,
          },
        },
      },
    },
    company_base_details: {
      countries: [
        {
          label: companyFormData.countries[0],
          value: companyFormData.countries[0],
        },
      ],
      name: companyFormData.name,
      domains: companyFormData.domains[0],
      industries: [
        {
          value: companyFormData.industries[0],
          label: companyFormData.industries[0],
        },
      ],
      currency: {
        label: companyFormData.currency,
        value: companyFormData.currency,
      },
      revenue: companyFormData.revenue,
      employees: {
        label: companyFormData.employees,
        value: companyFormData.employees,
      },
    },
    _next: true,
    sphere_data: {
      cloud_infra_ratio: companyFormData.cloud_infra_ratio / 100,
      total_personal_data_records: companyFormData.total_personal_data_records,
      outage_duration: companyFormData.outage_duration,
      average_time_to_recover_for_outage:
        companyFormData.average_time_to_recover_for_outage,
    },
  };
};

export const submitAndCheckFaultedFields = ({
  numberOfFaultedFields,
}: {
  numberOfFaultedFields: number;
}) => {
  cy.get('[data-testid="next-step-button"]').click();
  cy.get('[data-testid="form-error-label"]').should(
    'have.length',
    numberOfFaultedFields
  );
};

export const fillCompanyInfoStep = ({
  companyFormData,
  validateBeforeEach,
}: {
  companyFormData: ROCICompanyFormInput;
  validateBeforeEach?: boolean;
}) => {
  validateBeforeEach &&
    submitAndCheckFaultedFields({ numberOfFaultedFields: 7 });
  cy.get(`input[name="${COMPANY_DATA_KEY}.name"]`)
    .clear()
    .type(companyFormData.name);

  validateBeforeEach &&
    submitAndCheckFaultedFields({ numberOfFaultedFields: 6 });
  cy.get(`input[name="${COMPANY_DATA_KEY}.domains"]`)
    .clear()
    .type(companyFormData.domains[0]);

  validateBeforeEach &&
    submitAndCheckFaultedFields({ numberOfFaultedFields: 5 });
  cy.contains('Industry of Operation')
    .parent()
    .type(`${companyFormData.industries[0]}{enter}`);

  validateBeforeEach &&
    submitAndCheckFaultedFields({ numberOfFaultedFields: 4 });
  cy.contains('Country of Operation')
    .parent()
    .type(`${companyFormData.countries[0]}{enter}`);

  validateBeforeEach &&
    submitAndCheckFaultedFields({ numberOfFaultedFields: 3 });
  cy.contains('Currency').parent().type(`${companyFormData.currency}{enter}`);

  validateBeforeEach &&
    submitAndCheckFaultedFields({ numberOfFaultedFields: 2 });
  cy.get(`input[name="${COMPANY_DATA_KEY}.revenue"]`)
    .clear()
    .type(`${companyFormData.revenue}`);

  validateBeforeEach &&
    submitAndCheckFaultedFields({ numberOfFaultedFields: 1 });
  cy.contains('Number of Employees')
    .parent()
    .type(`${companyFormData.employees}{enter}`);

  validateBeforeEach &&
    cy.get('[data-testid="form-error-label"]').should('have.length', 0);
};

const _getCloudInfraRatioSliderOptions = (cloudInfraRatio: number) => {
  if (cloudInfraRatio === 50) {
    return { direction: '', repeat: 0 };
  }
  if (cloudInfraRatio > 50) {
    return { direction: 'rightarrow', repeat: (cloudInfraRatio - 50) / 5 };
  }
  return { direction: 'leftarrow', repeat: (50 - cloudInfraRatio) / 5 };
};

export const fillMinimalSphereStep = ({
  companyFormData,
  validateBeforeEach,
}: {
  companyFormData: ROCICompanyFormInput;
  validateBeforeEach?: boolean;
}) => {
  const cloudInfraSliderOptions = _getCloudInfraRatioSliderOptions(
    companyFormData.cloud_infra_ratio
  );
  const cloudInfraRatioSliderTicks =
    `{${cloudInfraSliderOptions.direction}}`.repeat(
      cloudInfraSliderOptions.repeat
    );
  validateBeforeEach &&
    submitAndCheckFaultedFields({ numberOfFaultedFields: 1 });
  cy.get(`input[name="${MINIMAL_SPHERE_KEY}.total_personal_data_records"]`)
    .clear()
    .type(`${companyFormData.total_personal_data_records}`);
  validateBeforeEach &&
    cy.get('[data-testid="form-error-label"]').should('have.length', 0);
  cy.get(`[data-testid="ratio-slider"]`).type(cloudInfraRatioSliderTicks);
  cy.get(`input[name="${MINIMAL_SPHERE_KEY}.outage_duration"]`)
    .clear()
    .type(`${companyFormData.outage_duration}`);
  cy.get(
    `input[name="${MINIMAL_SPHERE_KEY}.average_time_to_recover_for_outage"]`
  )
    .clear()
    .type(`${companyFormData.average_time_to_recover_for_outage}`);
};

export const fillSecurityPostureStep = () => {
  cy.get('[role=radiogroup]').each((radioGroup) => {
    cy.wrap(radioGroup).contains('Mostly').click();
  });

  cy.contains('Answer by').parent().contains('Security Theme').click();
  cy.contains('CIS Controls').click();
  cy.get('[role=radiogroup]').each((radioGroup) => {
    cy.wrap(radioGroup).contains('IG3').click();
  });
};

export const fillSelectIntegrationStep = ({
  selectIntegration = true,
}: {
  selectIntegration: boolean;
}) => {
  cy.contains('Set Up Integration');
  cy.get('[data-testid="alloyscanlite-integration-checkbox"]').should(
    'have.attr',
    'data-checked'
  );
  cy.get('[data-testid="alloyscanlite-integration-checkbox"]').click();
  cy.contains('Run Quantification');
  cy.get('[data-testid="alloyscanlite-integration-checkbox"]').should(
    'not.have.attr',
    'data-checked'
  );
  selectIntegration &&
    cy.get('[data-testid="alloyscanlite-integration-checkbox"]').click();
};

export const fillAlloyIntegrationFormStep = (
  companyFormData: ROCICompanyFormInput
) => {
  cy.get('[data-testid="next-step-button"]')
    .contains('Complete Integration')
    .should('be.disabled');
  cy.get(`input[name="client_id"]`)
    .clear()
    .type(`${companyFormData.integration_data.client_id}`);
  cy.get(`input[name="client_secret"]`)
    .clear()
    .type(`${companyFormData.integration_data.client_secret}`);
  cy.get(`input[name="site_id"]`)
    .clear()
    .type(`${companyFormData.integration_data.site_id}`);
  cy.get(`input[name="domain"]`)
    .clear()
    .type(`${companyFormData.integration_data.domain}`);
};

export const validateCompanyE2ERequest = ({
  interception,
  companyFormData,
  withoutIntegrationSource,
  withIntegrationData,
}: {
  interception: Interception;
  companyFormData: ROCICompanyFormInput;
  withoutIntegrationSource?: boolean;
  withIntegrationData?: boolean;
}) => {
  const requestBody = interception.request.body;

  expect(requestBody.company_minimal_input.company_base_details).to.deep.equal({
    name: companyFormData.name,
    domains: companyFormData.domains,
    currency: companyFormData.currency,
    employees: companyFormData.employees,
    countries: companyFormData.countries,
    industries: companyFormData.industries,
    revenue: companyFormData.revenue,
  });

  expect(requestBody.continue_run).to.equal(!!withoutIntegrationSource);

  const requestSphereData = requestBody.company_minimal_input.sphere_data;
  expect({
    average_time_to_recover_for_outage:
      requestSphereData.average_time_to_recover_for_outage,
    cloud_infra_ratio: requestSphereData.cloud_infra_ratio * 100,
    outage_duration: requestSphereData.outage_duration,
    total_personal_data_records: requestSphereData.total_personal_data_records,
  }).to.deep.equal({
    average_time_to_recover_for_outage:
      companyFormData.average_time_to_recover_for_outage,
    cloud_infra_ratio: companyFormData.cloud_infra_ratio,
    outage_duration: companyFormData.outage_duration,
    total_personal_data_records: companyFormData.total_personal_data_records,
  });

  const securityPosture = requestSphereData.security_posture;
  expect(securityPosture.scope).to.equal('control');
  Object.values(securityPosture.controls[CIS_V8_CONTROLS_KEY].by_control).every(
    (controlValue) => expect(controlValue).to.equal(3)
  );
  Object.values(securityPosture.controls[CIS_V8_CONTROLS_KEY].by_theme).every(
    (controlValue) => expect(controlValue).to.equal(2)
  );

  if (withIntegrationData) {
    const integrationConfig = requestBody.integration_config;
    expect(integrationConfig.name).to.equal(
      companyFormData.integration_data.provider
    );
    expect(integrationConfig.is_validated).to.equal(false);
    expect(integrationConfig.integration_details).to.deep.equal(
      companyFormData.integration_data
    );
  }
};

export const validateCompanyE2EUpdateRequest = ({
  interception,
  continueRunUpdate,
}: {
  interception: Interception<ContinueRunUpdateConfig>;
  continueRunUpdate: ContinueRunUpdateConfig;
}) => {
  const requestBody = interception.request.body;
  expect(requestBody).to.deep.equal(continueRunUpdate);
};
