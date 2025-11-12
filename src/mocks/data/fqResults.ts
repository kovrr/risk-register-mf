// @ts-nocheck
// @ts-nocheck
import { BY_EVENT_TYPE_EXPOSURE_MOCK } from './byEventTypeExposure';
import { BY_SCENARIO_EXPOSURE_MOCK } from './byScenarioExposure';
import { CIS_RECOMMENDATIONS_MOCK } from './cisMock';
import { OVERALL_EXPOSURE_MOCK } from './overallExposure';
import { THIRD_PARTY_EXPOSURE_MOCK } from './thirdPartyExposure';
import { chance } from '../../mocks/builders/buildingUtils';
import {
  buildNewSchemaResults,
  buildResultsWithCisControlsScenarios,
  buildResultsWithNistControlsScenarios,
  buildRichSimulationExposure,
  buildRiskScenarios,
} from 'mocks/builders/quantificationBuilders';
import { QuantificationOld } from 'types/quantificationData';
import { buildSphere } from 'mocks/builders/companyBuilder';
import {
  SphereEmployeesEndpointsAssetGroup,
  SphereForm,
  SphereSecurityProfileForm,
} from 'types/sphereForm';
import { ISO27001FormInitialValues } from '@/security/ISO/formInitialValues';
import { buildVendorData } from 'mocks/builders/fqInputDataBuilders';

const empAg = {
  id: chance.guid(),
  name: chance.name(),
  type: 'employee_endpoints',
};
const infraAg = {
  id: chance.guid(),
  name: chance.name(),
  type: 'infrastructure',
};
const cloudAg = { id: chance.guid(), name: chance.name(), type: 'cloud' };

const baseInputData = {
  businessProfile: {
    entityName: 'Hamilton Lane',
    revenue: 349000000,
    currency: 'USD',
    employees: '750',
    country: ['US'],
    state: ['PA'],
    industry: ['6200'],
    domains: ['hamiltonlane.com', '361capital.com'],
  },
  businessCriticality: {
    country: ['US'],
    state: ['PA'],
    industry: ['62'],
  },
  dataRecords: {
    pci: '< 50,000',
    pii: '< 50,000',
    phi: '0',
    otherTypes: '500,000 - 5,000,000',
    storedTogether: 50,
  },
  regulation: {
    regulatoryRequirements: ['GDPR', 'USFLR', 'USSLR'],
    securityCertifications: ['SOC'],
    securityMechanisms: ['ICHA', 'ICSA', 'CVM', 'CUAP', 'SCHS'],
  },
  relianceOnNetwork: {
    restoreHours: 1,
    productivityPercentage: 15,
    incomePercentage: 15,
    outageDuration: 0,
    endpoints: 1250,
  },
  cyberInsurance: {},
  pastEvents: [],
};

export const mockCisInputData = {
  ...baseInputData,
  vendor_data: buildVendorData(),

  sphere: {
    employee_endpoints: [
      {
        group_name: empAg.name,
        os: ['linux'],
        tech: [],
        income_reliance: 77,
      } as SphereEmployeesEndpointsAssetGroup,
    ],
    cloud: [
      {
        group_name: cloudAg.name,

        pci_stored: 1232,
        phi_stored: 123,
        pii_stored: 123,
        providers_used: [
          'paas:Microsoft:Microsoft Azure:',
          'paas:Microsoft:microsoft dynamics 365:global',
          'paas:Google:GCP:',
        ],
        productivity_reliance: 100,
        income_reliance: 100,
        max_number_of_records_stored_together: 123,
      },
    ],
    infrastructure: [
      {
        group_name: infraAg.name,
        os: ['windows'],
        isNew: false,
        productivity_reliance: 875,
        pci_stored: 12342,
        phi_stored: 2123,
        pii_stored: 4123,
      },
    ],
    ot: [],
    security: {
      certificates: [],
      cis_implementation_level: {},
    },
    custom_cost_components: [
      {
        cc_name: 'Custom CC',
        asset_groups: [],
        cost_dist: {
          max_val: 10000,
          min_val: 100,
          mode_val: 1000,
        },
        event_type: 'data_breach',
        impact_scenario: 'liability',
      },
    ],
    security_profiles: [
      {
        profile_name: 'Security Profile 1',
        cis_implementation_level: {
          ICSA: 2,
          ICHA: 1,
          CVM: 1,
          CUAP: 1,
          MD: 2,
          LCNPPS: 2,
          DRC: 2,
          SCND: 2,
          BD: 2,
          DP: 1,
          CAB: 1,
        },
        asset_groups: [
          { name: empAg.name, type: empAg.type },
          { name: cloudAg.name, type: cloudAg.type },
        ],
      } as SphereSecurityProfileForm,
      {
        profile_name: 'Security Profile 2',
        cis_implementation_level: {
          ICSA: 0,
          ICHA: 0,
          CVM: 2,
          CUAP: 2,
          MD: 1,
          LCNPPS: 1,
          DRC: 1,
          SCND: 1,
          BD: 1,
          DP: 1,
          CAB: 1,
        },
        asset_groups: [{ name: infraAg.name, type: infraAg.type }],
      } as SphereSecurityProfileForm,
    ],
  } as SphereForm,
  sec_controls_framework: 'CIS',
  revenue: chance.integer({ min: 1000000, max: 1000000000 }),
} as const;

export const mockCisV8InputData = {
  ...baseInputData,
  vendor_data: buildVendorData(),
  sphere: {
    employee_endpoints: [
      {
        group_name: empAg.name,
        os: ['linux'],
        tech: [],
        income_reliance: 77,
      } as SphereEmployeesEndpointsAssetGroup,
    ],
    cloud: [
      {
        group_name: cloudAg.name,

        pci_stored: 1232,
        phi_stored: 123,
        pii_stored: 123,
        providers_used: [
          'paas:Microsoft:Microsoft Azure:',
          'paas:Microsoft:microsoft dynamics 365:global',
          'paas:Google:GCP:',
        ],
        productivity_reliance: 100,
        income_reliance: 100,
        max_number_of_records_stored_together: 123,
      },
    ],
    infrastructure: [
      {
        group_name: infraAg.name,
        os: ['windows'],
        isNew: false,
        productivity_reliance: 875,
        pci_stored: 12342,
        phi_stored: 2123,
        pii_stored: 4123,
      },
    ],
    ot: [],
    security: {
      certificates: [],
      cis_implementation_level: {},
    },
    custom_cost_components: [
      {
        cc_name: 'Custom CC',
        asset_groups: [],
        cost_dist: {
          max_val: 10000,
          min_val: 100,
          mode_val: 1000,
        },
        event_type: 'data_breach',
        impact_scenario: 'liability',
      },
    ],
    security_profiles: [
      {
        profile_name: 'Security Profile 1',
        cis_v8_implementation_level_igs: {
          ICEA: 2,
          ICSA: 2,
          DP: 2,
          SCEAS: 1,
          AM: 1,
          ACM: 1,
          CVM: 2,
          ALM: 2,
          EWBP: 2,
          MD: 2,
          DR: 2,
          NIM: 1,
          NMD: 1,
        },
        asset_groups: [
          { name: empAg.name, type: empAg.type },
          { name: cloudAg.name, type: cloudAg.type },
        ],
      } as SphereSecurityProfileForm,
      {
        profile_name: 'Security Profile 2',
        cis_v8_implementation_level_igs: {
          ICEA: 0,
          ICSA: 0,
          DP: 0,
          SCEAS: 0,
          AM: 2,
          ACM: 2,
          CVM: 1,
          ALM: 1,
          EWBP: 1,
          MD: 1,
          DR: 1,
          NIM: 1,
          NMD: 1,
        },
        asset_groups: [{ name: infraAg.name, type: infraAg.type }],
      } as SphereSecurityProfileForm,
    ],
  } as SphereForm,
  sec_controls_framework: 'CISv8',
  revenue: chance.integer({ min: 1000000, max: 1000000000 }),
} as const;
export const mockNistInputData = {
  ...baseInputData,
  vendor_data: buildVendorData(),
  sphere: {
    employee_endpoints: [
      { group_name: empAg.name, os: ['linux'], tech: [], income_reliance: 77 },
    ],
    cloud: [
      {
        group_name: cloudAg.name,
        pci_stored: 1232,
        phi_stored: 123,
        pii_stored: 123,
        providers_used: [
          'paas:Microsoft:Microsoft Azure:',
          'paas:Microsoft:microsoft dynamics 365:global',
          'paas:Google:GCP:',
        ],
        productivity_reliance: 100,
        income_reliance: 100,
        max_number_of_records_stored_together: 123,
      },
    ],
    infrastructure: [
      {
        group_name: infraAg.name,
        os: ['windows'],
        isNew: false,
        productivity_reliance: 875,
      },
    ],
    ot: [],
    security: { certificates: [], cis_implementation_level: {} },
    security_profiles: [
      {
        profile_name: 'Security Profile 1',
        nist_implementation_level: {
          ID_AM: 2,
          ID_BE: 1,
          ID_GV: 1,
          ID_RA: 1,
          ID_SC: 2,
          PR_AC: 2,
          PR_AT: 2,
          PR_DS: 2,
          PR_IP: 2,
          PR_MA: 2,
          PR_PT: 2,
        },
        asset_groups: [
          { name: empAg.name, type: empAg.type },
          { name: cloudAg.name, type: cloudAg.type },
        ],
      },
      {
        profile_name: 'Security Profile 2',
        nist_implementation_level: {
          ID_AM: 1,
          ID_BE: 2,
          ID_GV: 2,
          ID_RA: 2,
          ID_SC: 1,
          PR_AC: 1,
          PR_AT: 1,
          PR_DS: 1,
          PR_IP: 1,
          PR_MA: 1,
          PR_PT: 1,
        },
        asset_groups: [{ name: infraAg.name, type: infraAg.type }],
      },
    ],
    custom_cost_components: [
      {
        cc_name: 'Custom CC',
        asset_groups: [],
        cost_dist: {
          max_val: 10000,
          min_val: 100,
          mode_val: 1000,
        },
        event_type: 'data_breach',
        impact_scenario: 'liability',
      },
    ],
  } as SphereForm,
  sec_controls_framework: 'NIST',
  revenue: chance.integer({ min: 1000000, max: 1000000000 }),
} as const;

export const mockISOInputData = {
  ...baseInputData,
  vendor_data: buildVendorData(),
  sphere: {
    employee_endpoints: [
      { group_name: empAg.name, os: ['linux'], tech: [], income_reliance: 77 },
    ],
    cloud: [
      {
        group_name: cloudAg.name,
        pci_stored: 1232,
        phi_stored: 123,
        pii_stored: 123,
        providers_used: [
          'paas:Microsoft:Microsoft Azure:',
          'paas:Microsoft:microsoft dynamics 365:global',
          'paas:Google:GCP:',
        ],
        productivity_reliance: 100,
        income_reliance: 100,
        max_number_of_records_stored_together: 123,
      },
    ],
    infrastructure: [
      {
        group_name: infraAg.name,
        os: ['windows'],
        isNew: false,
        productivity_reliance: 875,
      },
    ],
    ot: [],
    security: { certificates: [], cis_implementation_level: {} },
    security_profiles: [
      {
        profile_name: 'Security Profile 1',
        iso27001_implementation_level: ISO27001FormInitialValues,
        asset_groups: [
          { name: empAg.name, type: empAg.type },
          { name: cloudAg.name, type: cloudAg.type },
        ],
      },
      {
        profile_name: 'Security Profile 2',
        nist_implementation_level: {
          ID_AM: 1,
          ID_BE: 2,
          ID_GV: 2,
          ID_RA: 2,
          ID_SC: 1,
          PR_AC: 1,
          PR_AT: 1,
          PR_DS: 1,
          PR_IP: 1,
          PR_MA: 1,
          PR_PT: 1,
        },
        asset_groups: [{ name: infraAg.name, type: infraAg.type }],
      },
    ],
  } as SphereForm,
  sec_controls_framework: 'NIST',
  revenue: chance.integer({ min: 1000000, max: 1000000000 }),
} as const;

export const mockNoAGLevelInputDSata = {
  sphere: buildSphere(),
  vendor_data: buildVendorData(),
};

export const cisResultsFQ = buildResultsWithCisControlsScenarios();
export const nistResultsFQ = buildResultsWithNistControlsScenarios();
export const resultsLegacy: QuantificationOld = {
  overall_exposure: OVERALL_EXPOSURE_MOCK,
  by_event_type_exposure: BY_EVENT_TYPE_EXPOSURE_MOCK,
  by_scenario_exposure: BY_SCENARIO_EXPOSURE_MOCK,
  third_party_exposure: THIRD_PARTY_EXPOSURE_MOCK,
  cis_recommendation: CIS_RECOMMENDATIONS_MOCK,
  asset_group_information: {
    [empAg.id]: {
      name: empAg.name,
      type: empAg.type,
    },
    [cloudAg.id]: {
      name: cloudAg.name,
      type: cloudAg.type,
    },
    [infraAg.id]: {
      name: infraAg.name,
      type: infraAg.type,
    },
  },
};

export const cisResultsFQNewSchema = buildNewSchemaResults({
  sec_controls_frameworks: 'cis',
});
export const cisV8ResultsFQNewSchema = buildNewSchemaResults({
  sec_controls_frameworks: 'cis_v8',
});

const simulationExposure = buildRichSimulationExposure();
export const cisResultsFQNewSchemaAALAboveBaseline = buildNewSchemaResults({
  sec_controls_frameworks: 'cis',
  simulation_exposure: simulationExposure,
  risk_scenarios: buildRiskScenarios(simulationExposure.aal / 1000),
});

export const cisResultsFQNewSchemaAALUnderMinimal = buildNewSchemaResults({
  sec_controls_frameworks: 'cis',
  simulation_exposure: simulationExposure,
  risk_scenarios: buildRiskScenarios(simulationExposure.aal * 1000),
});
export const nistResultsFQNewSchema = buildNewSchemaResults({
  sec_controls_frameworks: 'nist',
});

export const iso27001ResultsFQNewSchema = buildNewSchemaResults({
  sec_controls_frameworks: 'iso27001',
});
