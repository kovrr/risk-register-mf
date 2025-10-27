import {
  setCisDefaultValues,
  setCisSafeguardsDefaultValues,
} from '@/options/initial-values';
import {
  CIS_V8_CONTROLS_KEY,
  COMPANY_DATA_KEY,
  MINIMAL_SPHERE_KEY,
  type MinimalInput,
  type ROCICompanyApiData,
} from '@/types/companyCreation';
import { E2EStatuses, type LastE2E } from 'types/companyForm';
import { chance } from './buildingUtils';

export const buildMinimalSphereData = (): MinimalInput['sphere_data'] => {
  return {
    average_time_to_recover_for_outage: chance.natural({ min: 1, max: 100 }),
    average_time_to_recover_for_outage_cloud: chance.natural({
      min: 1,
      max: 100,
    }),
    cloud_infra_ratio: chance.floating({ min: 0, max: 1 }),
    manual_cloud_providers: undefined,
    outage_duration: chance.natural({ min: 1, max: 100 }),
    outage_duration_cloud: undefined,
    total_personal_data_records: chance.natural({ min: 1, max: 1000000 }),
    security_posture: {
      scope: chance.pickone(['theme', 'control']),
      controls: {
        [CIS_V8_CONTROLS_KEY]: {
          by_theme: setCisDefaultValues(chance.natural({ min: 0, max: 3 })),
          by_control: setCisDefaultValues(chance.natural({ min: 0, max: 3 })),
          by_maturity: setCisSafeguardsDefaultValues(
            chance.natural({ min: 0, max: 3 }),
          ),
        },
      },
    },
  };
};

export const buildROCICompanyData = (
  overrides?: Partial<ROCICompanyApiData>,
): ROCICompanyApiData => {
  return {
    name: chance.name(),
    countries: ['US'],
    currency: chance.pickone(['USD', 'EUR']),
    domains: [chance.domain()],
    employees: '< 10',
    industries: [
      chance.pickone([
        '1',
        '12',
        '17',
        '35',
        '42',
        '51',
        '54',
        '63',
        '73',
        '94',
      ]),
    ],
    revenue: `${chance.integer({ min: 100_000, max: 1_000_000_000 })}`,
    ...overrides,
  };
};

export const buildCompanyMinimalInput = (): MinimalInput => {
  return {
    [COMPANY_DATA_KEY]: buildROCICompanyData(),
    [MINIMAL_SPHERE_KEY]: buildMinimalSphereData(),
  };
};

export const buildLastE2E = (overrides?: Partial<LastE2E>): LastE2E => {
  return {
    id: chance.guid(),
    status: E2EStatuses.Success,
    created_at: chance.date().toISOString(),
    updated_at: chance.date().toISOString(),
    company_minimal_input: buildCompanyMinimalInput(),
    ...overrides,
  };
};
