export const applicationTypes = {
  ROCI: 'roci',
  FOQUS: 'foqus',
} as const;

export type ApplicationType =
  (typeof applicationTypes)[keyof typeof applicationTypes];

export const applicationSubTypes = {
  CSPM: 'cspm',
  MS365: 'ms_365',
  PE_GUIDEPOINT: 'pe-guidepoint',
} as const;

export type ROCIApplicationSubType =
  (typeof applicationSubTypes)[keyof typeof applicationSubTypes];

export const foqusApplicationSubTypes = {
  FOQUS: 'foqus',
  RISK_REGISTER: 'risk_register',
} as const;

export type FoqusApplicationSubType =
  (typeof foqusApplicationSubTypes)[keyof typeof foqusApplicationSubTypes];

export type ApplicationSubType =
  | ROCIApplicationSubType
  | FoqusApplicationSubType;

// used by the foqus tenant hook
export type TenantApplicationData =
  | {
      application_type: typeof applicationTypes.FOQUS;
      application_sub_type?: FoqusApplicationSubType;
    }
  | {
      application_type: typeof applicationTypes.ROCI;
      application_sub_type: ROCIApplicationSubType;
    };

// used by the frontegg tenant hook
export type TenantMetadata = {
  parent_id: string;
} & TenantApplicationData;
