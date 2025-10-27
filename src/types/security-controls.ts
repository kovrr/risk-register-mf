import { ISO27001FormInitialValues } from '@/security/ISO/formInitialValues';
import {
  SecControlsFramework,
  type SecControlsFrameworkType,
} from 'options/constants';

export type RiskScenario = 'BASELINE' | 'MINIMAL';

export interface ControlScenario {
  aal_damage: number;
  aal_effect: number;
  pml_damage: number;
  pml_effect: number;
  average_damage?: number;
  average_effect?: number;
  current_status: string;
  by_minimal_new_average?: number;
  metadata?: { [k in string]?: unknown };
}

export interface ByRiskScenario
  extends Omit<ControlScenario, 'current_status'> {
  current_status?: RiskScenario;
}

export const cisControlsByOrder = ['disabled', 'ig1', 'ig2', 'ig3'] as const;
export type OrderedCisControl = (typeof cisControlsByOrder)[number];

export type ControlStatus =
  | 'not_implemented'
  | 'not implemented'
  | 'disabled'
  | 'unknown'
  | 'ig1'
  | 'ig2'
  | 'ig3'
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 0.5
  | -1;

export const ControlDomainScenarios = ['all_enabled', 'all_disabled'] as const;
export type ControlDomainScenario = (typeof ControlDomainScenarios)[number];

export const ASBCategories = [
  'NS',
  'IM',
  'PA',
  'DP',
  'AM',
  'LT',
  'IR',
  'PV',
  'ES',
  'BR',
  'DS',
  'GS',
] as const;

export type ASBCategory = (typeof ASBCategories)[number];

export interface ByControlDomainScenario {
  control_domain_scenario: ControlDomainScenario;
  current_status?: { [key: string]: boolean };
  target_status?: { [key: string]: boolean };
}

const defaultStatusText = {
  not_implemented: 'Not Implemented',
  'not implemented': 'Not Implemented',
  unknown: 'Unknown',
  disabled: 'Not Implemented',
  ig1: 'IG1',
  ig2: 'IG2',
  ig3: 'IG3',
  //this is needed because we receive nist statuses as numbers,
  //and cis statuses as text...
  0: 'Unknown',
  1: 'Initial',
  2: 'Repeatable',
  3: 'Defined',
  4: 'Managed',
  5: 'Optimized',
  // ISO-specific values (included in default for type compatibility)
  0.5: 'Partially Implemented',
  '-1': 'Not Applicable',
};

const isoStatusText = {
  ...defaultStatusText,
  // Override specific ISO values
  0: 'Not Implemented',
  1: 'Implemented',
} as any as Record<ControlStatus, string>;

export const CONTROL_STATUS_TO_TEXT: Record<
  SecControlsFrameworkType,
  Record<ControlStatus, string>
> = {
  [SecControlsFramework.CIS]: defaultStatusText,
  [SecControlsFramework.NIST]: defaultStatusText,
  [SecControlsFramework.NIST_CSF_v2]: defaultStatusText,
  [SecControlsFramework.ASB]: defaultStatusText,
  [SecControlsFramework.ISO27001]: isoStatusText,
  [SecControlsFramework.CISv8]: defaultStatusText,
};

export type ByAssetGroup = {
  [asset_group_id: string]: {
    [control_name: string]: {
      [control_status: string]: ControlScenario;
    };
  };
};

export type ByControlToMinimal = {
  [control_name: string]: {
    [control_status: string]: ControlScenario;
  };
};

export type ByControlDomainScenarios = {
  [k in ASBCategory]: { ControlDomainScenario: ByControlDomainScenario };
};

export const cisControlIds = [
  'ICHA',
  'ICSA',
  'MD',
  'DP',
  'CVM',
  'CUAP',
  'SCHS',
  'MMAAL',
  'EWBP',
  'LCNPPS',
  'DRC',
  'SCND',
  'BD',
  'CAB',
  'WAC',
  'AMC',
  'ISA',
  'ASS',
  'IRM',
  'PTRT',
] as const;

export const nistControlIds = [
  'ID_AM',
  'ID_BE',
  'ID_GV',
  'ID_RA',
  'ID_RM',
  'ID_SC',
  'PR_AC',
  'PR_AT',
  'PR_DS',
  'PR_IP',
  'PR_MA',
  'PR_PT',
  'DE_AE',
  'DE_CM',
  'DE_DP',
  'RS_RP',
  'RS_CO',
  'RS_AN',
  'RS_MI',
  'RS_IM',
  'RC_RP',
  'RC_IM',
  'RC_CO',
] as const;

export const cisV8Ids = [
  'ICEA',
  'ICSA',
  'DP',
  'SCEAS',
  'AM',
  'ACM',
  'CVM',
  'ALM',
  'EWBP',
  'MD',
  'DR',
  'NIM',
  'NMD',
  'SAST',
  'SPM',
  'ASS',
  'IRM',
  'PT',
] as const;

const controlTypes = [
  ...cisControlIds,
  ...nistControlIds,
  ...Object.keys(ISO27001FormInitialValues),
  ...cisV8Ids,
] as const;
export type ControlType = (typeof controlTypes)[number];

export const ignoredCurrentMinimums = {
  [SecControlsFramework.NIST]: new Set(['0', 'unknown', 'ig3', '5']),
  [SecControlsFramework.NIST_CSF_v2]: new Set(['0', 'unknown', 'ig3', '5']),
  [SecControlsFramework.CIS]: new Set(['0', 'unknown', 'ig3', '5']),
  [SecControlsFramework.CISv8]: new Set(['0', 'unknown', 'ig3', '5']),
  [SecControlsFramework.ASB]: new Set(['']),
  [SecControlsFramework.ISO27001]: new Set(['-1', '1']),
};
