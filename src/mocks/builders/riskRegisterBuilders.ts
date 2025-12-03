// @ts-nocheck
import { CURRENCY_CODES } from '@/options/constants';
import { initialAttackVectorsAsStringArray } from '@/types/riskDrivers/attackVectors';
import { ClickableEventType } from '@/types/riskDrivers/eventTypes';
import {
  CRQData,
  CustomField,
  CustomFieldType,
  DocumentOutput,
  NoteOutput,
  RiskOwner,
  RiskRegisterImpact,
  RiskRegisterLikelihood,
  RiskRegisterPriority,
  RiskRegisterResponse,
  RiskRegisterResponsePlan,
  ScenarioCreateRequest,
  ScenarioData,
  ScenarioMetricsHistory,
  SimpleScenarioUpdateRequest,
  customFieldTypes,
  riskRegisterImpacts,
  riskRegisterLikelihoods,
  riskRegisterPriorities,
  riskRegisterResponsePlans,
  scenarioStatus,
  scenarioTypes,
} from '@/types/riskRegister';
import { chance } from './buildingUtils';
import {
  buildAgData,
  buildControlScenarios,
  buildCostComponentsBreakdown,
  buildLeanSimulationExposure,
} from './quantificationBuilders';

const buildScenarioData = (
  overrides: Partial<ScenarioData> = {},
): ScenarioData => ({
  risk_priority: chance.pickone(['High', 'Medium', 'Low']),
  likelihood: chance.pickone(Object.values(riskRegisterLikelihoods)),
  impact: chance.pickone(Object.values(riskRegisterImpacts)),
  annual_likelihood: chance.floating({ min: 0, max: 1 }),
  peer_base_rate: chance.floating({ min: 0, max: 1 }),
  average_loss: chance.integer({ min: 1000, max: 1000000 }),
  average_loss_currency: chance.pickone(CURRENCY_CODES),
  response_plan: chance.pickone(Object.values(riskRegisterResponsePlans)),
  risk_owner: chance.guid(),
  impact_distribution: {
    ninety_nine: chance.integer({ min: 800000, max: 1000000 }),
    seventy_five: chance.integer({ min: 600000, max: 800000 }),
    fifty: chance.integer({ min: 400000, max: 600000 }),
    twenty_five: chance.integer({ min: 200000, max: 400000 }),
    one: chance.integer({ min: 0, max: 200000 }),
  },
  sec_controls_framework: 'CISv8',
  methodology_insights: chance.paragraph(),
  relevant_controls: {
    cis_implementation_level: {
      ICSA: 0,
      ICHA: 0,
      CVM: 1,
      CUAP: 1,
      SCHS: 1,
      MMAAL: 0,
      EWBP: 0,
      MD: 0,
      LCNPPS: 0,
      DRC: 0,
      SCND: 0,
      BD: 0,
      DP: 0,
      CAB: 0,
      WAC: 0,
      AMC: 0,
      ISA: 0,
      ASS: 0,
      IRM: 0,
      PTRT: 0,
    },
    nist_implementation_level: {
      DE_AE: 0,
      DE_CM: 0,
      DE_DP: 0,
      ID_AM: 0,
      ID_BE: 0,
      ID_GV: 0,
      ID_RA: 1,
      ID_RM: 1,
      ID_SC: 1,
      PR_AC: 1,
      PR_AT: 1,
      PR_DS: 1,
      PR_IP: 1,
      PR_MA: 1,
      PR_PT: 1,
      RC_CO: 1,
      RC_IM: 1,
      RC_RP: 1,
      RS_AN: 1,
      RS_CO: 1,
      RS_IM: 1,
      RS_MI: 1,
      RS_RP: 1,
    },
    cis_v8_implementation_level_igs: {
      ICEA: 1,
      ICSA: 1,
      DP: 1,
      SCEAS: 0,
      AM: 0,
      ACM: 0,
      CVM: 0,
      ALM: 0,
      EWBP: 0,
      MD: 0,
      DR: 0,
      NIM: 0,
      NMD: 0,
      SAST: 0,
      SPM: 0,
      ASS: 0,
      IRM: 0,
      PT: 0,
    },
    cis_v8_safeguards: {
      ICEA: {
        'ICEA-1': 1.0,
        'ICEA-2': 1.0,
        'ICEA-3': 1.0,
        'ICEA-4': -1.0,
        'ICEA-5': -1.0,
      },
      ICSA: {
        'ICSA-1': -1.0,
        'ICSA-2': -1.0,
        'ICSA-3': -1.0,
        'ICSA-4': -1.0,
        'ICSA-5': -1.0,
        'ICSA-6': -1.0,
        'ICSA-7': -1.0,
      },
      DP: {
        'DP-1': -1.0,
        'DP-2': -1.0,
        'DP-3': -1.0,
        'DP-4': -1.0,
        'DP-5': -1.0,
        'DP-6': -1.0,
        'DP-7': -1.0,
        'DP-8': -1.0,
        'DP-9': -1.0,
        'DP-10': -1.0,
        'DP-11': -1.0,
        'DP-12': -1.0,
        'DP-13': -1.0,
        'DP-14': -1.0,
      },
      SCEAS: {
        'SCEAS-1': -1.0,
        'SCEAS-2': -1.0,
        'SCEAS-3': -1.0,
        'SCEAS-4': -1.0,
        'SCEAS-5': -1.0,
        'SCEAS-6': -1.0,
        'SCEAS-7': -1.0,
        'SCEAS-8': -1.0,
        'SCEAS-9': -1.0,
        'SCEAS-10': -1.0,
        'SCEAS-11': -1.0,
        'SCEAS-12': -1.0,
      },
      AM: {
        'AM-1': -1.0,
        'AM-2': -1.0,
        'AM-3': -1.0,
        'AM-4': -1.0,
        'AM-5': -1.0,
        'AM-6': -1.0,
      },
      ACM: {
        'ACM-1': -1.0,
        'ACM-2': -1.0,
        'ACM-3': -1.0,
        'ACM-4': -1.0,
        'ACM-5': -1.0,
        'ACM-6': -1.0,
        'ACM-7': -1.0,
        'ACM-8': -1.0,
      },
      CVM: {
        'CVM-1': -1.0,
        'CVM-2': -1.0,
        'CVM-3': -1.0,
        'CVM-4': -1.0,
        'CVM-5': -1.0,
        'CVM-6': -1.0,
        'CVM-7': -1.0,
      },
      ALM: {
        'ALM-1': -1.0,
        'ALM-2': -1.0,
        'ALM-3': -1.0,
        'ALM-4': -1.0,
        'ALM-5': -1.0,
        'ALM-6': -1.0,
        'ALM-7': -1.0,
        'ALM-8': -1.0,
        'ALM-9': -1.0,
        'ALM-10': -1.0,
        'ALM-11': -1.0,
        'ALM-12': -1.0,
      },
      EWBP: {
        'EWBP-1': -1.0,
        'EWBP-2': -1.0,
        'EWBP-3': -1.0,
        'EWBP-4': -1.0,
        'EWBP-5': -1.0,
        'EWBP-6': -1.0,
        'EWBP-7': -1.0,
      },
      MD: {
        'MD-1': -1.0,
        'MD-2': -1.0,
        'MD-3': -1.0,
        'MD-4': -1.0,
        'MD-5': -1.0,
        'MD-6': -1.0,
        'MD-7': -1.0,
      },
      DR: {
        'DR-1': -1.0,
        'DR-2': -1.0,
        'DR-3': -1.0,
        'DR-4': -1.0,
        'DR-5': -1.0,
      },
      NIM: {
        'NIM-1': -1.0,
        'NIM-2': -1.0,
        'NIM-3': -1.0,
        'NIM-4': -1.0,
        'NIM-5': -1.0,
        'NIM-6': -1.0,
        'NIM-7': -1.0,
        'NIM-8': -1.0,
      },
      NMD: {
        'NMD-1': -1.0,
        'NMD-2': -1.0,
        'NMD-3': -1.0,
        'NMD-4': -1.0,
        'NMD-5': -1.0,
        'NMD-6': -1.0,
        'NMD-7': -1.0,
        'NMD-8': -1.0,
        'NMD-9': -1.0,
        'NMD-10': -1.0,
        'NMD-11': -1.0,
      },
      SAST: {
        'SAST-1': -1.0,
        'SAST-2': -1.0,
        'SAST-3': -1.0,
        'SAST-4': -1.0,
        'SAST-5': -1.0,
        'SAST-6': -1.0,
        'SAST-7': -1.0,
        'SAST-8': -1.0,
        'SAST-9': -1.0,
      },
      SPM: {
        'SPM-1': -1.0,
        'SPM-2': -1.0,
        'SPM-3': -1.0,
        'SPM-4': -1.0,
        'SPM-5': -1.0,
        'SPM-6': -1.0,
        'SPM-7': -1.0,
      },
      ASS: {
        'ASS-1': -1.0,
        'ASS-2': -1.0,
        'ASS-3': -1.0,
        'ASS-4': -1.0,
        'ASS-5': -1.0,
        'ASS-6': -1.0,
        'ASS-7': -1.0,
        'ASS-8': -1.0,
        'ASS-9': -1.0,
        'ASS-10': -1.0,
        'ASS-11': -1.0,
        'ASS-12': -1.0,
        'ASS-13': -1.0,
        'ASS-14': -1.0,
      },
      IRM: {
        'IRM-1': -1.0,
        'IRM-2': -1.0,
        'IRM-3': -1.0,
        'IRM-4': -1.0,
        'IRM-5': -1.0,
        'IRM-6': -1.0,
        'IRM-7': -1.0,
        'IRM-8': -1.0,
        'IRM-9': -1.0,
      },
      PT: {
        'PT-1': -1.0,
        'PT-2': -1.0,
        'PT-3': -1.0,
        'PT-4': -1.0,
        'PT-5': -1.0,
      },
    },
    cis_v7_safeguards: {
      ICSA: {
        'ICSA-0': 1.0,
        'ICSA-1': 1.0,
        'ICSA-2': 1.0,
        'ICSA-3': 1.0,
        'ICSA-4': 1.0,
        'ICSA-5': 1.0,
        'ICSA-6': -1.0,
        'ICSA-7': -1.0,
        'ICSA-8': -1.0,
        'ICSA-9': -1.0,
      },
      ICHA: {
        'ICHA-0': -1.0,
        'ICHA-1': -1.0,
        'ICHA-2': -1.0,
        'ICHA-3': -1.0,
        'ICHA-4': -1.0,
        'ICHA-5': -1.0,
        'ICHA-6': -1.0,
        'ICHA-7': -1.0,
      },
      CVM: {
        'CVM-0': -1.0,
        'CVM-1': -1.0,
        'CVM-2': -1.0,
        'CVM-3': -1.0,
        'CVM-4': -1.0,
        'CVM-5': -1.0,
        'CVM-6': -1.0,
      },
      CUAP: {
        'CUAP-0': -1.0,
        'CUAP-1': -1.0,
        'CUAP-2': -1.0,
        'CUAP-3': -1.0,
        'CUAP-4': -1.0,
        'CUAP-5': -1.0,
        'CUAP-6': -1.0,
        'CUAP-7': -1.0,
        'CUAP-8': -1.0,
      },
      SCHS: {
        'SCHS-0': -1.0,
        'SCHS-1': -1.0,
        'SCHS-2': -1.0,
        'SCHS-3': -1.0,
        'SCHS-4': -1.0,
      },
      MMAAL: {
        'MMAAL-0': -1.0,
        'MMAAL-1': -1.0,
        'MMAAL-2': -1.0,
        'MMAAL-3': -1.0,
        'MMAAL-4': -1.0,
        'MMAAL-5': -1.0,
        'MMAAL-6': -1.0,
        'MMAAL-7': -1.0,
      },
      EWBP: {
        'EWBP-0': -1.0,
        'EWBP-1': -1.0,
        'EWBP-2': -1.0,
        'EWBP-3': -1.0,
        'EWBP-4': -1.0,
        'EWBP-5': -1.0,
        'EWBP-6': -1.0,
        'EWBP-7': -1.0,
        'EWBP-8': -1.0,
        'EWBP-9': -1.0,
      },
      MD: {
        'MD-0': -1.0,
        'MD-1': -1.0,
        'MD-2': -1.0,
        'MD-3': -1.0,
        'MD-4': -1.0,
        'MD-5': -1.0,
        'MD-6': -1.0,
        'MD-7': -1.0,
      },
      LCNPPS: {
        'LCNPPS-0': -1.0,
        'LCNPPS-1': -1.0,
        'LCNPPS-2': -1.0,
        'LCNPPS-3': -1.0,
        'LCNPPS-4': -1.0,
      },
      DRC: {
        'DRC-0': -1.0,
        'DRC-1': -1.0,
        'DRC-2': -1.0,
        'DRC-3': -1.0,
        'DRC-4': -1.0,
      },
      SCND: {
        'SCND-0': -1.0,
        'SCND-1': -1.0,
        'SCND-2': -1.0,
        'SCND-3': -1.0,
        'SCND-4': -1.0,
        'SCND-5': -1.0,
        'SCND-6': -1.0,
      },
      BD: {
        'BD-0': -1.0,
        'BD-1': -1.0,
        'BD-2': -1.0,
        'BD-3': -1.0,
        'BD-4': -1.0,
        'BD-5': -1.0,
        'BD-6': -1.0,
        'BD-7': -1.0,
        'BD-8': -1.0,
        'BD-9': -1.0,
        'BD-10': -1.0,
        'BD-11': -1.0,
      },
      DP: {
        'DP-0': -1.0,
        'DP-1': -1.0,
        'DP-2': -1.0,
        'DP-3': -1.0,
        'DP-4': -1.0,
        'DP-5': -1.0,
        'DP-6': -1.0,
        'DP-7': -1.0,
        'DP-8': -1.0,
      },
      CAB: {
        'CAB-0': -1.0,
        'CAB-1': -1.0,
        'CAB-2': -1.0,
        'CAB-3': -1.0,
        'CAB-4': -1.0,
        'CAB-5': -1.0,
        'CAB-6': -1.0,
        'CAB-7': -1.0,
        'CAB-8': -1.0,
      },
      WAC: {
        'WAC-0': -1.0,
        'WAC-1': -1.0,
        'WAC-2': -1.0,
        'WAC-3': -1.0,
        'WAC-4': -1.0,
        'WAC-5': -1.0,
        'WAC-6': -1.0,
        'WAC-7': -1.0,
        'WAC-8': -1.0,
        'WAC-9': -1.0,
      },
      AMC: {
        'AMC-0': -1.0,
        'AMC-1': -1.0,
        'AMC-2': -1.0,
        'AMC-3': -1.0,
        'AMC-4': -1.0,
        'AMC-5': -1.0,
        'AMC-6': -1.0,
        'AMC-7': -1.0,
        'AMC-8': -1.0,
        'AMC-9': -1.0,
        'AMC-10': -1.0,
        'AMC-11': -1.0,
        'AMC-12': -1.0,
      },
      ISA: {
        'ISA-0': -1.0,
        'ISA-1': -1.0,
        'ISA-2': -1.0,
        'ISA-3': -1.0,
        'ISA-4': -1.0,
        'ISA-5': -1.0,
        'ISA-6': -1.0,
        'ISA-7': -1.0,
        'ISA-8': -1.0,
      },
      ASS: {
        'ASS-0': -1.0,
        'ASS-1': -1.0,
        'ASS-2': -1.0,
        'ASS-3': -1.0,
        'ASS-4': -1.0,
        'ASS-5': -1.0,
        'ASS-6': -1.0,
        'ASS-7': -1.0,
        'ASS-8': -1.0,
        'ASS-9': -1.0,
        'ASS-10': -1.0,
      },
      IRM: {
        'IRM-0': -1.0,
        'IRM-1': -1.0,
        'IRM-2': -1.0,
        'IRM-3': -1.0,
        'IRM-4': -1.0,
        'IRM-5': -1.0,
        'IRM-6': -1.0,
        'IRM-7': -1.0,
      },
      PTRT: {
        'PTRT-0': -1.0,
        'PTRT-1': -1.0,
        'PTRT-2': -1.0,
        'PTRT-3': -1.0,
        'PTRT-4': -1.0,
        'PTRT-5': -1.0,
        'PTRT-6': -1.0,
        'PTRT-7': -1.0,
      },
    },
    iso27001_implementation_level: {
      Organizational: {
        'Organizational-1': 0.0,
        'Organizational-2': 0.0,
        'Organizational-3': 0.0,
        'Organizational-4': 0.0,
        'Organizational-5': 0.0,
        'Organizational-6': 0.0,
        'Organizational-7': 0.0,
        'Organizational-8': 0.0,
        'Organizational-9': 0.0,
        'Organizational-10': 0.0,
        'Organizational-11': 0.0,
        'Organizational-12': 0.0,
        'Organizational-13': 0.0,
        'Organizational-14': 0.0,
        'Organizational-15': 0.0,
        'Organizational-16': 0.0,
        'Organizational-17': 0.0,
        'Organizational-18': 0.0,
        'Organizational-19': 0.0,
        'Organizational-20': 0.0,
        'Organizational-21': 0.0,
        'Organizational-22': 0.0,
        'Organizational-23': 0.0,
        'Organizational-24': 0.0,
        'Organizational-25': 0.0,
        'Organizational-26': 0.0,
        'Organizational-27': 0.0,
        'Organizational-28': 0.0,
        'Organizational-29': 0.0,
        'Organizational-30': 0.0,
        'Organizational-31': 0.0,
        'Organizational-32': 0.0,
        'Organizational-33': 0.0,
        'Organizational-34': 0.0,
        'Organizational-35': 0.0,
        'Organizational-36': 0.0,
        'Organizational-37': 0.0,
      },
      People: {
        'People-1': 0.0,
        'People-2': 0.0,
        'People-3': 0.0,
        'People-4': 0.0,
        'People-5': 0.0,
        'People-6': 0.0,
        'People-7': 0.0,
        'People-8': 0.0,
      },
      Physical: {
        'Physical-1': 0.0,
        'Physical-2': 0.0,
        'Physical-3': 0.0,
        'Physical-4': 0.0,
        'Physical-5': 0.0,
        'Physical-6': 0.0,
        'Physical-7': 0.0,
        'Physical-8': 0.0,
        'Physical-9': 0.0,
        'Physical-10': 0.0,
        'Physical-11': 0.0,
        'Physical-12': 0.0,
        'Physical-13': 0.0,
        'Physical-14': 0.0,
      },
      Technological: {
        'Technological-1': 0.0,
        'Technological-2': 0.0,
        'Technological-3': 0.0,
        'Technological-4': 0.0,
        'Technological-5': 0.0,
        'Technological-6': 0.0,
        'Technological-7': 0.0,
        'Technological-8': 0.0,
        'Technological-9': 0.0,
        'Technological-10': 0.0,
        'Technological-11': 0.0,
        'Technological-12': 0.0,
        'Technological-13': 0.0,
        'Technological-14': 0.0,
        'Technological-15': 0.0,
        'Technological-16': 0.0,
        'Technological-17': 0.0,
        'Technological-18': 0.0,
        'Technological-19': 0.0,
        'Technological-20': 0.0,
        'Technological-21': 0.0,
        'Technological-22': 0.0,
        'Technological-23': 0.0,
        'Technological-24': 0.0,
        'Technological-25': 0.0,
        'Technological-26': 0.0,
        'Technological-27': 0.0,
        'Technological-28': 0.0,
        'Technological-29': 0.0,
        'Technological-30': 0.0,
        'Technological-31': 0.0,
        'Technological-32': 0.0,
        'Technological-33': 0.0,
        'Technological-34': 0.0,
      },
    },
    relevant_cis_controls: ['CVM', 'CUAP', 'SCHS'],
    relevant_cis_v8_controls: ['ICEA', 'ICSA', 'DP'],
    relevant_nist_controls: [
      'DE_AE',
      'DE_CM',
      'DE_DP',
      'ID_AM',
      'ID_BE',
      'ID_GV',
    ],
    relevant_iso27001_controls: [],
    relevant_cis_v8_safeguards: ['ICEA-1', 'ICEA-2', 'ICEA-3'],
    relevant_cis_v7_safeguards: [
      'ICSA-0',
      'ICSA-1',
      'ICSA-2',
      'ICSA-4',
      'ICSA-3',
      'ICSA-5',
    ],
    tisax_implementation_level: {
      '1.1.1': 1,
      '1.2.1': 1,
      '1.2.2': 0,
      '1.2.3': 1,
      '1.2.4': 0,
      '1.3.1': 1,
      '1.3.2': 1,
      '1.3.3': 0,
      '1.3.4': 1,
      '1.4.1': 1,
      '1.5.1': 0,
      '1.5.2': 1,
      '2.1.1': 1,
      '2.1.2': 0,
      '2.1.3': 1,
      '2.1.4': 1,
      '2.1.5': 0,
      '2.1.6': 1,
      '2.1.7': 1,
      '2.1.8': 0,
      '3.1.1': 1,
      '3.1.2': 1,
      '3.1.3': 0,
      '3.1.4': 1,
      '3.1.5': 1,
      '3.1.6': 0,
      '3.1.7': 1,
      '3.2.1': 1,
      '3.2.2': 0,
      '3.2.3': 1,
      '3.2.4': 1,
      '3.2.5': 0,
      '3.2.6': 1,
      '3.2.7': 1,
      '4.1.1': 0,
      '4.1.2': 1,
      '4.1.3': 1,
      '4.1.4': 0,
      '4.1.5': 1,
      '4.2.1': 1,
      '4.2.2': 0,
      '4.2.3': 1,
      '4.2.4': 1,
      '4.2.5': 0,
      '4.2.6': 1,
      '4.2.7': 1,
      '4.3.1': 0,
      '4.3.2': 1,
      '4.4.1': 1,
      '4.4.2': 0,
      '4.4.3': 1,
      '4.5.1': 1,
      '4.5.2': 0,
      '5.1.1': 1,
      '5.1.2': 1,
      '5.1.3': 0,
      '5.1.4': 1,
      '5.2.1': 1,
      '6.1.1': 0,
      '6.1.2': 1,
      '6.1.3': 1,
      '6.1.4': 0,
      '6.1.5': 1,
      '6.1.6': 1,
      '6.2.1': 0,
      '6.2.2': 1,
      '6.2.3': 1,
      '6.2.4': 0,
      '7.1.1': 1,
      '7.1.2': 1,
      '7.1.3': 0,
      '7.1.4': 1,
      '7.1.5': 1,
      '7.2.1': 0,
      '7.2.2': 1,
      '8.1.1': 1,
      '8.1.2': 0,
      '8.1.3': 1,
      '8.1.4': 1,
      '8.1.5': 0,
      '8.1.6': 1,
      '8.1.7': 1,
      '8.2.1': 0,
      '9.6.1': 1,
      '9.6.2': 1,
      '9.7.1': 0,
      '9.7.2': 1,
      '9.8.1': 1,
    },
    relevant_tisax_controls: [
      '1.1.1', '1.2.1', '1.3.1', '1.3.2', '1.4.1',
      '8.1.1', '8.1.3', '9.8.1'
    ],
    nist_v2_safeguard_implementation: {
      'DE_AE': {
        'DE_AE-02': 0,
        'DE_AE-03': 0,
        'DE_AE-04': 0,
        'DE_AE-06': 0,
        'DE_AE-07': 0,
        'DE_AE-08': 0,
      },
      'DE_CM': {
        'DE_CM-01': 0,
        'DE_CM-02': 0,
        'DE_CM-03': 0,
        'DE_CM-06': 0,
        'DE_CM-09': 0,
      },
      'GV_OC': {
        'GV_OC-01': 0,
        'GV_OC-02': 0,
        'GV_OC-03': 0,
        'GV_OC-04': 0,
        'GV_OC-05': 0,
      },
      'GV_OV': {
        'GV_OV-01': 0,
        'GV_OV-02': 0,
        'GV_OV-03': 0,
      },
      'GV_PO': {
        'GV_PO-01': 0,
        'GV_PO-02': 0,
      },
      'GV_RM': {
        'GV_RM-01': 0,
        'GV_RM-02': 0,
        'GV_RM-03': 0,
        'GV_RM-04': 0,
        'GV_RM-05': 0,
        'GV_RM-06': 0,
        'GV_RM-07': 0,
      },
      'GV_RR': {
        'GV_RR-01': 0,
        'GV_RR-02': 0,
        'GV_RR-03': 0,
        'GV_RR-04': 0,
      },
      'GV_SC': {
        'GV_SC-01': 0,
        'GV_SC-02': 0,
        'GV_SC-03': 0,
        'GV_SC-04': 0,
        'GV_SC-05': 0,
        'GV_SC-06': 0,
        'GV_SC-07': 0,
        'GV_SC-08': 0,
        'GV_SC-09': 0,
        'GV_SC-10': 0,
      },
      'ID_AM': {
        'ID_AM-01': 0,
        'ID_AM-02': 0,
        'ID_AM-03': 0,
        'ID_AM-04': 0,
        'ID_AM-05': 0,
        'ID_AM-07': 0,
        'ID_AM-08': 0,
      },
      'ID_IM': {
        'ID_IM-01': 0,
        'ID_IM-02': 0,
        'ID_IM-03': 0,
        'ID_IM-04': 0,
      },
      'ID_RA': {
        'ID_RA-01': 0,
        'ID_RA-02': 0,
        'ID_RA-03': 0,
        'ID_RA-04': 0,
        'ID_RA-05': 0,
        'ID_RA-06': 0,
        'ID_RA-07': 0,
        'ID_RA-08': 0,
        'ID_RA-09': 0,
        'ID_RA-10': 0,
      },
      'PR_AA': {
        'PR_AA-01': 0,
        'PR_AA-02': 0,
        'PR_AA-03': 0,
        'PR_AA-04': 0,
        'PR_AA-05': 0,
        'PR_AA-06': 0,
      },
      'PR_AT': {
        'PR_AT-01': 0,
        'PR_AT-02': 0,
      },
      'PR_DS': {
        'PR_DS-01': 0,
        'PR_DS-02': 0,
        'PR_DS-10': 0,
        'PR_DS-11': 0,
      },
      'PR_IR': {
        'PR_IR-01': 0,
        'PR_IR-02': 0,
        'PR_IR-03': 0,
        'PR_IR-04': 0,
      },
      'PR_PS': {
        'PR_PS-01': 0,
        'PR_PS-02': 0,
        'PR_PS-03': 0,
        'PR_PS-04': 0,
        'PR_PS-05': 0,
        'PR_PS-06': 0,
      },
      'RC_CO': {
        'RC_CO-03': 0,
        'RC_CO-04': 0,
      },
      'RC_RP': {
        'RC_RP-01': 0,
        'RC_RP-02': 0,
        'RC_RP-03': 0,
        'RC_RP-04': 0,
        'RC_RP-05': 0,
        'RC_RP-06': 0,
      },
      'RS_AN': {
        'RS_AN-03': 0,
        'RS_AN-06': 0,
        'RS_AN-07': 0,
        'RS_AN-08': 0,
      },
      'RS_CO': {
        'RS_CO-02': 0,
        'RS_CO-03': 0,
      },
      'RS_MA': {
        'RS_MA-01': 0,
        'RS_MA-02': 0,
        'RS_MA-03': 0,
        'RS_MA-04': 0,
        'RS_MA-05': 0,
      },
      'RS_MI': {
        'RS_MI-01': 0,
        'RS_MI-02': 0,
      },
    },
    relevant_nist_v2_controls: [],
  },
  custom_fields: buildAllCustomFields(),
  ...overrides,
});

export const buildRiskRegisterResponse = (
  overrides: Partial<RiskRegisterResponse> = {},
  scenarioDataOverrides: Partial<ScenarioData> = {},
): RiskRegisterResponse => {
  const timestamp = new Date().toISOString();
  const scenarioData = buildScenarioData({
    ...scenarioDataOverrides,
  });
  return {
    id: chance.guid(),
    scenario_id: chance.guid(),
    version: chance.integer({ min: 1, max: 10 }),
    tenant_id: chance.guid(),
    customer_scenario_id: chance.guid(),
    name: chance.sentence({ words: 3 }),
    description: chance.paragraph(),
    scenario_type: scenarioTypes.MANUAL,
    scenario_data: scenarioData,
    notes: buildNotesOutputs(),
    created_at: timestamp,
    updated_at: timestamp,
    status: chance.pickone(Object.values(scenarioStatus)),
    ...overrides,
  };
};

export const buildCRQData = (
  overrides: Partial<CRQData> = {},
  includeResults = true,
): CRQData => {
  const { id: id1 } = buildAgData();
  const { id: id2 } = buildAgData();
  const { id: id3 } = buildAgData(true);

  const baseData: CRQData = {
    company_id: chance.guid(),
    fq_id: chance.guid(),
    filters: {
      asset_groups_filter: ['test_asset'],
      initial_vector_filter: chance.pickset(
        initialAttackVectorsAsStringArray,
        4,
      ),
      event_type_filter: chance.pickset(Object.values(ClickableEventType), 2),
      impact_type_filter: ['confidentiality', 'integrity', 'availability'],
      duration_percentiles_filter_min_value: 0,
      duration_percentiles_filter_max_value: 100,
      affected_records_percentiles_filter_min_val: 0,
      affected_records_percentiles_filter_max_val: 100,
      min_damage_filter: 1000,
      max_damage_filter: 1000000,
      min_number_of_records_filter: 0,
      max_number_of_records_filter: 1000,
      min_duration_filter: 0,
      max_duration_filter: 3000,
    },
    is_crq_up_to_date: Math.random() < 0.5,
    results: includeResults
      ? {
        example_events: {
          median: {
            event_loss: chance.integer({ min: 10000, max: 100000 }),
            event_type: 'test_event',
            hazard_category: 'test_hazard',
            event_duration: chance.integer({ min: 1, max: 30 }),
            num_of_data_records_compromised: chance.integer({
              min: 100,
              max: 1000,
            }),
            event_description: chance.sentence(),
          },
          maximum: {
            event_loss: chance.integer({ min: 10000, max: 100000 }),
            event_type: 'test_event',
            hazard_category: 'test_hazard',
            event_duration: chance.integer({ min: 1, max: 30 }),
            num_of_data_records_compromised: chance.integer({
              min: 100,
              max: 1000,
            }),
            event_description: chance.sentence(),
          },
        },
        lean_simulation_exposure: buildLeanSimulationExposure({
          filtered_num_events: 100,
          scenario_cv: 0.5,
          match_count: chance.floating({ min: 0, max: 1 }),
          diversity_score: chance.floating({ min: 0, max: 1 }),
          total_possible_combinations: 100,
          unique_scenario_combinations: 100,
        }),
        control_scenarios: buildControlScenarios([id1, id2, id3], 'cis_v8'),
        cost_components_breakdown: buildCostComponentsBreakdown(),
      }
      : undefined,
  };

  return {
    ...baseData,
    ...overrides,
  };
};

export const buildCRQRiskRegisterResponse = (
  overrides: Partial<RiskRegisterResponse> = {},
  resultState: 'complete' | 'partial' | 'none' = 'complete',
  crqDataOverrides: Partial<CRQData> = {},
): RiskRegisterResponse => {
  const baseResponse = buildRiskRegisterResponse();
  const scenarioData = buildScenarioData({
    peer_base_rate: undefined,
    average_loss: undefined,
    impact_distribution: undefined,
    crq_data: buildCRQData(crqDataOverrides, resultState === 'complete'),
  });

  return {
    ...baseResponse,
    scenario_type: scenarioTypes.CRQ,
    scenario_data: scenarioData,
    scenario_id: 'crq-scenario-id',
    customer_scenario_id: `crq-scenario-customer-id-${chance.integer({ min: 1, max: 1000 })}`,
    ...overrides,
  };
};

// Helper function to build responses with different states of CRQ data
export const buildCRQRiskRegisterResponseVariants = () => ({
  complete: buildCRQRiskRegisterResponse(),
  noResults: buildCRQRiskRegisterResponse({}, 'none'),
  partialResults: buildCRQRiskRegisterResponse({
    scenario_data: {
      ...buildScenarioData({
        peer_base_rate: undefined,
        average_loss: undefined,
        average_loss_currency: undefined,
        impact_distribution: undefined,
      }),
      crq_data: buildCRQData({
        results: {
          example_events: undefined,
          lean_simulation_exposure: undefined,
        },
      }),
    },
  }),
});

export const buildMixedRiskRegisterList = (
  count = 10,
): RiskRegisterResponse[] => {
  const variants = buildCRQRiskRegisterResponseVariants();
  const responseTypes = [
    variants.complete,
    variants.partialResults,
    buildRiskRegisterResponse(),
  ];

  return Array.from({ length: count }, (_, index) => responseTypes[index % 3]);
};

export const buildRiskRegisterResponses = (
  count = 3,
  overrides: Partial<RiskRegisterResponse> = {},
): RiskRegisterResponse[] => {
  return Array.from({ length: count }, () =>
    buildRiskRegisterResponse(overrides),
  );
};

export const buildScenarioCreateInput = (
  overrides: Partial<ScenarioCreateRequest> = {},
): ScenarioCreateRequest => {
  return {
    customer_scenario_id: chance.guid(),
    name: chance.sentence({ words: 3 }),
    description: chance.paragraph(),
    likelihood: chance.pickone(
      Object.keys(riskRegisterLikelihoods),
    ) as RiskRegisterLikelihood,
    impact: chance.pickone(
      Object.keys(riskRegisterImpacts),
    ) as RiskRegisterImpact,
    annual_likelihood: chance.floating({ min: 0, max: 1 }),
    peer_base_rate: chance.floating({ min: 0, max: 1 }),
    average_loss: chance.integer({ min: 1000, max: 1000000 }),
    average_loss_currency: 'USD',
    impact_distribution: {
      ninety_nine: chance.integer({ min: 800000, max: 1000000 }),
      seventy_five: chance.integer({ min: 600000, max: 800000 }),
      fifty: chance.integer({ min: 400000, max: 600000 }),
      twenty_five: chance.integer({ min: 200000, max: 400000 }),
      one: chance.integer({ min: 0, max: 200000 }),
    },
    ...overrides,
  };
};

export const buildScenarioUpdateInput = (
  overrides: Partial<SimpleScenarioUpdateRequest> = {},
): SimpleScenarioUpdateRequest => {
  return {
    scenario_type: scenarioTypes.MANUAL,
    risk_priority: chance.pickone(
      Object.keys(riskRegisterPriorities),
    ) as RiskRegisterPriority,
    response_plan: chance.pickone(
      Object.keys(riskRegisterResponsePlans),
    ) as RiskRegisterResponsePlan,
    risk_owner: chance.name(),
    ticket: chance.guid(),
    methodology_insights: chance.paragraph(),
    ...buildScenarioCreateInput(),
    ...overrides,
  };
};

export const buildDocumentOutput = (
  overrides: Partial<DocumentOutput> = {},
): DocumentOutput => {
  return {
    id: chance.guid(),
    filename: chance.word() + '.' + chance.pickone(['pdf', 'doc', 'txt']),
    ...overrides,
  };
};

export const buildNoteOutput = (
  overrides: Partial<NoteOutput> = {},
): NoteOutput => {
  const timestamp = new Date().toISOString();
  const firstName = chance.first();
  const lastName = chance.last();
  const email = chance.email();

  return {
    id: chance.guid(),
    content: chance.paragraph(),
    user: {
      documentId: chance.guid(),
      email: email,
      firstname: firstName,
      id: chance.integer({ min: 1, max: 1000 }),
      lastname: lastName,
    },
    created_at: timestamp,
    updated_at: timestamp,
    documents: Array.from({ length: chance.integer({ min: 0, max: 3 }) }, () =>
      buildDocumentOutput(),
    ),
    ...overrides,
  };
};

export const buildNotesOutputs = (
  count = 5,
  overrides: Partial<NoteOutput> = {},
): NoteOutput[] => {
  return Array.from({ length: count }, () => buildNoteOutput(overrides));
};

export const buildNoteItemProps = (overrides = {}) => {
  const note = buildNoteOutput();
  const userEmail = typeof note.user === 'string' ? note.user : note.user.email;
  const userDisplayName = typeof note.user === 'string'
    ? note.user
    : note.user.firstname && note.user.lastname
    ? `${note.user.firstname} ${note.user.lastname}`
    : note.user.email;
  return {
    noteId: note.id,
    avatar: userDisplayName,
    email: userEmail,
    date: note.created_at,
    content: note.content,
    attachment: note.documents[0]
      ? {
        id: note.documents[0].id,
        name: note.documents[0].filename,
      }
      : undefined,
    ...overrides,
  };
};

export const buildRiskOwner = (): RiskOwner => {
  return {
    id: chance.guid(),
    email: chance.email(),
    active_tenant: chance.guid(),
    tenant_ids: [],
  };
};

export const buildRiskOwners = (count = 3): RiskOwner[] => {
  return Array.from({ length: count }, () => buildRiskOwner());
};

// return list of all available fields
export const buildAllCustomFields = (): CustomField[] => {
  return Object.values(customFieldTypes).map((type) =>
    buildCustomField({ field_type: type }),
  );
};

export const buildCustomField = (
  overrides: Partial<CustomField> = {},
): CustomField => {
  //  I want to build the right attribtes and values for the field type
  const fieldType =
    overrides.field_type ||
    (chance.pickone(Object.keys(customFieldTypes)) as CustomFieldType);
  const attributes = buildCustomFieldAttributes(fieldType);
  const value = buildCustomFieldValue(fieldType);
  return {
    id: chance.guid(),
    field_name: chance.word(),
    field_type: chance.pickone(
      Object.keys(customFieldTypes),
    ) as CustomFieldType,
    attributes,
    value,
    ...overrides,
  };
};

const buildCustomFieldAttributes = (
  fieldType: CustomFieldType,
): Record<string, any> => {
  switch (fieldType) {
    case customFieldTypes.CURRENCY:
      return {
        currency: chance.pickone(CURRENCY_CODES),
      };
    default:
      return {};
  }
};

const buildCustomFieldValue = (fieldType: CustomFieldType): any => {
  switch (fieldType) {
    case customFieldTypes.CURRENCY:
      return chance.integer({ min: 1, max: 1000000 });
    case customFieldTypes.NUMBER:
      return chance.integer({ min: 1, max: 10000 });
    case customFieldTypes.DATE:
      return chance.date();
    case customFieldTypes.TAGS:
      return chance.pickset(Object.keys(CURRENCY_CODES), 2);
    default:
      return chance.word();
  }
};

export const buildMetricsHistory = (
  overrides: Partial<ScenarioMetricsHistory> = {},
): ScenarioMetricsHistory => {
  return {
    scenario_id: chance.guid(),
    metrics_history: Array.from({ length: 5 }, () => ({
      fq_id: chance.guid(),
      version: chance.integer({ min: 1, max: 10 }),
      currency: chance.pickone(CURRENCY_CODES),
      annual_likelihood: chance.floating({ min: 0, max: 1 }),
      average_loss: chance.integer({ min: 1000, max: 1000000 }),
      targeted_benchmark_annual_rate: chance.floating({ min: 0, max: 1 }),
      timestamp: chance.date().toISOString(),
    })),
    ...overrides,
  };
};
