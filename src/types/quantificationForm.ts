export enum ECISControl {
  NOT_IMPLEMENTED = -1,
  UNKNOWN = 0,
  IG1 = 1,
  IG2 = 2,
  IG3 = 3,
}

export const MAP_CIS_TEXT = {
  [ECISControl.NOT_IMPLEMENTED]: 'Not Implemented',
  [ECISControl.UNKNOWN]: 'Unknown',
  [ECISControl.IG1]: 'IG1',
  [ECISControl.IG2]: 'IG2',
  [ECISControl.IG3]: 'IG3',
};

export const ECISv8Control = {
  NOT_IMPLEMENTED: 0,
  MINIMALLY: 0.1,
  PARTIALLY: 0.5,
  MOSTLY: 0.7,
  FULLY: 1,
};

export enum ENISTControl {
  UNKNOWN = 0,
  INITIAL = 1,
  REPEATABLE = 2,
  DEFINED = 3,
  MANAGED = 4,
  OPTIMIZED = 5,
}

export const MAP_TEXT_CIS: { [key: string]: ECISControl } = {
  'not implemented': ECISControl.NOT_IMPLEMENTED,
  not_implemented: ECISControl.NOT_IMPLEMENTED,
  disabled: ECISControl.NOT_IMPLEMENTED,
  unknown: ECISControl.UNKNOWN,
  ig1: ECISControl.IG1,
  ig2: ECISControl.IG2,
  ig3: ECISControl.IG3,
};

export interface MultipleSelectType {
  label: string;
  value: string;
}

export interface DataRecordsForm {
  pii: string;
  pci: string;
  phi: string;
  otherTypes: string;
  storedTogether: number;
}

export interface RegulationForm {
  securityCertifications?: string[];
  securityMechanisms: { [key: string]: number };
  regulatoryRequirements?: string[];
}

export interface RelianceOnNetworkForm {
  restoreHours?: number;
  productivityPercentage?: number;
  incomePercentage?: number;
  outageDuration?: number;
  endpoints?: number;
}

export interface CyberInsuranceForm {
  deductible?: number;
  limit?: number;
  attachmentPoint?: number;
  premium?: number;
}

export interface PastEventsRow {
  damageType: string;
  financialLoss: number;
  details: string;
  date: string;
}

export interface NewQuantificationForm {
  dataRecords: DataRecordsForm;
  regulation: RegulationForm;
  relianceOnNetwork: RelianceOnNetworkForm;
  cyberInsurance: CyberInsuranceForm;
  pastEvents: PastEventsRow[];
}
