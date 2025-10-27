import { CISRecommendation } from '../../types/recommendations';
import { chance } from './buildingUtils';
const randomHighInt = () =>
  chance.integer({ min: 1111111111, max: 9999999999 });
export const buildCisRecomendation = (
  overrides: Partial<CISRecommendation> = {}
): CISRecommendation => {
  return {
    control_name: chance.string([
      'penetration_tests_and_red_team_exercises',
      'continuous_vulnerability_management',
      'email_and_web_browser_protections',
    ]),
    control_code: chance.integer({ min: 1, max: 20 }),
    overall_effect: {
      average_effect: randomHighInt(),
      max_effect: randomHighInt(),
    },
    ransomware_event_impact: {
      event_effect: {
        average_effect: randomHighInt(),
        max_effect: randomHighInt(),
      },
      event_impacts: ['privacy', 'liability', 'regulatory'],
    },
    data_breach_event_impact: {
      event_effect: {
        average_effect: randomHighInt(),
        max_effect: randomHighInt(),
      },
      event_impacts: ['privacy', 'liability', 'regulatory'],
    },
    interruption_event_impact: {
      event_effect: {
        average_effect: randomHighInt(),
        max_effect: randomHighInt(),
      },
      event_impacts: ['privacy', 'liability', 'regulatory'],
    },
    service_provider_data_breach_event_impact: {
      event_effect: {
        average_effect: randomHighInt(),
        max_effect: randomHighInt(),
      },
      event_impacts: ['privacy', 'liability', 'regulatory'],
    },
    service_provider_interruption_event_impact: {
      event_effect: {
        average_effect: randomHighInt(),
        max_effect: randomHighInt(),
      },
      event_impacts: ['privacy', 'liability', 'regulatory'],
    },
    current_ig: chance.string(['ig1', 'ig2', 'ig3']),
    target_ig: chance.string(['ig2', 'ig3']),
    ...overrides,
  };
};

export const CISNameToCode: { [key: string]: number } = {
  ICSA: 2,
  ICHA: 1,
  CVM: 3,
  CUAP: 4,
  SCHS: 5,
  MMAAL: 6,
  EWBP: 7,
  MD: 8,
  LCNPPS: 9,
  DRC: 10,
  SCND: 11,
  BD: 12,
  DP: 13,
  CAB: 14,
  WAC: 15,
  AMC: 16,
  ISA: 17,
  ASS: 18,
  IRM: 19,
  PTRT: 20,
};
