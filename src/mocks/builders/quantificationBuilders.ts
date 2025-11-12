// @ts-nocheck
// @ts-nocheck
import { ISO27001ControlNumbers } from '@/security/ISO/formInitialValues';
import { MOCK_TECH_SERVICE } from 'mocks/data/hazardMock';
import { MODELED_DAMAGE_TYPES } from 'options/constants';
import type { ResultsInsights } from 'types/insights';
import {
  type ByMSBundleScenario,
  type ByMSBundleToMinimal,
  MSProductBundles,
} from 'types/msBundles';
import {
  type ByMSProduct,
  type ByMSProductScenario,
  MSProducts,
} from 'types/msProducts';
import {
  type InitialAttackVector,
  initialAttackVectorsAsStringArray,
} from 'types/riskDrivers/attackVectors';
import {
  BasicEventType,
  type EventTypes,
  ServiceProviderEventType,
} from 'types/riskDrivers/eventTypes';
import {
  ASBCategories,
  type ByControlDomainScenarios,
  type ByRiskScenario,
  cisControlIds,
  cisV8Ids,
  ControlDomainScenarios,
  type ControlType,
  nistControlIds,
  type RiskScenario,
} from 'types/security-controls';
import { chance, fracionValue } from '../../mocks/builders/buildingUtils';
import {
  type ByCostDetailedExposure,
  type ByCoverageRichSimulationExposure,
  type ByDurationDetailedExposure,
  type ByEventTypeDetailedExposure,
  type ByEventTypeDrillDown,
  type ByInitialVectorDetailedExposure,
  type ByInitialVectorDrillDown,
  type ByRecordDetailedExposure,
  type ByRiskDriverExposure,
  type ByRiskDriverMinimalBreakdown,
  type ByThresholdDetailedExposure,
  type CalibrationHighlights,
  type ControlScenarios,
  type DataRevenueRange,
  DataRevenueRanges,
  type DrillDownLeanSimulationExposure,
  type EpPoint,
  type Exposure,
  type FrequencyHighlights,
  type HazardDistributionValues,
  type Highlights,
  type LeanSimulationExposure,
  type LossEvent,
  type OverallResults,
  type ParamStat,
  type PastQuantification,
  type Quantification,
  type QuantificationData,
  type QuantificationOld,
  QuantificationStatus,
  type RichSimulationExposure,
  type RiskTransfer,
  type SICDivisionLetter,
  SICDivisionLetters,
  type SimulationExposure,
  type TopSimulationStat,
} from '../../types/quantificationData';
import { CIS_RECOMMENDATIONS_MOCK } from '../data/cisMock';
import { buildSphere } from './companyBuilder';
import { buildVendorData } from './fqInputDataBuilders';
import { buildTopSimulationStats } from './simulationStatsBuilder';

const pickDamageType = () => {
  return chance.pickone(MODELED_DAMAGE_TYPES);
};

const controlsNextImplementation: Record<string, Record<string, string>> = {
  nist: {
    '0': '1',
    '1': '2',
    '2': '3',
    '3': '4',
    '4': '5',
    '5': '5',
  },
  cis: {
    unknown: 'ig1',
    ig1: 'ig2',
    ig2: 'ig3',
    ig3: 'ig3',
  },
  cis_v8: {
    unknown: 'ig1',
    ig1: 'ig2',
    ig2: 'ig3',
    ig3: 'ig3',
  },
  iso27001: {
    '-1': '0',
    '0': '0.5',
    '0.5': '1',
    '1': '1',
  },
};

const controlsByType = {
  cis: ['unknown', 'ig1', 'ig2', 'ig3'],
  nist: ['0', '1', '2', '3', '4', '5'],
  iso27001: ['-1', '0', '0.5', '1'],
  cis_v8: ['unknown', 'ig1', 'ig2', 'ig3'],
};

export const buildAGLevelRecommendation = (
  type: 'nist' | 'cis' | 'iso27001' | 'cis_v8' = 'cis',
) => {
  const controlValues = controlsByType[type];
  const aal_damage = chance.natural({ max: 200_000 });
  const currentMinimum = chance.pickone(controlValues);
  const nextMinimum = controlsNextImplementation[type][currentMinimum];
  return {
    [nextMinimum]: {
      aal_damage,
      aal_effect: chance.natural({
        min: aal_damage,
        max: aal_damage + 200_000,
      }),
      current_status: currentMinimum,
      pml_damage: chance.natural(),
      pml_effect: chance.natural(),
      average_damage: chance.natural(),
      average_effect: chance.natural(),
      by_minimal_new_average: chance.floating({ min: 3, max: 5, fixed: 1 }),
    },
  };
};
export const buildAGLevelWhatIfScenario = (
  type: 'nist' | 'cis' | 'iso27001' | 'cis_v8' = 'cis',
) => {
  const controlValues = controlsByType[type];
  const controlIndex = chance.integer({
    min: 0,
    max: controlValues.length - 1,
  });
  const sliceIndex =
    controlIndex === controlValues.length - 1 ? controlIndex : controlIndex + 1;
  const currentMinimum = controlValues[controlIndex];
  const aal_damage = chance.natural({ max: 200_000 });
  return Object.fromEntries(
    controlValues.slice(sliceIndex).map((targetMinimum) => {
      return [
        targetMinimum,
        {
          aal_damage,
          aal_effect: chance.natural({
            min: aal_damage,
            max: aal_damage + 200_000,
          }),
          current_status: currentMinimum,
          pml_damage: chance.natural(),
          pml_effect: chance.natural(),
          average_damage: chance.natural(),
          average_effect: chance.natural(),
          by_minimal_new_average: chance.floating({ min: 3, max: 5, fixed: 1 }),
        },
      ];
    }),
  );
};

const buildScenarioResults = ({
  ...specifics
}: Partial<Exposure> = {}): Exposure => {
  const specificDist = fracionValue();
  const attacksDist = fracionValue();
  return {
    damage_types: chance.pickset(
      [pickDamageType(), pickDamageType(), pickDamageType()],
      chance.integer({ min: 1, max: 3 }),
    ),
    ep_curve: buildEpCurve(),
    events: [buildEvent(), buildEvent(), buildEvent()],
    highlights: buildHighlights(),
    probability: fracionValue(),
    scale_distribution: {
      specific: specificDist,
      systemic: 1 - specificDist,
    },
    scenario_impact: fracionValue(),
    type_distribution: {
      attacks: attacksDist,
      failures: 1 - attacksDist,
    },
    ...specifics,
  };
};

export const buildQuantification = ({
  ...specifics
}: Partial<QuantificationData> = {}): QuantificationData => {
  return {
    company_id: chance.guid(),
    created_at: new Date().toISOString(),
    fq_type: '',
    id: chance.guid(),
    status: chance.pickone(Object.values(QuantificationStatus)),
    updated_at: new Date().toISOString(),
    risk_transfer: buildRiskTransfer(),
    input_data: {
      sphere: buildSphere(),
      vendor_data: buildVendorData(),
      revenue: chance.integer({ min: 1_000_000, max: 100_000_000 }),
    },
    hazard: MOCK_TECH_SERVICE,
    model_version: chance.pickone(['v2022.4.12', 'sha-ae231ed', 'v2023.1.1']),
    ...specifics,
  };
};

export const buildOverallResults = ({
  ...specifics
}: Partial<OverallResults> = {}): OverallResults => {
  return {
    ep_curve: buildEpCurve(),
    highlights: buildHighlights(),
    ...specifics,
  };
};

export const buildAgData = (isLegacy = false) => ({
  id: chance.guid(),
  name: chance.name(),
  type: chance.pickone(
    isLegacy
      ? ['infra', 'endpoints'] // testing old ag types
      : ['infrastructure', 'employee_endpoints', 'cloud'],
  ),
});

export const buildResults = ({
  ...specifics
}: Partial<QuantificationOld> = {}): QuantificationOld => {
  const results = {
    cis_recommendation: CIS_RECOMMENDATIONS_MOCK,
    by_scenario_exposure: {
      bi: buildScenarioResults(),
      contingent_bi: buildScenarioResults(),
      extortion: buildScenarioResults(),
      liability: buildScenarioResults(),
      privacy: buildScenarioResults(),
      regulatory: buildScenarioResults(),
    },
    overall_exposure: buildOverallResults(),
    insights: buildInsightResults(),
    by_event_type_exposure: {
      ransomware: buildEpCurveAndHighlights(),
      data_breach: buildEpCurveAndHighlights(),
      interruption: buildEpCurveAndHighlights(),
      service_provider_interruption: buildEpCurveAndHighlights(),
      service_provider_data_breach: buildEpCurveAndHighlights(),
    },
    third_party_exposure: buildEpCurveAndHighlights(),
    ...specifics,
  };
  return results;
};

const controlsAverage = {
  cis: {
    ICHA: chance.floating({ min: 0, max: 3, fixed: 1 }),
    ICSA: chance.floating({ min: 0, max: 3, fixed: 1 }),
    MD: chance.floating({ min: 0, max: 3, fixed: 1 }),
    DP: chance.floating({ min: 0, max: 3, fixed: 1 }),
    CVM: chance.floating({ min: 0, max: 3, fixed: 1 }),
    CUAP: chance.floating({ min: 0, max: 3, fixed: 1 }),
    SCHS: chance.floating({ min: 0, max: 3, fixed: 1 }),
    MMAAL: chance.floating({ min: 0, max: 3, fixed: 1 }),
    EWBP: chance.floating({ min: 0, max: 3, fixed: 1 }),
    LCNPPS: chance.floating({ min: 0, max: 3, fixed: 1 }),
    DRC: chance.floating({ min: 0, max: 3, fixed: 1 }),
    SCND: chance.floating({ min: 0, max: 3, fixed: 1 }),
    BD: chance.floating({ min: 0, max: 3, fixed: 1 }),
    CAB: chance.floating({ min: 0, max: 3, fixed: 1 }),
    WAC: chance.floating({ min: 0, max: 3, fixed: 1 }),
    AMC: chance.floating({ min: 0, max: 3, fixed: 1 }),
    ISA: chance.floating({ min: 0, max: 3, fixed: 1 }),
    ASS: chance.floating({ min: 0, max: 3, fixed: 1 }),
    IRM: chance.floating({ min: 0, max: 3, fixed: 1 }),
    PTRT: chance.floating({ min: 0, max: 3, fixed: 1 }),
  },
  cis_v8: {
    ICEA: chance.floating({ min: 1, max: 5, fixed: 1 }),
    ICSA: chance.floating({ min: 1, max: 5, fixed: 1 }),
    DP: chance.floating({ min: 1, max: 5, fixed: 1 }),
    SCEAS: chance.floating({ min: 1, max: 5, fixed: 1 }),
    AM: chance.floating({ min: 1, max: 5, fixed: 1 }),
    ACM: chance.floating({ min: 1, max: 5, fixed: 1 }),
    CVM: chance.floating({ min: 1, max: 5, fixed: 1 }),
    ALM: chance.floating({ min: 1, max: 5, fixed: 1 }),
    EWBP: chance.floating({ min: 1, max: 5, fixed: 1 }),
    MD: chance.floating({ min: 1, max: 5, fixed: 1 }),
    DR: chance.floating({ min: 1, max: 5, fixed: 1 }),
    NIM: chance.floating({ min: 1, max: 5, fixed: 1 }),
    NMD: chance.floating({ min: 1, max: 5, fixed: 1 }),
    SAST: chance.floating({ min: 1, max: 5, fixed: 1 }),
    SPM: chance.floating({ min: 1, max: 5, fixed: 1 }),
    ASS: chance.floating({ min: 1, max: 5, fixed: 1 }),
    IRM: chance.floating({ min: 1, max: 5, fixed: 1 }),
    PT: chance.floating({ min: 1, max: 5, fixed: 1 }),
  },
  nist: {
    ID_AM: chance.floating({ min: 1, max: 5, fixed: 1 }),
    ID_BE: chance.floating({ min: 1, max: 5, fixed: 1 }),
    ID_GV: chance.floating({ min: 1, max: 5, fixed: 1 }),
    ID_RA: chance.floating({ min: 1, max: 5, fixed: 1 }),
    ID_RM: chance.floating({ min: 1, max: 5, fixed: 1 }),
    ID_SC: chance.floating({ min: 1, max: 5, fixed: 1 }),
    PR_AC: chance.floating({ min: 1, max: 5, fixed: 1 }),
    PR_AT: chance.floating({ min: 1, max: 5, fixed: 1 }),
    PR_DS: chance.floating({ min: 1, max: 5, fixed: 1 }),
    PR_IP: chance.floating({ min: 1, max: 5, fixed: 1 }),
    PR_MA: chance.floating({ min: 1, max: 5, fixed: 1 }),
    PR_PT: chance.floating({ min: 1, max: 5, fixed: 1 }),
    DE_AE: chance.floating({ min: 1, max: 5, fixed: 1 }),
    DE_CM: chance.floating({ min: 1, max: 5, fixed: 1 }),
    DE_DP: chance.floating({ min: 1, max: 5, fixed: 1 }),
    RS_RP: chance.floating({ min: 1, max: 5, fixed: 1 }),
    RS_CO: chance.floating({ min: 1, max: 5, fixed: 1 }),
    RS_AN: chance.floating({ min: 1, max: 5, fixed: 1 }),
    RS_MI: chance.floating({ min: 1, max: 5, fixed: 1 }),
    RS_IM: chance.floating({ min: 1, max: 5, fixed: 1 }),
    RC_RP: chance.floating({ min: 1, max: 5, fixed: 1 }),
    RC_IM: chance.floating({ min: 1, max: 5, fixed: 1 }),
    RC_CO: chance.floating({ min: 1, max: 5, fixed: 1 }),
  },
  iso27001: {
    '5.1': chance.pickone([-1, 0, 0.5, 1]),
    '5.2': chance.pickone([-1, 0, 0.5, 1]),
    '5.3': chance.pickone([-1, 0, 0.5, 1]),
    '5.4': chance.pickone([-1, 0, 0.5, 1]),
    '5.5': chance.pickone([-1, 0, 0.5, 1]),
    '5.6': chance.pickone([-1, 0, 0.5, 1]),
    '5.7': chance.pickone([-1, 0, 0.5, 1]),
    '5.8': chance.pickone([-1, 0, 0.5, 1]),
    '5.9': chance.pickone([-1, 0, 0.5, 1]),
    '5.10': chance.pickone([-1, 0, 0.5, 1]),
    '5.11': chance.pickone([-1, 0, 0.5, 1]),
    '5.12': chance.pickone([-1, 0, 0.5, 1]),
    '5.13': chance.pickone([-1, 0, 0.5, 1]),
    '5.14': chance.pickone([-1, 0, 0.5, 1]),
    '5.15': chance.pickone([-1, 0, 0.5, 1]),
    '5.16': chance.pickone([-1, 0, 0.5, 1]),
    '5.17': chance.pickone([-1, 0, 0.5, 1]),
    '5.18': chance.pickone([-1, 0, 0.5, 1]),
    '5.19': chance.pickone([-1, 0, 0.5, 1]),
    '5.20': chance.pickone([-1, 0, 0.5, 1]),
    '5.21': chance.pickone([-1, 0, 0.5, 1]),
    '5.22': chance.pickone([-1, 0, 0.5, 1]),
    '5.23': chance.pickone([-1, 0, 0.5, 1]),
    '5.24': chance.pickone([-1, 0, 0.5, 1]),
    '5.25': chance.pickone([-1, 0, 0.5, 1]),
    '5.26': chance.pickone([-1, 0, 0.5, 1]),
    '5.27': chance.pickone([-1, 0, 0.5, 1]),
    '5.28': chance.pickone([-1, 0, 0.5, 1]),
    '5.29': chance.pickone([-1, 0, 0.5, 1]),
    '5.30': chance.pickone([-1, 0, 0.5, 1]),
    '5.31': chance.pickone([-1, 0, 0.5, 1]),
    '5.32': chance.pickone([-1, 0, 0.5, 1]),
    '5.33': chance.pickone([-1, 0, 0.5, 1]),
    '5.34': chance.pickone([-1, 0, 0.5, 1]),
    '5.35': chance.pickone([-1, 0, 0.5, 1]),
    '5.36': chance.pickone([-1, 0, 0.5, 1]),
    '5.37': chance.pickone([-1, 0, 0.5, 1]),

    '6.1': chance.pickone([-1, 0, 0.5, 1]),
    '6.2': chance.pickone([-1, 0, 0.5, 1]),
    '6.3': chance.pickone([-1, 0, 0.5, 1]),
    '6.4': chance.pickone([-1, 0, 0.5, 1]),
    '6.5': chance.pickone([-1, 0, 0.5, 1]),
    '6.6': chance.pickone([-1, 0, 0.5, 1]),
    '6.7': chance.pickone([-1, 0, 0.5, 1]),
    '6.8': chance.pickone([-1, 0, 0.5, 1]),
    '7.1': chance.pickone([-1, 0, 0.5, 1]),
    '7.2': chance.pickone([-1, 0, 0.5, 1]),
    '7.3': chance.pickone([-1, 0, 0.5, 1]),
    '7.4': chance.pickone([-1, 0, 0.5, 1]),
    '7.5': chance.pickone([-1, 0, 0.5, 1]),
    '7.6': chance.pickone([-1, 0, 0.5, 1]),
    '7.7': chance.pickone([-1, 0, 0.5, 1]),
    '7.8': chance.pickone([-1, 0, 0.5, 1]),
    '7.9': chance.pickone([-1, 0, 0.5, 1]),
    '7.10': chance.pickone([-1, 0, 0.5, 1]),
    '7.11': chance.pickone([-1, 0, 0.5, 1]),
    '7.12': chance.pickone([-1, 0, 0.5, 1]),
    '7.13': chance.pickone([-1, 0, 0.5, 1]),
    '7.14': chance.pickone([-1, 0, 0.5, 1]),
    '8.1': chance.pickone([-1, 0, 0.5, 1]),
    '8.2': chance.pickone([-1, 0, 0.5, 1]),
    '8.3': chance.pickone([-1, 0, 0.5, 1]),
    '8.4': chance.pickone([-1, 0, 0.5, 1]),
    '8.5': chance.pickone([-1, 0, 0.5, 1]),
    '8.6': chance.pickone([-1, 0, 0.5, 1]),
    '8.7': chance.pickone([-1, 0, 0.5, 1]),
    '8.8': chance.pickone([-1, 0, 0.5, 1]),
    '8.9': chance.pickone([-1, 0, 0.5, 1]),
    '8.10': chance.pickone([-1, 0, 0.5, 1]),
    '8.11': chance.pickone([-1, 0, 0.5, 1]),
    '8.12': chance.pickone([-1, 0, 0.5, 1]),
    '8.13': chance.pickone([-1, 0, 0.5, 1]),
    '8.14': chance.pickone([-1, 0, 0.5, 1]),
    '8.15': chance.pickone([-1, 0, 0.5, 1]),
    '8.16': chance.pickone([-1, 0, 0.5, 1]),
    '8.17': chance.pickone([-1, 0, 0.5, 1]),
    '8.18': chance.pickone([-1, 0, 0.5, 1]),
    '8.19': chance.pickone([-1, 0, 0.5, 1]),
    '8.20': chance.pickone([-1, 0, 0.5, 1]),
    '8.21': chance.pickone([-1, 0, 0.5, 1]),
    '8.22': chance.pickone([-1, 0, 0.5, 1]),
    '8.23': chance.pickone([-1, 0, 0.5, 1]),
    '8.24': chance.pickone([-1, 0, 0.5, 1]),
    '8.25': chance.pickone([-1, 0, 0.5, 1]),
    '8.26': chance.pickone([-1, 0, 0.5, 1]),
    '8.27': chance.pickone([-1, 0, 0.5, 1]),
    '8.28': chance.pickone([-1, 0, 0.5, 1]),
    '8.29': chance.pickone([-1, 0, 0.5, 1]),
    '8.30': chance.pickone([-1, 0, 0.5, 1]),
    '8.31': chance.pickone([-1, 0, 0.5, 1]),
    '8.32': chance.pickone([-1, 0, 0.5, 1]),
    '8.33': chance.pickone([-1, 0, 0.5, 1]),
    '8.34': chance.pickone([-1, 0, 0.5, 1]),
  },
};
export const buildResultsWithCisControlsScenarios = ({
  controlsFrameWork = 'cis',
  ...specifics
}: Partial<QuantificationOld> & {
  controlsFrameWork?: 'cis' | 'cis_v8';
} = {}): QuantificationOld => {
  const { id: id1, ...ag1 } = buildAgData();
  const { id: id2, ...ag2 } = buildAgData();
  const { id: id3, ...ag3 } = buildAgData(true);

  const assetGroupsData = {
    [id1]: ag1,
    [id2]: ag2,
    [id3]: ag3,
  };
  return {
    by_scenario_exposure: {
      bi: buildScenarioResults(),
      contingent_bi: buildScenarioResults(),
      extortion: buildScenarioResults(),
      liability: buildScenarioResults(),
      privacy: buildScenarioResults(),
      regulatory: buildScenarioResults(),
    },
    overall_exposure: buildOverallResults(),
    insights: buildInsightResults(),
    by_event_type_exposure: {
      ransomware: buildEpCurveAndHighlights(),
      data_breach: buildEpCurveAndHighlights(),
      interruption: buildEpCurveAndHighlights(),
      service_provider_interruption: buildEpCurveAndHighlights(),
      service_provider_data_breach: buildEpCurveAndHighlights(),
    },
    third_party_exposure: buildEpCurveAndHighlights(),
    control_scenarios: buildControlScenarios([id1, id2, id3], 'cis'),
    asset_group_information: assetGroupsData,
    controls_average: controlsAverage[controlsFrameWork],
    ...specifics,
  };
};

const buildHazardDistributionValues = (
  specifics?: Partial<HazardDistributionValues>,
): HazardDistributionValues => {
  return {
    total_cost: chance.integer(),
    frequency_in_simulation: fracionValue(),
    frequency_by_event_type: {
      attritional: fracionValue(),
      data_breach: fracionValue(),
      interruption: fracionValue(),
      ransomware: fracionValue(),
    },
    most_severe_event: {
      attack_vector: null,
      event_cost: chance.integer(),
      event_description: 'Some Description',
      event_type: chance.pickone([
        'ransomware',
        'interruption',
        'data_breach',
        'attritional',
      ]),
    },
    ...specifics,
  };
};

export const buildSimulationExposure = (
  specifics?: Partial<
    SimulationExposure & { maxTargeted: number; maxBenchmark: number }
  >,
): SimulationExposure => {
  const maxTargeted = specifics?.maxTargeted || 1;
  const maxBenchmark = specifics?.maxBenchmark || 1;
  return {
    aal: chance.natural({ min: 0, max: 200_000 }),
    high_exposure_loss: chance.natural({ min: 0, max: 200_000_000 }),
    low_exposure_loss: chance.natural({ min: 0, max: 20_000 }),
    targeted_annual_rate: chance.floating({
      min: 0,
      max: maxTargeted,
      fixed: 4,
    }),
    targeted_benchmark_annual_rate: chance.floating({
      min: 0,
      max: maxBenchmark,
      fixed: 4,
    }),
    ...specifics,
  };
};

export const buildByCoverageRichSimulationExposure = ({
  ...specifics
}: Partial<ByCoverageRichSimulationExposure> = {}): ByCoverageRichSimulationExposure => {
  return {
    ep_curve: buildEpCurve(),
    ep_curve1000: buildEpCurve(1000),
    damage_types: [chance.name(), chance.name(), chance.name(), chance.name()],
    events: [
      {
        damage_types: [chance.name(), chance.name()],
        description: chance.sentence({ words: 30 }),
        duration: chance.integer({ min: 0, max: 40000 }),
        event_cause: chance.pickone(['attack', 'failure']),
        event_type: chance.pickone(['specific', 'systemic']),
        technology_impacted: chance.word(),
        title: chance.name(),
      },
      {
        damage_types: [chance.name(), chance.name()],
        description: chance.sentence(),
        duration: chance.integer({ min: 0, max: 40000 }),
        event_cause: chance.pickone(['attack', 'failure']),
        event_type: chance.pickone(['specific', 'systemic']),
        technology_impacted: chance.word(),
        title: chance.name(),
      },
      {
        damage_types: [chance.name(), chance.name()],
        description: chance.sentence(),
        duration: chance.integer({ min: 0, max: 40000 }),
        event_cause: chance.pickone(['attack', 'failure']),
        event_type: chance.pickone(['specific', 'systemic']),
        technology_impacted: chance.word(),
        title: chance.name(),
      },
    ],
    ...buildSimulationExposure(),
    ...specifics,
  };
};

export const generatePercentiles = (
  length = 99,
  minValue = 1000000,
  maxValue = 100000000,
): Record<number, number> => {
  const randomIntegers = chance.unique(chance.integer, length, {
    min: minValue,
    max: maxValue,
  });
  randomIntegers.sort((a, b) => a - b);
  return Object.fromEntries(
    randomIntegers.map((value, index) => [index + 1, value]),
  );
};

export const buildRichSimulationExposure = (
  specifics?: Partial<RichSimulationExposure>,
): RichSimulationExposure => {
  return {
    top_simulation_stats: {
      event_duration: {
        avg: chance.integer({ min: 0, max: 1000 }),
        std: chance.integer({ min: 0, max: 1000 }),
        median: chance.integer({ min: 0, max: 1000 }),
        percentiles: generatePercentiles(),
      },
      event_loss: {
        avg: chance.integer({ min: 0, max: 1000 }),
        std: chance.integer({ min: 0, max: 1000 }),
        median: chance.integer({ min: 0, max: 1000 }),
        percentiles: generatePercentiles(),
      },
      num_of_records_affected: {
        avg: chance.integer({ min: 0, max: 1000 }),
        std: chance.integer({ min: 0, max: 1000 }),
        median: chance.integer({ min: 0, max: 1000 }),
        percentiles: generatePercentiles(),
      },
    },
    ep_curve: buildEpCurve(),
    ep_curve1000: buildEpCurve(1000),
    ...buildSimulationExposure(),
    ...specifics,
  };
};

export const buildDrillDownLeanSimulationExposure = (
  simulation_stats?: string[],
  specifics?: Partial<LeanSimulationExposure>,
): DrillDownLeanSimulationExposure => {
  const defaults_simulation_stats = [
    'event_duration',
    'event_loss',
    'num_of_records_affected',
  ];
  const simulation_stats_keys = simulation_stats || defaults_simulation_stats;
  return {
    top_simulation_stats: {
      ...Object.fromEntries(
        simulation_stats_keys.map((stat) => {
          return [
            stat,
            {
              avg: chance.integer({ min: 0, max: 1000 }),
              std: chance.integer({ min: 0, max: 1000 }),
              median: chance.integer({ min: 0, max: 1000 }),
              percentiles: generatePercentiles(),
            },
          ];
        }),
      ),
    },
    ep_curve: buildEpCurve(),
    ...buildSimulationExposure(),
    ...specifics,
  };
};

export const buildRiskScenarios = (
  currentAAL: number,
): Record<RiskScenario, ByRiskScenario> => {
  const randomScenario = (status: RiskScenario): ByRiskScenario => {
    let minAALDamage: number,
      maxAALDamage: number,
      minAALEffect: number,
      maxAALEffect: number;
    let minPMLDamage: number,
      maxPMLDamage: number,
      minPMLEffect: number,
      maxPMLEffect: number;

    if (status === 'MINIMAL') {
      minAALDamage = currentAAL * 0.01;
      maxAALDamage = currentAAL;
      minAALEffect = 0.01;
      maxAALEffect = 0.02;
      minPMLDamage = 1000;
      maxPMLDamage = 2500;
      minPMLEffect = 0.01;
      maxPMLEffect = 0.01;
    } else if (status === 'BASELINE') {
      minAALDamage = currentAAL;
      maxAALDamage = currentAAL * 3;
      minAALEffect = 0.5;
      maxAALEffect = 0.9;
      minPMLDamage = 7500;
      maxPMLDamage = 15000;
      minPMLEffect = 0.25;
      maxPMLEffect = 0.5;
    }
    return {
      aal_damage: chance.integer({
        min: minAALDamage || 0,
        max: maxAALDamage || 0,
      }),
      aal_effect: chance.floating({
        min: minAALEffect || 0,
        max: maxAALEffect || 0,
        fixed: 2,
      }),
      pml_damage: chance.integer({
        min: minPMLDamage || 0,
        max: maxPMLDamage || 0,
      }),
      pml_effect: chance.floating({
        min: minPMLEffect,
        max: maxPMLEffect,
        fixed: 2,
      }),
      average_damage: chance.integer({ min: minAALDamage, max: maxAALDamage }),
      average_effect: chance.floating({
        min: minAALEffect,
        max: maxAALEffect,
        fixed: 2,
      }),
      current_status: status,
      by_minimal_new_average: chance.floating({ min: 0.1, max: 0.9, fixed: 2 }),
    };
  };
  const riskScenarios: Record<RiskScenario, ByRiskScenario> = {
    BASELINE: randomScenario('BASELINE'),
    MINIMAL: randomScenario('MINIMAL'),
  };

  return riskScenarios;
};

const buildControlScenariosByAssetGroup = (
  assetGroupIds: string[],
  sec_controls_framework: 'cis' | 'nist' | 'iso27001' | 'cis_v8',
  controls: readonly ControlType[],
) => {
  return Object.fromEntries(
    assetGroupIds.map((agId, index) => {
      return [
        agId,
        {
          [controls[index * 2]]: {
            ...buildAGLevelRecommendation(sec_controls_framework),
          },
          [controls[index * 2 + 1]]: {
            ...buildAGLevelRecommendation(sec_controls_framework),
          },
        },
      ];
    }),
  );
};

export const buildControlScenariosByControlToMinimal = (
  sec_controls_framework: 'cis' | 'nist' | 'iso27001' | 'cis_v8',
  controls: readonly ControlType[],
) => {
  return Object.fromEntries(
    controls.map((control, index) => {
      const builder =
        index < 3 ? buildAGLevelRecommendation : buildAGLevelWhatIfScenario;
      return [control, { ...builder(sec_controls_framework) }];
    }),
  );
};

const buildByMSBundleScenario = (
  specifics?: Partial<ByMSBundleScenario>,
): ByMSBundleScenario => ({
  current_status: chance.pickone(Object.values(MSProductBundles)),
  aal_damage: chance.integer({ min: 1_000, max: 200_000 }),
  aal_effect: chance.integer({ min: 1_000, max: 200_000 }),
  pml_damage: chance.integer({ min: 1_000, max: 200_000 }),
  pml_effect: chance.integer({ min: 1_000, max: 200_000 }),
  average_damage: chance.integer({ min: 1_000, max: 200_000 }),
  average_effect: chance.integer({ min: 1_000, max: 200_000 }),
  by_minimal_new_average: chance.integer({
    min: 1_000_000,
    max: 20_000_000,
  }),

  ...specifics,
});

const buildControlScenariosByMSBundleToMinimal = (
  specifics?: Partial<ByMSBundleToMinimal>,
): ByMSBundleToMinimal => {
  const mSBundleScenarios = Object.fromEntries(
    Object.values(MSProductBundles).map((bundle) => [
      bundle,
      buildByMSBundleScenario(),
    ]),
  );
  return { ...mSBundleScenarios, ...specifics } as ByMSBundleToMinimal;
};

const buildByMSProductScenario = (
  specifics?: Partial<ByMSProductScenario>,
): ByMSProductScenario => {
  return {
    current_status: chance.pickone(Object.values(MSProducts)),
    aal_damage: chance.integer({ min: 1_000, max: 200_000 }),
    aal_effect: chance.integer({ min: 1_000, max: 200_000 }),
    pml_damage: chance.integer({ min: 1_000, max: 200_000 }),
    pml_effect: chance.integer({ min: 1_000, max: 200_000 }),
    average_damage: chance.integer({ min: 1_000, max: 200_000 }),
    average_effect: chance.integer({ min: 1_000, max: 200_000 }),
    effective_controls: chance.pickset([...cisV8Ids], 5),
    by_minimal_new_average: chance.integer({
      min: 1_000_000,
      max: 20_000_000,
    }),
    ...specifics,
  };
};

const buildControlScenariosByMSProduct = (
  specifics?: Partial<ByMSProduct>,
): ByMSProduct => {
  const byMSProduct = Object.fromEntries(
    Object.values(MSProducts).map((product) => [
      product,
      buildByMSProductScenario({ current_status: product }),
    ]),
  );
  return { ...byMSProduct, ...specifics } as ByMSProduct;
};

const generateRandomByControlDomainScenario = () => {
  return {
    control_domain_scenario: chance.pickone([...ControlDomainScenarios]),
    current_status: { [chance.word()]: chance.bool() },
    target_status: { [chance.word()]: chance.bool() },
  };
};
const buildControlScenariosByDomainScenarios = (): ByControlDomainScenarios => {
  const entries = ASBCategories.map((category) => [
    category,
    generateRandomByControlDomainScenario(),
  ]);
  return Object.fromEntries(entries) as ByControlDomainScenarios;
};

export const controlIdsMapping = {
  cis: cisControlIds,
  nist: nistControlIds,
  iso27001: ISO27001ControlNumbers,
  cis_v8: cisV8Ids,
};

export const buildControlScenarios = (
  assetGroupIds: string[],
  sec_controls_framework: 'cis' | 'nist' | 'iso27001' | 'cis_v8',
): ControlScenarios => {
  const controls = controlIdsMapping[sec_controls_framework];
  const byAssetGroup = buildControlScenariosByAssetGroup(
    assetGroupIds,
    sec_controls_framework,
    controls,
  );

  const byControlToMinimal = buildControlScenariosByControlToMinimal(
    sec_controls_framework,
    controls,
  );
  return {
    by_asset_group: byAssetGroup,
    by_control_to_minimal: byControlToMinimal,
    // by_ms_bundle_to_minimal: buildControlScenariosByMSBundleToMinimal(),
    // by_product_scenarios: buildControlScenariosByMSProduct(),
  };
};

export const buildParamStats = ({
  ...specifics
}: Partial<Record<ParamStat, number>> = {}): Record<ParamStat, number> => {
  return {
    mean: chance.integer(),
    maximum: chance.integer(),
    median: chance.integer(),
    std: chance.integer(),
    ...specifics,
  };
};

export const buildIntensityParams = ({
  ...specifics
}: Partial<TopSimulationStat> = {}): TopSimulationStat => {
  return {
    avg: chance.integer(),
    median: chance.integer(),
    std: chance.integer(),
    percentiles: generatePercentiles(),
    ...specifics,
  };
};

export const buildResultsWithNistControlsScenarios = ({
  ...specifics
}: Partial<QuantificationOld> = {}): QuantificationOld => {
  const { id: id1, ...ag1 } = buildAgData();
  const { id: id2, ...ag2 } = buildAgData();
  const { id: id3, ...ag3 } = buildAgData(true);

  const assetGroupsData = {
    [id1]: ag1,
    [id2]: ag2,
    [id3]: ag3,
  };
  return {
    by_scenario_exposure: {
      bi: buildScenarioResults(),
      contingent_bi: buildScenarioResults(),
      extortion: buildScenarioResults(),
      liability: buildScenarioResults(),
      privacy: buildScenarioResults(),
      regulatory: buildScenarioResults(),
    },
    overall_exposure: buildOverallResults(),
    insights: buildInsightResults(),
    by_event_type_exposure: {
      ransomware: buildEpCurveAndHighlights(),
      data_breach: buildEpCurveAndHighlights(),
      interruption: buildEpCurveAndHighlights(),
      service_provider_interruption: buildEpCurveAndHighlights(),
      service_provider_data_breach: buildEpCurveAndHighlights(),
    },
    third_party_exposure: buildEpCurveAndHighlights(),
    control_scenarios: buildControlScenarios([id1, id2, id3], 'nist'),
    asset_group_information: assetGroupsData,
    controls_average: controlsAverage.nist,
    ...specifics,
  };
};
export const buildResultsNoControls = ({
  ...specifics
}: Partial<QuantificationOld> = {}): QuantificationOld => {
  const results = {
    cis_recommendation: [],
    by_scenario_exposure: {
      bi: buildScenarioResults(),
      contingent_bi: buildScenarioResults(),
      extortion: buildScenarioResults(),
      liability: buildScenarioResults(),
      privacy: buildScenarioResults(),
      regulatory: buildScenarioResults(),
    },
    overall_exposure: buildOverallResults(),
    ...specifics,
  };
  return results;
};

export const buildHighlights = ({
  ...specifics
}: Partial<Highlights> = {}): Highlights => {
  return {
    maximum: chance.natural({ min: 0 }),
    medium: chance.natural({ min: 0 }),
    minimum: chance.natural({ min: 0 }),
    ...specifics,
  };
};

export const buildRiskTransfer = ({
  ...specifics
}: Partial<RiskTransfer> = {}): RiskTransfer => {
  return {
    highlights: {
      overall: [
        'There is a 10% probability that annual losses will exceed the aggregate Limit',
        'There is a 13% probability that annual losses will exceed the deductible',
        'the current limit is 10% under the estimated 1% high exposure (Y$)',
        'Average annual risk loss is falling above the deductible',
      ],
      by_scenario_exposure: {
        bi: [
          'There is a 10% probability of bi events breaching the event insured limit',
          'There is a 6% probability of bi events exceeding the event deductible',
        ],
        regulatory: [
          'There is a 10% probability of regulatory events breaching the event insured limit',
          'There is a 10% probability of regulatory events exceeding the event deductible',
        ],
        privacy: [
          'There is a 10% probability of privacy events breaching the event insured limit',
          'There is a 10% probability of privacy events exceeding the event deductible',
        ],
        liability: [
          'There is a 10% probability of liability events breaching the event insured limit',
          'There is a 10% probability of liability events exceeding the event deductible',
        ],
        contingent_bi: [
          'There is a 10% probability of contingent_bi events breaching the event insured limit',
          'There is a 10% probability of contingent_bi events exceeding the event deductible',
        ],
        extortion: [
          'There is a 10% probability of extortion events breaching the event insured limit',
          'There is a 8% probability of extortion events exceeding the event deductible',
        ],
      },
    },
    deductible: chance.integer({ min: 111, max: 55555 }),
    limit: chance.integer({ min: 55555, max: 99999 }),
    ...specifics,
  };
};

export const buildEpCurve = (points = 100): EpPoint[] => {
  const epCurve: EpPoint[] = [];
  for (let i = 0; i < points; i++) {
    epCurve.push({
      exposure: chance.integer({
        min: 10000 * (i / points),
        max: 1000000 * ((i + 1) / points),
      }),
      probability: 0.01 * (points - Math.round(i)),
    });
  }
  return epCurve;
};

export const buildEvent = ({
  ...specifics
}: Partial<LossEvent> = {}): LossEvent => {
  return {
    damage_types: [chance.word()],
    description: chance.sentence(),
    duration: chance.integer(),
    event_cause: chance.pickone(['attack', 'failure']),
    event_type: chance.pickone(['specific', 'systemic']),
    technology_impacted: chance.word(),
    title: chance.sentence(),
    ...specifics,
  };
};
function buildInsightResults(): ResultsInsights {
  return {
    cc_average_ratio_per_coverage: {
      bi: {
        bi_forensics: fracionValue(),
        bi_recovery_expenses: fracionValue(),
        lost_income: fracionValue(),
        public_relations_repairment: fracionValue(),
      },
      contingent_bi: {
        bi_recovery_expenses: fracionValue(),
        lost_income: fracionValue(),
        public_relations_repairment: fracionValue(),
      },
      extortion: {
        extortion_payment: fracionValue(),
        extortion_recovery_expenses: fracionValue(),
      },
      liability: {},
      privacy: {
        data_recovery: fracionValue(),
        public_relations_repairment: fracionValue(),
      },
      regulatory: {
        regulatory_fines: 1,
      },
    },
    targeted_intensity_parameter_statistics: {
      data_scale: {
        mean: fracionValue(),
        median: fracionValue(),
        max: fracionValue(),
        std: fracionValue(),
        percentiles: {},
      },
      duration: {
        mean: chance.integer(),
        median: chance.integer(),
        max: chance.integer(),
        std: chance.integer(),
        percentiles: {},
      },
      effect_rate: {
        mean: fracionValue(),
        median: fracionValue(),
        max: fracionValue(),
        std: fracionValue(),
        percentiles: {},
      },
    },
    hazard_distribution: {
      'cdn:Akamai:Akamai CDN': {
        total_cost: chance.integer(),
        frequency_in_simulation: fracionValue(),
      },
      'cdn:CloudFlare:Cloudflare CDN': {
        total_cost: chance.integer(),
        frequency_in_simulation: fracionValue(),
      },
      'cms:Drupal:Drupal': {
        total_cost: chance.integer(),
        frequency_in_simulation: fracionValue(),
      },
      'cms:Elementor:Elementor': {
        total_cost: chance.integer(),
        frequency_in_simulation: fracionValue(),
      },
    },
    num_events_that_caused_damage: {
      provider: chance.integer(),
      tech: chance.integer(),
      targeted: chance.integer(),
    },
    mitre_initial_vector_distribution: {
      mitre_initial_vector_distribution: {
        [chance.string()]: {
          code: chance.string(),
          probability: fracionValue(),
        },
        [chance.string()]: {
          code: chance.string(),
          probability: fracionValue(),
        },
        [chance.string()]: {
          code: chance.string(),
          probability: fracionValue(),
        },
        [chance.string()]: {
          code: chance.string(),
          probability: fracionValue(),
        },
      },
    },
    propagation_graph_insights: {},
  };
}

const buildEpCurveAndHighlights = () => ({
  ep_curve: buildEpCurve(),
  highlights: buildHighlights(),
});

export const buildByOtherRiskDriversBreakDown = <
  T extends EventTypes | InitialAttackVector,
>(
  eventType: 'event' | 'vector',
): ByRiskDriverMinimalBreakdown<T> => {
  const events =
    eventType === 'event'
      ? [
        ...Object.values(BasicEventType),
        ...Object.values(ServiceProviderEventType),
      ]
      : initialAttackVectorsAsStringArray;
  return Object.fromEntries(
    events.map((event) => {
      return [
        event,
        {
          aal: chance.integer({ min: 0, max: 200_000 }),
          targeted_annual_rate: chance.floating({ min: 0, max: 1 }),
        },
      ];
    }),
  ) as ByRiskDriverMinimalBreakdown<T>;
};

interface EventTypeKeys {
  ransomware: string[];
  interruption: string[];
  data_breach: string[];
}

const EVENT_TYPE_TO_KEYS: EventTypeKeys = {
  ransomware: ['event_duration', 'event_loss', 'num_of_records_affected'],
  interruption: ['event_duration', 'event_loss'],
  data_breach: ['event_loss', 'num_of_records_affected'],
};

const buildByRiskScenarioDrillDown = <
  T extends EventTypes | InitialAttackVector,
>(
  sec_controls_framework: 'cis' | 'nist' | 'iso27001' | 'cis_v8',
  eventType: 'event' | 'vector' = 'event',
  event: string,
): T extends EventTypes
  ? ByEventTypeDrillDown
  : T extends InitialAttackVector
  ? ByInitialVectorDrillDown
  : never => {
  const controls =
    sec_controls_framework === 'cis'
      ? cisControlIds
      : sec_controls_framework === 'cis_v8'
        ? cisV8Ids
        : nistControlIds;
  const simulation_stats =
    eventType == 'event'
      ? EVENT_TYPE_TO_KEYS[event as keyof EventTypeKeys]
      : undefined;
  const drillDown = {
    simulation_exposure: buildDrillDownLeanSimulationExposure(simulation_stats),
    by_control_to_minimal: buildControlScenariosByControlToMinimal(
      sec_controls_framework,
      controls,
    ),
    by_control_domain_scenarios: buildControlScenariosByDomainScenarios(),
    by_other_risk_drivers_breakdown: buildByOtherRiskDriversBreakDown(
      eventType === 'event' ? 'vector' : 'event',
    ),
    calibration_highlights: buildCalibrationHighlights(),
    by_ms_bundle_to_minimal: buildControlScenariosByMSBundleToMinimal(),
    by_product_scenarios: buildControlScenariosByMSProduct(),
  };
  return drillDown as T extends EventTypes
    ? ByEventTypeDrillDown
    : T extends InitialAttackVector
    ? ByInitialVectorDrillDown
    : never;
};

const buildByEventTypeDetailedExposure = (
  sec_controls_framework: 'cis' | 'nist' | 'iso27001' | 'cis_v8',
): ByEventTypeDetailedExposure => {
  return Object.fromEntries(
    [
      ...Object.values(BasicEventType),
      ...Object.values(ServiceProviderEventType),
    ].map((event) => [
      event,
      buildByRiskScenarioDrillDown<InitialAttackVector>(
        sec_controls_framework,
        'event',
        event,
      ),
    ]),
  ) as ByEventTypeDetailedExposure;
};
const buildByInitialVectorDetailedExposure = (
  sec_controls_framework: 'cis' | 'nist' | 'iso27001' | 'cis_v8',
): ByInitialVectorDetailedExposure => {
  return Object.fromEntries(
    initialAttackVectorsAsStringArray.map((event) => [
      event,
      buildByRiskScenarioDrillDown<InitialAttackVector>(
        sec_controls_framework,
        'vector',
        event,
      ),
    ]),
  ) as ByInitialVectorDetailedExposure;
};

const buildByInitialVectorExposure = (): ByRiskDriverExposure => {
  return Object.fromEntries(
    initialAttackVectorsAsStringArray.map((attackVector) => [
      attackVector,
      buildSimulationExposure(),
    ]),
  );
};

const buildIndustryDivisionFrequency = (
  specifics?: Partial<Record<SICDivisionLetter, number>>,
): Record<SICDivisionLetter, number> => {
  const industryDivisionFrequency = Object.fromEntries(
    Object.values(SICDivisionLetters).map((letter) => [
      letter,
      chance.floating({ min: 0, max: 1 }),
    ]),
  ) as Record<SICDivisionLetter, number>;
  return {
    ...industryDivisionFrequency,
    ...specifics,
  };
};

const buildRevenueBandFrequency = (
  specifics?: Partial<Record<DataRevenueRange, number>>,
): Record<DataRevenueRange, number> => {
  const revenueBandFrequency = Object.fromEntries(
    Object.values(DataRevenueRanges).map((revenue) => [
      revenue,
      chance.floating({ min: 0, max: 1 }),
    ]),
  ) as Record<DataRevenueRange, number>;
  return {
    ...revenueBandFrequency,
    ...specifics,
  };
};

const buildFrequencyHighlights = (
  specifics?: Partial<FrequencyHighlights>,
): FrequencyHighlights => {
  return {
    company_division: chance.pickone(Object.values(SICDivisionLetters)),
    company_frequency: chance.floating({ min: 0, max: 1 }),
    company_revenue_band: chance.pickone(Object.values(DataRevenueRanges)),
    industry_division_frequency: buildIndustryDivisionFrequency(),
    revenue_band_frequency: buildRevenueBandFrequency(),
    ...specifics,
  };
};

const buildCalibrationHighlights = (
  specifics?: Partial<CalibrationHighlights>,
): CalibrationHighlights => {
  return {
    frequency_highlights: buildFrequencyHighlights(),
    ...specifics,
  };
};

export const buildLeanSimulationExposure = (
  specifics?: Partial<LeanSimulationExposure>,
): LeanSimulationExposure => {
  const simulationExposure = buildSimulationExposure();
  return {
    ...simulationExposure,
    top_simulation_stats: buildTopSimulationStats(),
    ep_curve: buildEpCurve(),
    ...specifics,
  };
};

const buildByThresholdDetailedExposure = (
  specifics?: Partial<ByThresholdDetailedExposure>,
): ByThresholdDetailedExposure => {
  return {
    by_event_type_detailed_exposure: buildByOtherRiskDriversBreakDown('event'),
    by_initial_vector_detailed_exposure:
      buildByOtherRiskDriversBreakDown('vector'),
    scenario_simulation_exposure: buildLeanSimulationExposure(),
    threshold_value: chance.floating({ min: 0, max: 200_000_000 }),
    ...specifics,
  };
};

export const costThresholds = [0.01, 0.1, 1, 2];
const buildByCostDetailedExposure = (
  specifics?: Partial<ByCostDetailedExposure>,
): ByCostDetailedExposure => {
  const base = Object.fromEntries(
    costThresholds.map((threshold) => [
      threshold,
      buildByThresholdDetailedExposure(),
    ]),
  );
  return { ...base, ...specifics } as ByCostDetailedExposure;
};

export const durationThresholds = [8, 12, 24, 36];
const buildByDurationDetailedExposure = (
  specifics?: Partial<ByDurationDetailedExposure>,
): ByDurationDetailedExposure => {
  const base = Object.fromEntries(
    durationThresholds.map((threshold) => [
      threshold,
      buildByThresholdDetailedExposure({
        threshold_value: Number(threshold) * 60,
      }), // the model returns value in minutes
    ]),
  );
  return { ...base, ...specifics } as ByDurationDetailedExposure;
};

export const recordThresholds = [1, 2, 5, 10];
const buildByRecordsDetailedExposure = (
  specifics?: Partial<ByRecordDetailedExposure>,
): ByRecordDetailedExposure => {
  const base = Object.fromEntries(
    recordThresholds.map((threshold) => [
      threshold,
      buildByThresholdDetailedExposure(),
    ]),
  );
  return { ...base, ...specifics } as ByRecordDetailedExposure;
};

export const buildCostComponentsBreakdown = () => ({
  lost_income: chance.floating({
    min: 0.01,
    max: 0.1,
  }),
  bi_recovery_expenses: chance.floating({
    min: 0.01,
    max: 0.2,
  }),
  extortion_recovery_expenses: chance.floating({
    min: 0.01,
    max: 0.2,
  }),
  bi_forensics: chance.floating({
    min: 0.001,
    max: 0.3,
  }),
  data_related_forensics: chance.floating({
    min: 0.01,
    max: 0.3,
  }),
  public_relations_repairment: chance.floating({
    min: 0.01,
    max: 0.3,
  }),
  monitoring_services: chance.floating({
    min: 0.001,
    max: 0.3,
  }),
  notifications: chance.floating({ min: 0.001, max: 0.3 }),
  data_recovery: chance.floating({
    min: 0.001,
    max: 0.3,
  }),
  regulatory_fines: chance.floating({
    min: 0.001,
    max: 0.3,
  }),
  regulatory_legal_defense: chance.floating({
    min: 0.01,
    max: 0.3,
  }),
  extortion_payment: chance.floating({
    min: 0.01,
    max: 0.3,
  }),
  settlements: chance.floating({ min: 0.001, max: 1.0 }),
  legal_defense: chance.floating({ min: 0.001, max: 1.0 }),
  attritional_damage_bi: chance.floating({
    min: 0.001,
    max: 0.3,
  }),
  attritional_damage_contingent_bi: chance.floating({
    min: 0.001,
    max: 0.3,
  }),
  attritional_damage_privacy: chance.floating({
    min: 0.01,
    max: 0.3,
  }),
  attritional_damage_liability: chance.floating({
    min: 0.01,
    max: 0.3,
  }),
  attritional_damage_regulatory: chance.floating({
    min: 0.001,
    max: 0.3,
  }),
  attritional_damage_extortion: chance.floating({
    min: 0.01,
    max: 0.3,
  }),
  // custom cost components
  'Custom CC': chance.floating({
    min: 0.001,
    max: 0.3,
  }),
});

export const buildNewSchemaResults = (
  {
    sec_controls_frameworks,
    ...specifics
  }: Partial<Quantification> & {
    sec_controls_frameworks: 'cis' | 'nist' | 'iso27001' | 'cis_v8';
  } = {
      sec_controls_frameworks: 'cis',
    },
): Quantification => {
  const { id: id1, ...ag1 } = buildAgData();
  const { id: id2, ...ag2 } = buildAgData();
  const { id: id3, ...ag3 } = buildAgData(true);

  const assetGroupsData = {
    [id1]: ag1,
    [id2]: ag2,
    [id3]: ag3,
  };
  const simulationExposure = buildRichSimulationExposure();
  const {
    targeted_annual_rate: maxTargeted,
    targeted_benchmark_annual_rate: maxBenchmark,
  } = simulationExposure;
  return {
    input_stats: {
      asset_group_information: assetGroupsData,
      controls_average: controlsAverage[sec_controls_frameworks],
    },
    simulation_exposure: simulationExposure,
    control_scenarios: buildControlScenarios(
      [id1, id2, id3],
      sec_controls_frameworks,
    ),
    risk_scenarios: buildRiskScenarios(simulationExposure.aal),
    simulation_stats: {
      cc_average_ratio_per_coverage: {
        bi: { settlements: fracionValue() }, // sum adds up to 1
        contingent_bi: { loss_income: fracionValue() },
        extortion: { extortion_payment: fracionValue() },
        liability: { regulatory_fine: fracionValue() },
        privacy: { forensics: fracionValue() },
        regulatory: { data_recovery: fracionValue() },
      },
      num_events_that_caused_damage: {
        attritional: chance.integer({ min: 0 }),
        data_breach: chance.integer({ min: 0 }),
        interruption: chance.integer({ min: 0 }),
        ransomware: chance.integer({ min: 0 }),
      },
      hazard_distribution: {
        'cdn:Akamai:Akamai CDN': buildHazardDistributionValues(),
        'cdn:CloudFlare:Cloudflare CDN': buildHazardDistributionValues(),
        'cms:Drupal:Drupal': buildHazardDistributionValues(),
        'cms:Elementor:Elementor': buildHazardDistributionValues(),
      },
      mitre_initial_vector_distribution: {
        [chance.word()]: { code: chance.word(), probability: fracionValue() },
        [chance.word()]: { code: chance.word(), probability: fracionValue() },
        [chance.word()]: { code: chance.word(), probability: fracionValue() },
      },
      targeted_intensity_parameter_statistics: {
        data_scale: buildIntensityParams(),
        duration: buildIntensityParams(),
        effect_rate: buildIntensityParams(),
      },
      cat_intensity_parameter_statistics: {
        data_scale: buildParamStats(),
        duration: buildParamStats(),
        effect_rate: buildParamStats(),
      },
      criticality_distribution: {
        data_records: {
          cloud: chance.integer({ min: 0, max: 100000000 }),
          infrastructure: chance.integer({ min: 0, max: 100000000 }),
        },
        reliance: { cloud: fracionValue(), infrastructure: fracionValue() },
      },
      control_frequency_effect: {
        ICHA: {
          data_breach: chance.pickone([1, -1]),
          interruption: chance.pickone([1, -1]),
        },
        ICSA: {
          ransomware: chance.pickone([1, -1]),
          attritional: chance.pickone([1, -1]),
        },
        CVM: {
          service_provider_interruption: chance.integer({ min: 0 }),
          service_provider_data_breach: chance.integer({ min: 0 }),
        },
      },
    },
    by_third_party_exposure: buildRichSimulationExposure(),
    by_scenario_exposure: {
      bi: buildByCoverageRichSimulationExposure(),
      contingent_bi: buildByCoverageRichSimulationExposure(),
      extortion: buildByCoverageRichSimulationExposure(),
      liability: buildByCoverageRichSimulationExposure(),
      privacy: buildByCoverageRichSimulationExposure(),
      regulatory: buildByCoverageRichSimulationExposure(),
    },
    by_event_type_exposure: {
      ransomware: buildSimulationExposure({ maxTargeted, maxBenchmark }),
      attritional: buildSimulationExposure({ maxTargeted, maxBenchmark }),
      data_breach: buildSimulationExposure({ maxTargeted, maxBenchmark }),
      interruption: buildSimulationExposure({ maxTargeted, maxBenchmark }),
    },
    by_service_provider_event_type_exposure: {
      service_provider_data_breach: buildSimulationExposure({
        maxTargeted,
        maxBenchmark,
      }),
      service_provider_interruption: buildSimulationExposure({
        maxTargeted,
        maxBenchmark,
      }),
    },
    by_initial_vector_exposure: buildByInitialVectorExposure(),
    by_event_type_detailed_exposure: buildByEventTypeDetailedExposure(
      sec_controls_frameworks,
    ),
    by_initial_vector_detailed_exposure: buildByInitialVectorDetailedExposure(
      sec_controls_frameworks,
    ),
    calibration_highlights: buildCalibrationHighlights(),
    by_cost_detailed_exposure: buildByCostDetailedExposure(),
    by_duration_detailed_exposure: buildByDurationDetailedExposure(),
    by_records_detailed_exposure: buildByRecordsDetailedExposure(),
    cost_components_breakdown: buildCostComponentsBreakdown(),

    ...specifics,
  };
};

export const buildPastRunResult = ({
  ...specifics
}: Partial<PastQuantification> = {}): PastQuantification => {
  return {
    simulation_exposure: buildRichSimulationExposure(),
    by_scenario_exposure: {
      bi: buildByCoverageRichSimulationExposure(),
      contingent_bi: buildByCoverageRichSimulationExposure(),
      extortion: buildByCoverageRichSimulationExposure(),
      liability: buildByCoverageRichSimulationExposure(),
      privacy: buildByCoverageRichSimulationExposure(),
      regulatory: buildByCoverageRichSimulationExposure(),
    },
    ...specifics,
  };
};

export const buildNewPastRunResult = ({
  ...specifics
}: Partial<Quantification> = {}): Quantification => {
  return buildNewSchemaResults();
};
