import { EventTypes } from 'types/riskDrivers/eventTypes';
import { Scenario } from 'types/quantificationData';
import { RiskScenario } from 'types/security-controls';
import {
  SphereAssetGroupType,
  SphereDamageType,
  SphereSecurityProfileForm,
} from 'types/sphereForm';

export type BasicChangeType = number | string | boolean | null | undefined;
export type QuantificationId = string;
type JSONPatchOperation = 'add' | 'remove' | 'replace';
export type DetailedChange<T = BasicChangeType> = {
  op: JSONPatchOperation;
  path: string;
  value: T;
  previousValue: T;
};
export type FieldChanges<T = BasicChangeType> = {
  total_changes: number;
  actual_changes: DetailedChange<T>[];
  // Available changes:
  // Panorays
  custom_changes: string[];
};

export type SecurityProfileChanges = {
  control_changes: number;
  other_changes: number;
  total_affected_asset_groups: number;
  total_changed_security_profiles: number;
  changes_unavailable: boolean;
} & FieldChanges<SphereSecurityProfileForm | BasicChangeType>;
export type DamageTypeChanges = {
  total_affected_asset_groups: number;
  total_changed_damage_types: number;
  changes_unavailable: boolean;
} & FieldChanges<SphereDamageType | BasicChangeType>;

export type AssetGroupChanges = {
  creations: number;
  deletions: number;
  modifications: number;
  modified_asset_groups: number;
} & FieldChanges<SphereAssetGroupType | BasicChangeType>;

export type Changes = {
  security_profiles: SecurityProfileChanges;
  damage_types: DamageTypeChanges;
  company: FieldChanges;
  asset_groups: AssetGroupChanges;
};

export type SimulationExposureMetrics = {
  aal: number;
  high_exposure_loss: number;
};

export type ByEventTypeExposureMetrics = Record<
  EventTypes,
  SimulationExposureMetrics
>;

export type ByScenarioExposureMetrics = Record<
  Scenario,
  SimulationExposureMetrics
>;

export type ByScenarioMetrics = {
  aal_damage: number;
  pml_damage: number;
};

export type RiskScenariosMetrics = Record<RiskScenario, ByScenarioMetrics>;

export type FQMetrics = {
  id?: QuantificationId;
  model_version?: string;
  simulation_exposure?: SimulationExposureMetrics;
  by_event_type_exposure?: ByEventTypeExposureMetrics;
  by_scenario_exposure?: ByScenarioExposureMetrics;
  risk_scenarios?: RiskScenariosMetrics;
};

export type ChangeLogEntry = {
  date: Date;
  changes: Changes;
  current_run: FQMetrics;
  previous_run?: FQMetrics;
};

export type ChangeLog = {
  total: number;
  size: number;
  page: number;
  items: ChangeLogEntry[];
};
