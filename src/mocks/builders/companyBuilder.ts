import { NistV2SafeguardsByGroup, ScaleEnum } from '@/options/nistV2Controls';
import type { AlloyIntegrationDetails } from '@/types/companyCreation';
import { MOCK_TECH_SERVICE } from 'mocks/data/hazardMock';
import type { Hazard, ServiceProvider, Tech } from 'types/quantificationData';
import type {
  SphereDamageType,
  SphereForm,
  SphereSecurityProfileForm,
} from 'types/sphereForm';
import type { CompanyApiData, LastFQ } from '../../types/companyForm';
import { chance } from './buildingUtils';

export const createMockOption = (text: string) => ({
  label: text,
  value: text,
});

export const buildCCC = (
  overrides: Partial<SphereDamageType> = {},
): SphereDamageType => ({
  cc_name: 'Custom CC',
  cost_dist: {
    min_val: 10,
    max_val: 2222,
    mode_val: 323232,
  },
  event_type: 'data_breach',
  impact_scenario: 'liability',
  asset_groups: [{ name: 'bla', type: 'employee_endpoints' }],
  ...overrides,
});

export const buildSphere = (
  overrides: Partial<SphereForm> = {},
): SphereForm => ({
  employee_endpoints: [
    {
      group_name: 'bla',
      os: ['linux'],
      tech: [],
      asset_group_id: chance.guid(),
    },
  ],
  infrastructure: [],
  cloud: [],
  ot: [],
  security: {
    certificates: [],
    cis_implementation_level: {},
  },
  custom_cost_components: [buildCCC()],
  ...overrides,
});

export const buildCisSecurityProfiles = (
  assetGroups?: {
    name: string;
    type: string;
  }[],
): SphereSecurityProfileForm[] => {
  const half = assetGroups?.length ? Math.ceil(assetGroups.length / 2) : 0;
  const first = assetGroups?.slice(0, half);
  const second = assetGroups?.slice(half);
  return [
    {
      profile_name: chance.name(),
      asset_groups: first || [],
      cis_implementation_level: {
        ICHA: chance.pickone([-1, 1]),
        ICSA: chance.pickone([-1, 1]),
        MD: chance.pickone([-1, 1]),
        DP: chance.pickone([-1, 1]),
        CVM: chance.pickone([-1, 1]),
        CUAP: chance.pickone([-1, 1]),
        SCHS: chance.pickone([-1, 1]),
        MMAAL: chance.pickone([-1, 1]),
        EWBP: chance.pickone([-1, 1]),
        LCNPPS: chance.pickone([-1, 1]),
        DRC: chance.pickone([-1, 1]),
        SCND: chance.pickone([-1, 1]),
      },
    },
    {
      profile_name: chance.name(),
      asset_groups: second || [],
      cis_implementation_level: {
        ICHA: chance.pickone([-1, 1]),
        ICSA: chance.pickone([-1, 1]),
        MD: chance.pickone([-1, 1]),
        DP: chance.pickone([-1, 1]),
        CVM: chance.pickone([-1, 1]),
        CUAP: chance.pickone([-1, 1]),
        SCHS: chance.pickone([-1, 1]),
        MMAAL: chance.pickone([-1, 1]),
        EWBP: chance.pickone([-1, 1]),
        LCNPPS: chance.pickone([-1, 1]),
        DRC: chance.pickone([-1, 1]),
        SCND: chance.pickone([-1, 1]),
      },
    },
  ];
};
export const buildCisV8SecurityProfiles = (
  assetGroups?: {
    name: string;
    type: string;
  }[],
): SphereSecurityProfileForm[] => {
  const half = assetGroups?.length ? Math.ceil(assetGroups.length / 2) : 0;
  const first = assetGroups?.slice(0, half);
  const second = assetGroups?.slice(half);
  return [
    {
      profile_name: chance.name(),
      asset_groups: first || [],
      cis_v8_implementation_level_igs: {
        ICEA: chance.pickone([-1, 1]),
        ICSA: chance.pickone([-1, 1]),
        DP: chance.pickone([-1, 1]),
        SCEAS: chance.pickone([-1, 1]),
        AM: chance.pickone([-1, 1]),
        ACM: chance.pickone([-1, 1]),
        CVM: chance.pickone([-1, 1]),
        ALM: chance.pickone([-1, 1]),
        EWBP: chance.pickone([-1, 1]),
        MD: chance.pickone([-1, 1]),
        DR: chance.pickone([-1, 1]),
        NIM: chance.pickone([-1, 1]),
        NMD: chance.pickone([-1, 1]),
      },
    },
    {
      profile_name: chance.name(),
      asset_groups: second || [],
      cis_v8_implementation_level_igs: {
        ICEA: chance.pickone([-1, 1]),
        ICSA: chance.pickone([-1, 1]),
        DP: chance.pickone([-1, 1]),
        SCEAS: chance.pickone([-1, 1]),
        AM: chance.pickone([-1, 1]),
        ACM: chance.pickone([-1, 1]),
        CVM: chance.pickone([-1, 1]),
        ALM: chance.pickone([-1, 1]),
        EWBP: chance.pickone([-1, 1]),
        MD: chance.pickone([-1, 1]),
        DR: chance.pickone([-1, 1]),
        NIM: chance.pickone([-1, 1]),
        NMD: chance.pickone([-1, 1]),
      },
    },
  ];
};
export const buildNistSecurityProfiles = (
  assetGroups?: {
    name: string;
    type: string;
  }[],
): SphereSecurityProfileForm[] => {
  const half = assetGroups?.length ? Math.ceil(assetGroups.length / 2) : 0;
  const first = assetGroups?.slice(0, half);
  const second = assetGroups?.slice(half);
  return [
    {
      profile_name: chance.name(),
      asset_groups: first || [],
      nist_implementation_level: {
        ID_AM: chance.pickone([0, 1, 2]),
        ID_BE: chance.pickone([0, 1, 2]),
        ID_GV: chance.pickone([0, 1, 2]),
        PR_IP: chance.pickone([0, 1, 2]),
        PR_MA: chance.pickone([0, 1, 2]),
        PR_PT: chance.pickone([0, 1, 2]),
      },
    },
    {
      profile_name: chance.name(),
      asset_groups: second || [],
      nist_implementation_level: {
        ID_RA: chance.pickone([0, 1, 2]),
        ID_RM: chance.pickone([0, 1, 2]),
        ID_SC: chance.pickone([0, 1, 2]),
        PR_AC: chance.pickone([0, 1, 2]),
        PR_AT: chance.pickone([0, 1, 2]),
        PR_DS: chance.pickone([0, 1, 2]),
      },
    },
  ];
};

const createNistV2IgsStructure = () => {
  const structure: any = {};
  Object.entries(NistV2SafeguardsByGroup).forEach(([control, subcontrols]) => {
    structure[control] = {};
    subcontrols.forEach((subcontrol: string) => {
      structure[control][subcontrol] = chance.pickone([0, 0.25, 0.5, 0.75, 1]);
    });
  });
  return structure;
};

const createNistV2SafeguardStructure = () => {
  const structure: any = {};
  Object.entries(NistV2SafeguardsByGroup).forEach(([control, subcontrols]) => {
    structure[control] = {};
    subcontrols.forEach((subcontrol) => {
      structure[control][subcontrol] = chance.pickone([0, 0.25, 0.5, 0.75, 1]);
    });
  });
  return structure;
};

export const buildNistV2SecurityProfiles = (
  assetGroups?: {
    name: string;
    type: string;
  }[],
): SphereSecurityProfileForm[] => {
  const half = assetGroups?.length ? Math.ceil(assetGroups.length / 2) : 0;
  const first = assetGroups?.slice(0, half);
  const second = assetGroups?.slice(half);

  return [
    {
      profile_name: chance.name(),
      asset_groups: first || [],
      nist_v2_implementation_level_igs: createNistV2IgsStructure(),
      nist_v2_safeguard_implementation: createNistV2SafeguardStructure(),
      control_scope: 'control',
      scale: ScaleEnum.CMMI,
    },
    {
      profile_name: chance.name(),
      asset_groups: second || [],
      nist_v2_implementation_level_igs: createNistV2IgsStructure(),
      nist_v2_safeguard_implementation: createNistV2SafeguardStructure(),
      control_scope: 'control',
      scale: ScaleEnum.CMMI,
    },
  ];
};

export const buildCompany = (
  company: Partial<CompanyApiData> = {},
): CompanyApiData => {
  const haveFqs = chance.bool();
  const countries = ['US', chance.country()];
  const states = [chance.state(), chance.state()];

  return {
    id: chance.guid(),
    tenant_id: chance.guid(),
    name: chance.name(),
    revenue: chance.natural({ min: 1000000, max: 10000000 }),
    domains: [chance.domain(), chance.domain()],
    countries,
    states,
    industries: ['35', '73'],
    employees: '10,000 - 50,000',
    currency: chance.pickone(['USD', 'EUR']),
    quantification_ids: haveFqs ? [chance.guid()] : [],
    last_quantification: haveFqs ? buildLastQuantification() : undefined,
    status: chance.pickone(['ready_for_data_collection']) as any,
    hazard: buildCompanyHazard(),
    regulations: ['USSLR'],
    certificates: ['SOC', 'ISO'],
    sec_controls_framework: 'CIS',
    cyber_insurance: { limit: 6 },
    ...company,
  };
};

export const buildCompanyWithLastFq = (
  company: Partial<CompanyApiData> = {},
): CompanyApiData => {
  const countries = ['US', chance.country()];
  const states = [chance.state(), chance.state()];
  const fqId = chance.guid();
  return {
    id: chance.guid(),
    name: chance.name(),
    tenant_id: chance.guid(),
    revenue: chance.natural({ min: 1000000, max: 10000000 }),
    domains: [chance.domain(), chance.domain()],
    countries,
    states,
    industries: ['35'],
    employees: '10,000 - 50,000',
    currency: chance.pickone(['USD', 'EUR']),
    quantification_ids: [fqId],
    last_quantification: buildLastQuantification({ id: fqId }),
    status: chance.pickone(['completed_fq']) as any,
    hazard: buildCompanyHazard(),
    regulations: ['USSLR'],
    sec_controls_framework: 'NIST',
    cyber_insurance: { limit: 6 },
    ...company,
  };
};

export const buildCompanyWithSphere = (
  company: Partial<CompanyApiData> = {},
): CompanyApiData => {
  const haveFqs = chance.bool();
  const countries = ['US', chance.country()];
  const states = [chance.state(), chance.state()];

  return {
    id: chance.guid(),
    name: chance.name(),
    tenant_id: chance.guid(),
    revenue: chance.natural({ min: 1000000, max: 10000000 }),
    domains: [chance.domain(), chance.domain()],
    countries,
    states,
    industries: ['35'],
    employees: '10,000 - 50,000',
    currency: chance.pickone(['USD', 'EUR']),
    quantification_ids: haveFqs ? [chance.guid()] : [],
    last_quantification: haveFqs ? buildLastQuantification() : undefined,
    status: chance.pickone(['completed_fq']) as any,
    hazard: buildCompanyHazard(),
    regulations: ['USSLR'],
    cyber_insurance: { limit: 6_000_000, deductible: 10_000, premium: 10_000 },
    sphere: buildSphere(),
    is_sphere_valid: true,
    sec_controls_framework: company.sec_controls_framework ?? 'CIS',
    ...company,
  };
};

export const buildLastQuantification = (
  lastQuantification: Partial<LastFQ> = {},
): LastFQ => {
  return {
    id: chance.guid(),
    status: chance.pickone(['Success', 'Running']),
    created_at: '2020-01-01T00:00:00.000Z',
    updated_at: '2020-01-01T00:00:00.000Z',
    ...lastQuantification,
  };
};

export const buildCompanyHazard = (overrides: Partial<Hazard> = {}) => {
  return {
    technologies: {
      ...MOCK_TECH_SERVICE.technologies,
      ...(overrides?.technologies || {}),
    },
    providers: {
      ...MOCK_TECH_SERVICE.providers,
      ...(overrides?.providers || {}),
    },
  };
};

export const buildProviders = (
  overrides: Partial<ServiceProvider> = {},
): ServiceProvider => {
  return {
    cdn: [],
    cms: [],
    crm: [],
    dns: [],
    email_vendor: [],
    paas: [],
    ...overrides,
  };
};

export const buildTechnologies = (overrides: Partial<Tech> = {}): Tech => {
  return {
    client_app: [],
    cms: [],
    db: [],
    dns: [],
    infrastructure: [],
    IoT: [],
    mail: [],
    network_app: [],
    os: [],
    remote_access: [],
    web: [],
    voip: [],
    storage: [],
    security: [],
    printer: [],
    server_app: [],
    camera: [],
    plc_hardware: [],
    analytics: [],
    hmi_hardware: [],
    rtu_hardware: [],
    dcs_hardware: [],
    scada_software: [],
    hmi_software: [],
    ftp: [],
    proxy: [],
    ssl: [],
    ics_software: [],
    wms_hardware: [],
    iacs_hardware: [],
    pam_software: [],
    ied_hardware: [],
    mes_software: [],
    ...overrides,
  };
};

export interface CompanyFormInput {
  name: string;
  revenue: number;
  domains: string[];
  countries: string[];
  states: string[];
  industries: string[];
  employees: string;
  currency: string;
  regulations: string[];
  sec_controls_framework: string;
  cyber_insurance: any; // TBD when used
}

export const buildCompanyFormInput = (input?: Partial<CompanyFormInput>) => {
  return {
    name: chance.name(),
    revenue: chance.natural({ min: 1000000, max: 10000000 }),
    domains: [chance.domain(), chance.domain()],
    countries: ['US', chance.country()],
    states: [chance.state(), chance.state()],
    industries: ['35'],
    employees: '10,000 - 50,000',
    currency: chance.pickone(['USD', 'EUR']),
    regulations: ['USSLR'],
    cyber_insurance: { limit: 6 },
    ...input,
  };
};

export type ROCICompanyFormInput = {
  name: string;
  revenue: number;
  domains: string[];
  countries: string[];
  industries: string[];
  employees: string;
  currency: string;
  total_personal_data_records: number;
  cloud_infra_ratio: number;
  outage_duration: number;
  outage_duration_cloud?: number;
  average_time_to_recover_for_outage: number;
  average_time_to_recover_for_outage_cloud?: number;
  manual_cloud_providers?: string[];
  integration_data: AlloyIntegrationDetails;
};

const cloudInfraRatioPossibleValues = Array.from(
  { length: 21 },
  (_, i) => i * 5,
); // 0, 5, 10, 15, ..., 100

export const buildROCICompanyFormInput = (
  input?: Partial<ROCICompanyFormInput>,
): ROCICompanyFormInput => {
  return {
    name: chance.name(),
    revenue: chance.natural({ min: 1000000, max: 10000000 }),
    domains: [chance.domain()],
    countries: [chance.pickone(['AU', 'AZ'])],
    industries: ['35'],
    employees: '10,000 - 50,000',
    currency: chance.pickone(['USD', 'EUR']),
    total_personal_data_records: chance.natural({ min: 100, max: 100000 }),
    cloud_infra_ratio: chance.pickone(cloudInfraRatioPossibleValues),
    outage_duration: chance.natural({ min: 1, max: 100 }),
    outage_duration_cloud: chance.natural({ min: 1, max: 100 }),
    average_time_to_recover_for_outage: chance.natural({ min: 1, max: 100 }),
    average_time_to_recover_for_outage_cloud: chance.natural({
      min: 1,
      max: 100,
    }),
    manual_cloud_providers: chance.pickset(
      ['AWS', 'Azure'],
      chance.integer({ min: 1, max: 3 }),
    ),
    integration_data: {
      provider: 'alloyscanlite',
      client_id: chance.guid(),
      client_secret: chance.guid(),
      site_id: chance.guid(),
      domain: chance.domain(),
    },
    ...input,
  };
};
