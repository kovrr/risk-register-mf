import type { CurrencyCode } from '@/helpers/converters';
import type { ResultsInsights } from '@/types/insights';
import type { NewQuantificationForm } from '@/types/quantificationForm';
import type { CISRecommendation } from '@/types/recommendations';
import type {
  ByAssetGroup,
  ByControlDomainScenarios,
  ByControlToMinimal,
  ByRiskScenario,
  ControlType,
  RiskScenario,
} from '@/types/security-controls';
import type { HazardItemType, SecControlsType } from './companyForm';
import type { ByMSBundleToMinimal } from './msBundles';
import type { ByMSProduct } from './msProducts';
import type { InitialAttackVector } from './riskDrivers/attackVectors';
import type { CostComponent } from './riskDrivers/damageTypes';
import type {
  BasicEventTypes,
  EventTypes,
  ServiceProviderEventTypes,
} from './riskDrivers/eventTypes';
import type { SphereForm, VendorData } from './sphereForm';

export interface OverallResults {
  ep_curve: EpPoint[];
  highlights: Highlights;
}

export interface EpPoint {
  exposure: number;
  probability: number;
}

export interface Highlights {
  maximum: number;
  medium: number;
  minimum: number;
}

export interface LossEvent {
  damage_types: string[];
  description: string;
  duration: number;
  event_cause: 'attack' | 'failure';
  event_type: 'specific' | 'systemic';
  technology_impacted: string;
  title: string;
}

export interface Exposure {
  damage_types: string[];
  ep_curve: EpPoint[];
  ep_curve1000?: EpPoint[];
  events: LossEvent[];
  highlights: Highlights;
  probability: number;
  scale_distribution: {
    specific: number;
    systemic: number;
  };
  scenario_impact: number;
  type_distribution: {
    attacks: number;
    failures: number;
  };
}

interface PastQuantificationExposure {
  damage_types: string[];
  events: LossEvent[];
  highlights: Highlights;
  probability: number;
  scale_distribution: {
    specific: number;
    systemic: number;
  };
  scenario_impact: number;
  type_distribution: {
    attacks: number;
    failures: number;
  };
}

export enum Scenario {
  BI = 'bi',
  CONTINGENT_BI = 'contingent_bi',
  EXTORTION = 'extortion',
  LIABILITY = 'liability',
  PRIVACY = 'privacy',
  REGULATORY = 'regulatory',
}
export type ByScenarioExposureOld = {
  [key in Scenario]?: Exposure;
};

export interface SimulationExposure {
  high_exposure_loss: number; // used to be maximum
  aal: number; // used to be medium
  low_exposure_loss: number; // used to be minimum
  targeted_annual_rate: number;
  targeted_benchmark_annual_rate: number;
  risk_driver?: string;
  events?: LossEvent[];
}

export interface ByCoverageRichSimulationExposure extends SimulationExposure {
  ep_curve: EpPoint[];
  ep_curve1000: EpPoint[];
  damage_types: string[];
  events: LossEvent[];
}

export type ByScenarioExposure = Record<
  Scenario,
  ByCoverageRichSimulationExposure
>;

interface InputStats {
  asset_group_information: AssetGroupInformation;
  controls_average: ControlsAverages;
}

export interface RichSimulationExposure extends SimulationExposure {
  top_simulation_stats: TopSimulationStats;
  ep_curve: EpPoint[];
  ep_curve1000: EpPoint[];
}

export interface LeanSimulationExposure extends SimulationExposure {
  top_simulation_stats: TopSimulationStats;
  ep_curve: EpPoint[];
  filtered_num_events?: number;
  scenario_cv?: number;
  match_count?: number;
  diversity_score?: number;
  total_possible_combinations?: number;
  unique_scenario_combinations?: number;
}

export interface DrillDownLeanSimulationExposure
  extends Omit<LeanSimulationExposure, 'top_simulation_stats'> {
  top_simulation_stats: Partial<TopSimulationStats>;
}

type HazardDistribution = Record<string, HazardDistributionValues>;

const IntensityParams = ['data_scale', 'duration', 'effect_rate'] as const;
export type IntensityParam = (typeof IntensityParams)[number];

const ParamStats = ['mean', 'median', 'std', 'maximum'] as const;
export type ParamStat = (typeof ParamStats)[number];

interface InitialVectorDist {
  probability: number;
  code: string;
}
interface HazardSevereEvent {
  event_cost: number;
  event_type: EventTypes;
  attack_vector: string | null;
  event_description: string;
}

export interface HazardDistributionValues {
  total_cost: number;
  frequency_in_simulation: number;
  frequency_score?: number;
  frequency_by_event_type: { [eventType in EventTypes]?: number };
  most_severe_event: HazardSevereEvent;
}

interface RelianceDistribution {
  cloud: number;
  infrastructure: number;
}

export interface CriticalityDistribution {
  reliance: RelianceDistribution;
  data_records: RelianceDistribution; // replace the internal keys to float instead of number for this field
}

export type ControlFrequencyEffect = Record<
  string,
  Partial<Record<EventTypes | ServiceProviderEventTypes, number>>
>;

interface FullSimulationStats {
  cc_average_ratio_per_coverage: CcAverageRatioPerCoverage;
  num_events_that_caused_damage: { [eventType in BasicEventTypes]?: number };
  hazard_distribution: HazardDistribution;
  mitre_initial_vector_distribution: Record<string, InitialVectorDist>;
  targeted_intensity_parameter_statistics: Record<
    IntensityParam,
    TopSimulationStat
  >;
  cat_intensity_parameter_statistics: Record<
    IntensityParam,
    Record<ParamStat, number>
  >;
  criticality_distribution: CriticalityDistribution; // used to be third_party_distributions
  control_frequency_effect: ControlFrequencyEffect;
}

export type ByRiskDriverExposure = Record<string, SimulationExposure>;

export type CostComponentsBreakdown = Record<CostComponent, number>;
interface CcAverageRatioPerCoverage {
  bi: Record<string, number>;
  contingent_bi: Record<string, number>;
  extortion: Record<string, number>;
  liability: Record<string, number>;
  privacy: Record<string, number>;
  regulatory: Record<string, number>;
}

export interface TopSimulationStat {
  avg: number;
  std: number;
  median: number;
  maximum?: number;
  percentiles: Record<number, number>;
}

export interface TopSimulationStats {
  num_of_records_affected: TopSimulationStat;
  event_duration: TopSimulationStat;
  event_loss: TopSimulationStat;
}

export type DrillDownTopSimulationStats = Partial<TopSimulationStats>;

export type MSProductBundle = 'None' | 'E3' | 'E5';

export interface AssetGroupInformation {
  [asset_group_id: string]: {
    name: string;
    type: string;
    ms_product_bundle?: MSProductBundle;
  };
}

interface PastByScenarioExposure {
  bi: PastQuantificationExposure;
  contingent_bi: PastQuantificationExposure;
  extortion: PastQuantificationExposure;
  liability: PastQuantificationExposure;
  privacy: PastQuantificationExposure;
  regulatory: PastQuantificationExposure;
}

export interface ControlScenarios {
  by_asset_group: ByAssetGroup;
  by_control_to_minimal: ByControlToMinimal;
  by_ms_bundle_to_minimal?: ByMSBundleToMinimal;
  by_product_scenarios?: ByMSProduct;
}

export const SICDivisionLetters = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
  G: 'G',
  H: 'H',
  I: 'I',
  J: 'J',
} as const;

export type SICDivisionLetter =
  (typeof SICDivisionLetters)[keyof typeof SICDivisionLetters];

export const DataRevenueRanges = {
  LT_50: '<$50M',
  GT_50_LT_300: '$50M-$300M',
  GT_300_LT_2B: '$300M-$2B',
  GT_2B_LT_10B: '$2B-$10B',
  GT_10B_LT_100B: '$10B-$100B',
  GT_100B: '>$100B',
} as const;

export type DataRevenueRange =
  (typeof DataRevenueRanges)[keyof typeof DataRevenueRanges];

export type FrequencyHighlights = {
  industry_division_frequency: Record<SICDivisionLetter, number>;
  revenue_band_frequency: Record<DataRevenueRange, number>;
  company_division: SICDivisionLetter;
  company_revenue_band: DataRevenueRange;
  company_frequency: number;
};

export type CalibrationHighlights = {
  frequency_highlights: FrequencyHighlights;
};

export interface ByRiskDriverMinimalBreakdownMetrics {
  aal: number;
  targeted_annual_rate: number;
  targeted_benchmark_annual_rate: number;
}

export type ByRiskDriverMinimalBreakdown<
  T extends EventTypes | InitialAttackVector,
> = {
    [k in T]?: ByRiskDriverMinimalBreakdownMetrics;
  };

export interface ByRiskScenarioDrillDown<
  T extends EventTypes | InitialAttackVector,
> {
  simulation_exposure: DrillDownLeanSimulationExposure;
  by_other_risk_drivers_breakdown: ByRiskDriverMinimalBreakdown<T>;
  by_control_to_minimal: ByControlToMinimal;
  by_control_domain_scenarios: ByControlDomainScenarios;
  calibration_highlights?: CalibrationHighlights;
  by_ms_bundle_to_minimal?: ByMSBundleToMinimal;
  by_product_scenarios?: ByMSProduct;
}

// initial attack vector drill down is by event types
export type ByInitialVectorDrillDown = ByRiskScenarioDrillDown<EventTypes>;
export type ByInitialVectorDetailedExposure = Record<
  InitialAttackVector,
  ByInitialVectorDrillDown
>;

// event type drill down is by initial attack vectors
export type ByEventTypeDrillDown = ByRiskScenarioDrillDown<InitialAttackVector>;
export type ByEventTypeDetailedExposure = Record<
  EventTypes,
  ByEventTypeDrillDown
>;

export const ThresholdTypes = {
  COST: 'cost',
  DURATION: 'duration',
  RECORDS: 'records',
} as const;
export type ThresholdType =
  (typeof ThresholdTypes)[keyof typeof ThresholdTypes];
export type CostThreshold = string; // '0.01' | '0.1' | '1' | '2'
export type DurationThreshold = string; // '12' | '24' | '36' | '48';
export type RecordThreshold = string; // '0.001' | '0.01' | '0.1' | '1';

export type ByThresholdDetailedExposure = {
  by_initial_vector_detailed_exposure?: ByRiskDriverMinimalBreakdown<InitialAttackVector>;
  by_event_type_detailed_exposure?: ByRiskDriverMinimalBreakdown<EventTypes>;
  scenario_simulation_exposure: LeanSimulationExposure;
  threshold_value: number;
};

export type ByCostDetailedExposure = Record<
  CostThreshold,
  ByThresholdDetailedExposure
>;
export type ByDurationDetailedExposure = Record<
  DurationThreshold,
  ByThresholdDetailedExposure
>;
export type ByRecordDetailedExposure = Record<
  RecordThreshold,
  ByThresholdDetailedExposure
>;

export interface Quantification {
  input_stats: InputStats;
  simulation_exposure: RichSimulationExposure;
  control_scenarios: ControlScenarios;
  risk_scenarios?: Record<RiskScenario, ByRiskScenario>;
  simulation_stats: FullSimulationStats;
  by_third_party_exposure: RichSimulationExposure;
  by_scenario_exposure: ByScenarioExposure;
  by_event_type_exposure: ByEventTypeExposure; // without service provider (mapped to the other events)
  by_service_provider_event_type_exposure: ByServiceProviderEventTypeExposure; // only service provider
  by_initial_vector_exposure: ByRiskDriverExposure;
  by_initial_vector_detailed_exposure?: ByInitialVectorDetailedExposure;
  by_event_type_detailed_exposure?: ByEventTypeDetailedExposure;
  calibration_highlights?: CalibrationHighlights;
  by_cost_detailed_exposure?: ByCostDetailedExposure;
  by_duration_detailed_exposure?: ByDurationDetailedExposure;
  by_records_detailed_exposure?: ByRecordDetailedExposure;
  cost_components_breakdown?: CostComponentsBreakdown;
}

export interface QuantificationOld {
  by_scenario_exposure: ByScenarioExposureOld;
  overall_exposure: {
    ep_curve: EpPoint[];
    ep_curve1000?: EpPoint[];
    highlights: Highlights;
  };
  cis_recommendation?: CISRecommendation[];
  by_event_type_exposure?: ByEventTypeExposureOld;
  control_scenarios?: ControlScenarios;
  asset_group_information?: AssetGroupInformation;
  controls_average?: ControlsAverages;
  third_party_exposure?: {
    highlights: Highlights;
    ep_curve: EpPoint[];
  };
  insights?: ResultsInsights;
}

export type ControlsAverages = {
  [controlId in ControlType]?: number;
};

const eventTypesOld = [
  'data_breach',
  'interruption',
  'ransomware',
  'service_provider_interruption',
  'service_provider_data_breach',
] as const;

export type EventTypeOld = (typeof eventTypesOld)[number];

type ByEventTypeExposureOld = Record<
  EventTypeOld,
  {
    ep_curve: EpPoint[];
    highlights: Highlights;
  }
>;

export type ByEventTypeExposure = Record<BasicEventTypes, SimulationExposure>;

export type ByServiceProviderEventTypeExposure = Record<
  ServiceProviderEventTypes,
  SimulationExposure
>;

interface PastQuantificationOld {
  by_scenario_exposure: PastByScenarioExposure;
  overall_exposure: {
    ep_curve: EpPoint[];
    highlights: Highlights;
  };
}
export interface PastQuantification {
  risk_scenarios?: Record<RiskScenario, ByRiskScenario>;
  simulation_exposure: RichSimulationExposure;
  by_scenario_exposure: ByScenarioExposure;
}

export interface RiskTransfer {
  highlights: RiskTransferHighlightsData;
  deductible: number;
  limit: number;
}

interface RiskTransferHighlightsData {
  overall: string[];
  by_scenario_exposure: RiskTransferHighlightsByScenarioExposure;
}

export interface RiskTransferHighlightsByScenarioExposure {
  bi: string[];
  regulatory: string[];
  privacy: string[];
  liability: string[];
  contingent_bi: string[];
  extortion: string[];
}
export interface Tech {
  client_app: string[];
  cms: string[];
  db: string[];
  dns: string[];
  infrastructure: string[];
  IoT: string[];
  mail: string[];
  network_app: string[];
  os: string[];
  remote_access: string[];
  web: string[];
  voip: string[];
  storage: string[];
  security: string[];
  printer: string[];
  server_app: string[];
  camera: string[];
  plc_hardware: string[];
  analytics: string[];
  hmi_hardware: string[];
  rtu_hardware: string[];
  dcs_hardware: string[];
  scada_software: string[];
  hmi_software: string[];
  ftp: string[];
  proxy: string[];
  ssl: string[];
  ics_software: string[];
  wms_hardware: string[];
  iacs_hardware: string[];
  pam_software: string[];
  ied_hardware: string[];
  mes_software: string[];
}

export interface ServiceProvider {
  cdn: string[];
  cms: string[];
  crm: string[];
  dns: string[];
  email_vendor: string[];
  paas: string[];
}

export interface Hazard {
  technologies: Tech;
  providers: ServiceProvider;
}

export const QuantificationStatus = {
  Success: 'Success',
  Running: 'Running',
  Failed: 'Failed',
} as const;

export type QuantificationStatusList =
  (typeof QuantificationStatus)[keyof typeof QuantificationStatus];

interface InputData {
  vendor_data?: VendorData;
  sphere: SphereForm;
  sec_controls_framework?: SecControlsType;
  revenue?: number;
}

export interface QuantificationData {
  company_id: string;
  created_at: string;
  fq_type?: string;
  period?: string;
  id: string;
  input_data?: InputData; //& ZonesOfOperation & // SHOULD ADD THOSE BACK AFTER COMPLETEING THE BUILDER
  //BusinessProfileForm;
  hazard?: Hazard;
  status: (typeof QuantificationStatus)[keyof typeof QuantificationStatus];
  updated_at: string;
  risk_transfer: RiskTransfer;
  results?: QuantificationOld;
  results_narrative?: Quantification;
  model_version?: string;
}

export interface PastQuantificationData {
  items: PastQuantificationItem[];
  page: number;
  size: number;
  total: number;
}

export interface PastQuantificationItem {
  company_id: string;
  created_at: string;
  period: string;
  id: string;
  status: (typeof QuantificationStatus)[keyof typeof QuantificationStatus];
  updated_at: string;
  result: PastQuantificationOld;
  results_narrative?: Quantification;
  model_version: string;
  input_data?: InputData;
}

export interface QuantificationExportData {
  company_name: string;
  request_id: string;
  fq_type: string;
  input_data?: NewQuantificationForm & { sphere: SphereForm };
  hazard?: Hazard;
  tenant: string;
  currency: CurrencyCode;
  results?: QuantificationOld;
  results_narrative?: Quantification;
  sec_controls_framework?: SecControlsType;
}

export interface HazardNewRow {
  vendor: string;
  product: string;
  hazard_type: HazardItemType;
  product_type: string;
  is_global?: boolean;
}
