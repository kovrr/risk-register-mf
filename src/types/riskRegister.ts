import type { CisV7SafeguardsImplementation } from '@/options/cisControls';
import type { CisV8SafeguardsImplementation } from '@/options/cisV8Controls';
import type { CurrencyCodeType } from '@/options/constants';
import type { NistV2SafeguardsImplementation } from '@/options/nistV2Controls';
import type { SecControlsType } from './companyForm';
import type {
  ControlScenarios,
  CostComponentsBreakdown,
  LeanSimulationExposure,
} from './quantificationData';
import type {
  ImplementationLevel,
  ISO27001ImplementationLevel,
} from './sphereForm';

export const riskRegisterLikelihoods = {
  Expected: 'Expected',
  Likely: 'Likely',
  Possible: 'Possible',
  Unlikely: 'Unlikely',
  Rare: 'Rare',
} as const;

export type RiskRegisterLikelihood = keyof typeof riskRegisterLikelihoods;

export const riskRegisterImpacts = {
  Negligible: 'Negligible',
  Minor: 'Minor',
  Moderate: 'Moderate',
  Significant: 'Significant',
  Severe: 'Severe',
} as const;

export type RiskRegisterImpact = keyof typeof riskRegisterImpacts;

export const riskRegisterPriorities = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
  Critical: 'Critical',
} as const;

export type RiskRegisterPriority = keyof typeof riskRegisterPriorities;

export const riskRegisterResponsePlans = {
  Mitigate: 'Mitigate',
  Accept: 'Accept',
  Transfer: 'Transfer',
  Avoid: 'Avoid',
} as const;

export type RiskRegisterResponsePlan = keyof typeof riskRegisterResponsePlans;

export const riskRegisterRiskOrigins = {
  TrainingData: 'Training Data',
  ModelArchitecture: 'Model Architecture',
  DevelopmentProcess: 'Development Process',
  DeploymentEnvironment: 'Deployment Environment',
  UserInteraction: 'User Interaction',
  ThirdParty: 'Third-Party',
  ExternalThreatActors: 'External Threat Actors',
  OrganizationalProcesses: 'Organizational Processes',
  RegulatoryChanges: 'Regulatory Changes',
  TechnologyLimitations: 'Technology Limitations',
  HumanError: 'Human Error',
} as const;

export type RiskOrigin = keyof typeof riskRegisterRiskOrigins;

export const riskRegisterAILifecyclePhases = {
  PlanningAndDesign: 'Planning & Design',
  DataCollectionAndPreparation: 'Data Collection & Preparation',
  ModelDevelopmentAndTraining: 'Model Development & Training',
  ValidationAndTesting: 'Validation & Testing',
  Deployment: 'Deployment',
  OperationAndMonitoring: 'Operation & Monitoring',
  MaintenanceAndUpdates: 'Maintenance & Updates',
  Decommissioning: 'Decommissioning',
} as const;

export type AILifecyclePhase = keyof typeof riskRegisterAILifecyclePhases;

export const riskRegisterStakeholderTypes = {
  EndUsers: 'End Users (Prospects and Customers)',
  Employees: 'Employees',
  Organization: 'Organization / Company',
  VulnerableGroups: 'Vulnerable Groups',
  ChildrenMinors: 'Children/Minors',
  SocietyAtLarge: 'Society at Large',
  Environment: 'Environment',
  Shareholders: 'Shareholders',
  Regulators: 'Regulators',
  ThirdPartyPartners: 'Third-Party Partners',
} as const;

export type StakeholderType = keyof typeof riskRegisterStakeholderTypes;

export type RiskOwner = {
  id: string;
  email: string;
  active_tenant: string;
  tenant_ids: string[];
};

export type RiskRegisterRow = {
  id: string;
  scenarioId: string;
  version: number;
  customerScenarioId: string;
  scenario: null;
  scenarioTitle: string;
  scenarioDescription: string;
  entity?: string;
  company_id?: string;
  company_name?: string | null;
  category?: string | null;
  likelihood: RiskRegisterLikelihood;
  impact: RiskRegisterImpact;
  annualLikelihood?: number;
  averageLoss?: number;
  averageLossCurrency?: CurrencyCodeType;
  priority?: RiskRegisterPriority;
  responsePlan?: RiskRegisterResponsePlan;
  lastUpdated: string;
  owner?: string;
  scenarioType: ScenarioType;
  status: ScenarioStatus;
  tableOptions: null;
  crqData?: CRQData;
};

export type ControlsFrameworkLevelsServer = {
  cis_implementation_level: ImplementationLevel;
  cis_v7_safeguards: CisV7SafeguardsImplementation;
  nist_implementation_level: ImplementationLevel;
  iso27001_implementation_level: ISO27001ImplementationLevel;
  cis_v8_implementation_level_igs: ImplementationLevel;
  cis_v8_safeguards: CisV8SafeguardsImplementation;
  nist_v2_safeguard_implementation: NistV2SafeguardsImplementation;
  tisax_implementation_level: ImplementationLevel;
  relevant_cis_controls: string[];
  relevant_nist_controls: string[];
  relevant_nist_v2_controls: string[];
  relevant_iso27001_controls: string[];
  relevant_cis_v8_controls: string[];
  relevant_cis_v8_safeguards: string[];
  relevant_cis_v7_safeguards: string[];
  relevant_tisax_controls: string[];
};

export type ControlsFrameworkLevels = {
  cis_implementation_level: ImplementationLevel;
  cis_v7_safeguards: ImplementationLevel;
  nist_implementation_level: ImplementationLevel;
  iso27001_implementation_level: ImplementationLevel;
  cis_v8_implementation_level_igs: ImplementationLevel;
  cis_v8_safeguards: ImplementationLevel;
  nist_v2_safeguard_implementation: ImplementationLevel;
  tisax_implementation_level: ImplementationLevel;
  relevant_cis_controls: Set<string>;
  relevant_nist_controls: Set<string>;
  relevant_nist_v2_controls: Set<string>;
  relevant_iso27001_controls: Set<string>;
  relevant_cis_v8_controls: Set<string>;
  relevant_cis_v8_safeguards: Set<string>;
  relevant_cis_v7_safeguards: Set<string>;
  relevant_tisax_controls: Set<string>;
};

export type CRQScenarioFilters = {
  initial_vector_filter: string[] | null;
  event_type_filter: string[] | null;
  impact_type_filter: string[] | null;
  asset_groups_filter: string[] | null;
  duration_percentiles_filter_min_value: number | null;
  duration_percentiles_filter_max_value: number | null;
  affected_records_percentiles_filter_min_val: number | null;
  affected_records_percentiles_filter_max_val: number | null;
  min_damage_filter: number | null;
  max_damage_filter: number | null;
  min_number_of_records_filter: number | null;
  max_number_of_records_filter: number | null;
  min_duration_filter: number | null;
  max_duration_filter: number | null;
};

type ExampleEvent = {
  event_loss: number;
  event_type: string;
  hazard_category: string;
  event_duration: number;
  num_of_data_records_compromised: number;
  event_description: string;
};

export type ExampleEvents = {
  median?: ExampleEvent;
  maximum?: ExampleEvent;
};

export type CRQScenarioResults = {
  control_scenarios?: ControlScenarios;
  cost_components_breakdown?: CostComponentsBreakdown;
  example_events?: ExampleEvents;
  lean_simulation_exposure?: LeanSimulationExposure;
};

export type CRQData = {
  company_id: string;
  fq_id?: string;
  filters: Partial<CRQScenarioFilters>;
  results?: CRQScenarioResults;
  is_crq_up_to_date: boolean;
};

export const scenarioTypes = {
  MANUAL: 'manual',
  CRQ: 'crq',
} as const;

export type ScenarioType = (typeof scenarioTypes)[keyof typeof scenarioTypes];

export const customFieldTypes = {
  CURRENCY: 'currency',
  NUMBER: 'number',
  TEXT: 'text',
  DATE: 'date',
  TAGS: 'tags',
} as const;

export type CustomFieldType =
  (typeof customFieldTypes)[keyof typeof customFieldTypes];

export type CustomField = {
  id: string;
  field_name: string;
  field_type: CustomFieldType;
  attributes?: Record<string, any>;
  value?: any;
};

export type ScenarioData = {
  likelihood: RiskRegisterLikelihood;
  impact: RiskRegisterImpact;
  company_id?: string;
  annual_likelihood?: number;
  peer_base_rate?: number;
  average_loss?: number;
  average_loss_currency?: CurrencyCodeType;
  impact_distribution?: ImpactDistribution;
  risk_priority?: RiskRegisterPriority;
  response_plan?: RiskRegisterResponsePlan;
  risk_owner?: string;
  ticket?: string;
  methodology_insights?: string;
  relevant_controls: ControlsFrameworkLevelsServer;
  sec_controls_framework?: SecControlsType;
  crq_data?: CRQData;
  sub_category?: string;
  review_date?: string;
  mitigation_cost?: number;
  custom_fields?: CustomField[];
  scenario_category?: string[];
  risk_subcategory?: string[];
  ai_assets?: string[];
  tactics?: string[];
  event_types?: string[];
  impact_types?: string[];
  data_exposure?: {
    pii?: number;
    pci?: number;
    phi?: number;
  };
  entity?: string;
  risk_origin?: string[];
  ai_lifecycle?: string[];
  stakeholders_affected?: string[];
};

export const scenarioStatus = {
  COMPLETED: 'completed',
  // IN_PROGRESS: 'in_progress',
  // PENDING: 'pending',
} as const;

export type ScenarioStatus =
  (typeof scenarioStatus)[keyof typeof scenarioStatus];

export type RiskRegisterResponse = {
  id: string;
  scenario_id: string;
  tenant_id: string;
  version: number;
  customer_scenario_id: string;
  name: string;
  description: string;
  group_id?: string;
  scenario_data: ScenarioData;
  notes: NoteOutput[];
  created_at: string;
  updated_at: string;
  scenario_type: ScenarioType;
  status: ScenarioStatus;
  company_name?: string | null;
};

export interface MetricDataPoint {
  timestamp: string;
  annual_likelihood: number | null;
  average_loss: number | null;
  version: number;
  currency: string | null;
  fq_id: string;
  targeted_benchmark_annual_rate: number | null;
}

export interface ScenarioMetricsHistory {
  scenario_id: string;
  metrics_history: MetricDataPoint[];
}

// Raw API response structure
export type RiskRegisterScenarioPaginatedApiResponse = {
  success: boolean;
  data: {
    group_ids?: string[];
    scenarios: RiskRegisterResponse[];
    total_count: number;
  };
  error: null | string;
};

// Normalized response type used throughout the app
export type RiskRegisterScenarioPaginatedResponse = {
  items: RiskRegisterResponse[];
  total: number;
  page?: number;
  size?: number;
};

export type ImpactDistribution = {
  ninety_nine: number;
  seventy_five: number;
  fifty: number;
  twenty_five: number;
  one: number;
};

export type ScenarioCreateRequest = {
  customer_scenario_id: string;
  name: string;
  description: string;
  likelihood: RiskRegisterLikelihood;
  impact: RiskRegisterImpact;
  group_id?: string;
  company_id?: string;
  annual_likelihood?: number;
  peer_base_rate?: number;
  average_loss?: number;
  average_loss_currency?: CurrencyCodeType;
  impact_distribution?: ImpactDistribution;
  sub_category?: string;
  review_date?: string;
  mitigation_cost?: number;
  scenario_category?: string[];
  ai_assets?: string[];
  tactics?: string[];
  event_types?: string[];
  impact_types?: string[];
  data_exposure?: {
    pii?: number;
    pci?: number;
    phi?: number;
  };
  entity?: string;
  risk_origin?: string[];
  ai_lifecycle?: string[];
  stakeholders_affected?: string[];
};

export type CRQScenarioCreateRequest = ScenarioCreateRequest & {
  crq_data: CRQData;
};

export type BaseScenarioUpdateRequest = {
  risk_priority?: RiskRegisterPriority;
  response_plan?: RiskRegisterResponsePlan;
  risk_owner?: string;
  ticket?: string;
  methodology_insights?: string;
  relevant_controls?: ControlsFrameworkLevelsServer;
  custom_fields?: CustomField[];
} & ScenarioCreateRequest;

export type SimpleScenarioUpdateRequest = BaseScenarioUpdateRequest & {
  scenario_type: typeof scenarioTypes.MANUAL;
};

export type CRQScenarioUpdateRequest = {
  scenario_type: typeof scenarioTypes.CRQ;
  crq_data?: CRQData;
} & BaseScenarioUpdateRequest;

export type DocumentOutput = {
  id: string;
  filename: string;
};

export type NoteOutput = {
  id: string;
  content: string;
  user: string;
  created_at: string;
  updated_at: string;
  documents: DocumentOutput[];
};
