import { CisV8SafeguardsImplementation } from "@/options/cisV8Controls";
import { NistV2SafeguardsImplementation, ScaleEnum } from "@/options/nistV2Controls";

export enum SphereCreationStep {
  Welcome,
  EmployeesEndpoints,
  Infrastructure,
  Cloud,
  Security,
}

export enum spherePages {
  welcome = 'welcome',
  endpoints = 'endpoints',
  infra = 'infra',
  cloud = 'cloud',
  ot = 'ot',
  security = 'security',
  damageTypes = 'damageTypes',
}

export const enum DistributionType {
  Symmetrical = 'symmetrical',
  PositivelySkewed = 'positively_skewed',
  NegativelySkewed = 'negatively_skewed',
}
export interface SphereAssetGroup {
  group_name: string;
  isNew?: boolean;
  asset_group_id?: string;
}

export interface TechOption {
  label: string;
  value: string;
  type: string;
}

export interface SphereAssetGroupHazardProps extends SphereAssetGroup {
  os: string[];
  technologies_used?: string[];
}

export interface SphereEmployeesEndpointsAssetGroup
  extends SphereAssetGroupHazardProps {
  number_of_endpoints?: number;
  tech?: Tech[];
  pci_access?: boolean;
  phi_access?: boolean;
  pii_access?: boolean;
  other_sensitive_access?: boolean;
  productivity_reliance?: number;
  income_reliance?: number;
}
interface Tech {
  label: string;
  value: string;
  type: string;
}

export interface SphereInfraAssetGroup extends SphereAssetGroupHazardProps {
  tech?: Tech[];
  pci_stored?: number;
  phi_stored?: number;
  pii_stored?: number;
  other_sensitive_stored?: boolean;
  max_number_of_records_stored_together?: number;
  productivity_reliance?: number;
  income_reliance?: number;
}

export interface SphereCloudForm extends SphereAssetGroup {
  pci_stored?: number;
  phi_stored?: number;
  pii_stored?: number;
  providers_used?: string[];
  other_sensitive_stored?: boolean;
  productivity_reliance?: number;
  income_reliance?: number;
  max_number_of_records_stored_together?: number;
}

export type ImplementationLevel = { [key: string]: number };
type MultipleSelectionImplementationLevel = { [key: string]: number[] };
export const ISO27001BatteryOptionsArray = [-1, 0, 0.5, 1];
type ISO27001BatteryOptions = -1 | 0 | 0.5 | 1;
export type ISO27001ImplementationLevel = {
  Organizational: {
    'Organizational-1': ISO27001BatteryOptions;
    'Organizational-2': ISO27001BatteryOptions;
    'Organizational-3': ISO27001BatteryOptions;
    'Organizational-4': ISO27001BatteryOptions;
    'Organizational-5': ISO27001BatteryOptions;
    'Organizational-6': ISO27001BatteryOptions;
    'Organizational-7': ISO27001BatteryOptions;
    'Organizational-8': ISO27001BatteryOptions;
    'Organizational-9': ISO27001BatteryOptions;
    'Organizational-10': ISO27001BatteryOptions;
    'Organizational-11': ISO27001BatteryOptions;
    'Organizational-12': ISO27001BatteryOptions;
    'Organizational-13': ISO27001BatteryOptions;
    'Organizational-14': ISO27001BatteryOptions;
    'Organizational-15': ISO27001BatteryOptions;
    'Organizational-16': ISO27001BatteryOptions;
    'Organizational-17': ISO27001BatteryOptions;
    'Organizational-18': ISO27001BatteryOptions;
    'Organizational-19': ISO27001BatteryOptions;
    'Organizational-20': ISO27001BatteryOptions;
    'Organizational-21': ISO27001BatteryOptions;
    'Organizational-22': ISO27001BatteryOptions;
    'Organizational-23': ISO27001BatteryOptions;
    'Organizational-24': ISO27001BatteryOptions;
    'Organizational-25': ISO27001BatteryOptions;
    'Organizational-26': ISO27001BatteryOptions;
    'Organizational-27': ISO27001BatteryOptions;
    'Organizational-28': ISO27001BatteryOptions;
    'Organizational-29': ISO27001BatteryOptions;
    'Organizational-30': ISO27001BatteryOptions;
    'Organizational-31': ISO27001BatteryOptions;
    'Organizational-32': ISO27001BatteryOptions;
    'Organizational-33': ISO27001BatteryOptions;
    'Organizational-34': ISO27001BatteryOptions;
    'Organizational-35': ISO27001BatteryOptions;
    'Organizational-36': ISO27001BatteryOptions;
    'Organizational-37': ISO27001BatteryOptions;
  };
  People: {
    'People-1': ISO27001BatteryOptions;
    'People-2': ISO27001BatteryOptions;
    'People-3': ISO27001BatteryOptions;
    'People-4': ISO27001BatteryOptions;
    'People-5': ISO27001BatteryOptions;
    'People-6': ISO27001BatteryOptions;
    'People-7': ISO27001BatteryOptions;
    'People-8': ISO27001BatteryOptions;
  };
  Physical: {
    'Physical-1': ISO27001BatteryOptions;
    'Physical-2': ISO27001BatteryOptions;
    'Physical-3': ISO27001BatteryOptions;
    'Physical-4': ISO27001BatteryOptions;
    'Physical-5': ISO27001BatteryOptions;
    'Physical-6': ISO27001BatteryOptions;
    'Physical-7': ISO27001BatteryOptions;
    'Physical-8': ISO27001BatteryOptions;
    'Physical-9': ISO27001BatteryOptions;
    'Physical-10': ISO27001BatteryOptions;
    'Physical-11': ISO27001BatteryOptions;
    'Physical-12': ISO27001BatteryOptions;
    'Physical-13': ISO27001BatteryOptions;
    'Physical-14': ISO27001BatteryOptions;
  };
  Technological: {
    'Technological-1': ISO27001BatteryOptions;
    'Technological-2': ISO27001BatteryOptions;
    'Technological-3': ISO27001BatteryOptions;
    'Technological-4': ISO27001BatteryOptions;
    'Technological-5': ISO27001BatteryOptions;
    'Technological-6': ISO27001BatteryOptions;
    'Technological-7': ISO27001BatteryOptions;
    'Technological-8': ISO27001BatteryOptions;
    'Technological-9': ISO27001BatteryOptions;
    'Technological-10': ISO27001BatteryOptions;
    'Technological-11': ISO27001BatteryOptions;
    'Technological-12': ISO27001BatteryOptions;
    'Technological-13': ISO27001BatteryOptions;
    'Technological-14': ISO27001BatteryOptions;
    'Technological-15': ISO27001BatteryOptions;
    'Technological-16': ISO27001BatteryOptions;
    'Technological-17': ISO27001BatteryOptions;
    'Technological-18': ISO27001BatteryOptions;
    'Technological-19': ISO27001BatteryOptions;
    'Technological-20': ISO27001BatteryOptions;
    'Technological-21': ISO27001BatteryOptions;
    'Technological-22': ISO27001BatteryOptions;
    'Technological-23': ISO27001BatteryOptions;
    'Technological-24': ISO27001BatteryOptions;
    'Technological-25': ISO27001BatteryOptions;
    'Technological-26': ISO27001BatteryOptions;
    'Technological-27': ISO27001BatteryOptions;
    'Technological-28': ISO27001BatteryOptions;
    'Technological-29': ISO27001BatteryOptions;
    'Technological-30': ISO27001BatteryOptions;
    'Technological-31': ISO27001BatteryOptions;
    'Technological-32': ISO27001BatteryOptions;
    'Technological-33': ISO27001BatteryOptions;
    'Technological-34': ISO27001BatteryOptions;
  };
};
type SecondLayerKeys<T> = {
  [K in keyof T]: keyof T[K];
}[keyof T];

export type ISO27001ControlNumbersType =
  SecondLayerKeys<ISO27001ImplementationLevel>;

export const ISO27001ControlsToNumbers = {
  Organizational: '5',
  People: '6',
  Physical: '7',
  Technological: '8',
} as const;

export type ISOCategoryType = keyof typeof ISO27001ControlsToNumbers;

export type ISO27001ControlSectionsType = keyof ISO27001ImplementationLevel;
type BaseSecurityForm = {
  certificates: string[];
  outage_hours_to_material_impact?: number;
  hours_to_restore_critical_business_ops_after_interruption?: number;
  control_scope?: 'category' | 'control';
  scale?: ScaleEnum;
};

export type SphereSecurityForm = BaseSecurityForm & {
  cis_implementation_level?: ImplementationLevel;
  nist_implementation_level?: ImplementationLevel;
  nist_v2_implementation_level_igs?: NistV2SafeguardsImplementation;
  nist_v2_safeguard_implementation?: NistV2SafeguardsImplementation;
  asb_implementation_level?: MultipleSelectionImplementationLevel;
  iso27001_implementation_level?: ISO27001ImplementationLevel;
  cis_v8_implementation_level_igs?: ImplementationLevel;
  cis_v8_implementation_level_safeguards?: CisV8SafeguardsImplementation;
} & (
    | { cis_implementation_level: ImplementationLevel }
    | { nist_implementation_level: ImplementationLevel }
    | { nist_v2_implementation_level_igs: NistV2SafeguardsImplementation }
    | { nist_v2_safeguard_implementation: NistV2SafeguardsImplementation }
    | { asb_implementation_level: MultipleSelectionImplementationLevel }
    | { iso27001_implementation_level: ISO27001ImplementationLevel }
    | { cis_v8_implementation_level_igs: ImplementationLevel }
    | { cis_v8_implementation_level_safeguards: CisV8SafeguardsImplementation }
  );

export type SecurityFormLegacy = BaseSecurityForm & {
  cis_implementation_level?: ImplementationLevel;
  nist_implementation_level?: ImplementationLevel;
  asb_implementation_level?: MultipleSelectionImplementationLevel;
  iso27001_implementation_level?: ISO27001ImplementationLevel;
};

export type SphereSecurityProfileForm = Omit<
  SphereSecurityForm,
  'certificates'
> & {
  asset_groups: { name: string; type: string; id?: string }[];
  profile_name: string;
  ms_product_bundle?: 'E3' | 'E5' | 'None';
  id?: string;
};

export interface SphereOTForm extends SphereAssetGroupHazardProps {
  devices_connected_to_internal_network?: boolean;
  productivity_reliance?: number;
  income_reliance?: number;
  hours_to_restore_critical_business_ops_after_interruption?: number;
  device_restoration_cost_associated?: boolean;
  severity_min?: number;
  severity_average?: number;
  severity_max?: number;
  distribution_type?: DistributionType;
  collateral_damage_cost_associated?: boolean;
  liability_cost_associated?: boolean;
  average_life_cycle_of_critical_devices?: number;
  quality_control_process_associated?: boolean;
}

export type SphereAssetGroupType =
  | SphereEmployeesEndpointsAssetGroup
  | SphereInfraAssetGroup
  | SphereCloudForm;

export interface SphereDamageType {
  cc_name: string;
  cost_dist: {
    min_val: number;
    mode_val: number;
    max_val: number;
  };
  event_type: string;
  impact_scenario: string;
  asset_groups?: { name: string; type: string; id?: string }[];
  id?: string;
}

export interface SphereForm {
  employee_endpoints: SphereEmployeesEndpointsAssetGroup[];
  infrastructure: SphereInfraAssetGroup[];
  cloud: SphereCloudForm[];
  ot?: SphereOTForm[];
  security: SecurityFormLegacy;
  security_profiles?: SphereSecurityProfileForm[] | null;
  custom_cost_components?: SphereDamageType[];
  // security scores
  bitsight_security_rating?: number;
  security_scorecard_security_rating?: number;
}

export const sphereAssetGroupSteps = [
  'employee_endpoints',
  'infrastructure',
  'cloud',
  'ot',
] as const;
export type SphereAssetGroupStep = (typeof sphereAssetGroupSteps)[number];
const assetGroupTypes = [
  'employee_endpoints',
  'infrastructure',
  'cloud',
  'ot',
] as const;
export type AssetGroupType = (typeof assetGroupTypes)[number];
// Remove these types once we finish this task
// https://kovrr.atlassian.net/browse/KOV-5456
const extendedAssetGroupTypes = [...assetGroupTypes, 'infra', 'endpoints'];
export type ExtendedAssetGroupType = (typeof extendedAssetGroupTypes)[number];
export const SphereKeysByAssetGroupType = {
  endpoints: 'employee_endpoints',
  infra: 'infrastructure',
} as const;

type ErrorTextLocation = string;
type ErrorAssetGroupLocation = number;
// type ErrorSphereStepLocation = keyof SphereForm;
type ErrorLocResponse = [
  ErrorTextLocation,
  ErrorTextLocation,
  ErrorTextLocation,
  ErrorAssetGroupLocation,
  ...(ErrorTextLocation | ErrorAssetGroupLocation)[],
];
export interface ErrorDetails {
  loc: ErrorLocResponse;
  msg: string;
  type: string;
}
export interface Response422 {
  status: number;
  data: {
    detail: ErrorDetails[];
  };
}

export interface PanoraysSubCategory {
  name: string;
  text: string;
  grade: number;
}

export interface PanoraysCategory {
  name: string;
  text: string;
  grade: number;
  sub_categories: PanoraysSubCategory[];
}

export interface PanoraysPosture {
  id: string;
  grade: number;
  categories: PanoraysCategory[];
}

interface SecurityScores {
  bitsight_security_rating: number | null;
  security_scorecard_security_rating: number | null;
  panorays_security_rating: number | null;
}

interface VendorIds {
  panorays_id: string;
}

interface VendorPostures {
  panorays_posture: PanoraysPosture;
}

export interface VendorData {
  security_scores: SecurityScores;
  postures: VendorPostures;
  ids: VendorIds;
}
