import { EventTypes } from './riskDrivers/eventTypes';
import { ControlFrequencyEffect, EventTypeOld } from './quantificationData';

export interface HazardDistributionOld {
  [key: string]: HazardDistributionValuesOld;
}

export interface HazardDistributionValuesOld {
  general_hazard_stats: Stats;
  total_cost: number;
  most_severe_event: {
    event_cost: number;
    event_type: string;
    attack_vector: string;
    event_description: string;
  };
  hazard_share_in_simulation: number;
  frequency_in_simulation: number;
  frequency_by_event_type: Partial<Record<EventTypes, number>>;
  frequency_score?: number;
}

export interface Transparency {
  final_lambdas?: Lambdas; // deprecated, use final_frequency instead.
  base_lambdas: Lambdas;
  post_frequency?: Lambdas;
  final_frequency?: Lambdas;
  control_frequency_effect?: {
    [controlId: string]: Lambdas;
  };
  cat_intensity_parameter_statistics: {
    data_scale: ParameterStatisticsValues;
    duration: ParameterStatisticsValues;
    effect_rate?: ParameterStatisticsValues;
  };
  targeted_intensity_parameter_statistics: {
    data_scale: ParameterStatisticsValues;
    duration: ParameterStatisticsValues;
    effect_rate?: ParameterStatisticsValues;
  };
  lambda_adjustments?: {
    // Deprecated, using control_frequency_effect
    [key: string]: Lambdas | { [key: string]: Lambdas } | null;
  };
  event_example: {
    company_name: string;
    industry: string;
    date: string;
    event_type: string;
    event_duration_hours: number;
    actor_name: string;
    cost: number;
    compromised_data_type: string;
    data_amount: number;
    impact_scenarios: string[];
    link: string;
    image_link: string;
    description: string;
    attack_vector?: string;
  };
  event_cause_distribution?:
    | { [key: string]: { [key: string]: number } }
    | string[];
  event_cause_distribution_extend?: Event[];
  hazard_distribution?: HazardDistributionOld;
  event_severity_distribution?: ParameterStatistics;
  frequency_data?: { number_of_events: number; number_of_data_sources: number };
  all_events_stats?: {
    [key: string]: ParameterStatisticsValues;
  };
  num_events_that_caused_damage?: {
    provider: number;
    tech: number;
    targeted: number;
  };
  third_party_distribution: ThirdPartyInsights;
}

export interface ThirdPartyInsights {
  criticality: ThirdPartyInsightStats;
  data_records: ThirdPartyInsightStats;
}

export interface ThirdPartyInsightStats {
  cloud: number;
  infrastructure: number;
}

interface Event {
  name: string;
  probability: number;
  event_type: string;
  mitre_id: string;
}

interface Stats {
  mean: number;
  median: number;
  max: number;
  std: number;
  percentiles: {
    [key: string]: number;
  };
}

export interface FrequencyDataType {
  number_of_events: number;
  number_of_data_sources: number;
}

export type Lambdas = Record<EventTypeOld, number>;

export interface EventExample {
  attack_vector?: string;
  company_name: string;
  industry: string;
  date: string;
  event_type: string;
  event_duration_hours: number;
  actor_name: string;
  cost: number;
  compromised_data_type: string;
  data_amount: number;
  impact_scenarios: string[];
  link: string;
  image_link: string;
  description: string;
}

export interface ParameterStatistics {
  [key: string]: ParameterStatisticsValues;
}

export interface ParameterStatisticsValues {
  mean: number;
  median: number;
  std: number;
  max: number;
  percentiles: { [key: string]: number };
}

export interface EffectsOnLikelihood {
  annual_rates: Partial<
    Record<
      EventTypes,
      { targeted_annual_rate: number; targeted_benchmark_annual_rate: number }
    >
  >;
  control_frequency_effect?:
    | ControlFrequencyEffect
    | { [controlId: string]: Lambdas };
  lambda_adjustments?: {
    [key: string]: Lambdas | { [key: string]: Lambdas } | null;
  };
}
