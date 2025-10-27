import type { resources } from '../i18n';

// Using the actual i18n resources for type safety
export type IntegrationTile =
  (typeof resources.en)['roci']['companyCreation']['steps']['stepFour']['form']['fields']['integrationType']['integrations'][number];

export const ROCIIntegrationTypes = {
  ALLOY: 'alloyscanlite',
  KOVRR: 'kovrr',
} as const;

export type ROCIIntegrationType =
  (typeof ROCIIntegrationTypes)[keyof typeof ROCIIntegrationTypes];

export const AutoIntegrationType = {
  TANIUM: 'tanium',
  SERVICENOW: 'servicenow',
  TENABLE: 'tenable',
  CROWDSTRIKE: 'crowdstrike',
  QUALYS: 'qualys',
  BITSIGHT: 'bitsight',
} as const;

export const IntegrationType = {
  ...AutoIntegrationType,
  MICROSOFT: 'microsoft',
  PANASEER: 'panaseer',
  AXONIUS: 'axonius',
  CYBERGRX: 'cybergrx',
  FORESCOUT: 'forescout',
  RAPID7: 'rapid7',
  SECURITY_SCORECARD: 'securityscorecard',
  CUSTOM: 'custom',
} as const;

export type AutoIntegrationTypes =
  (typeof AutoIntegrationType)[keyof typeof AutoIntegrationType];

export type IntegrationTypes =
  (typeof IntegrationType)[keyof typeof IntegrationType];

export type IntegrationDataMap = {
  [IntegrationType.SECURITY_SCORECARD]: any;
  [IntegrationType.TANIUM]: never;
  [IntegrationType.SERVICENOW]: never;
  [IntegrationType.TENABLE]: never;
  [IntegrationType.CROWDSTRIKE]: never;
  [IntegrationType.QUALYS]: never;
  [IntegrationType.BITSIGHT]: never;
  [IntegrationType.MICROSOFT]: never;
  [IntegrationType.PANASEER]: never;
  [IntegrationType.AXONIUS]: never;
  [IntegrationType.CYBERGRX]: never;
  [IntegrationType.FORESCOUT]: never;
  [IntegrationType.RAPID7]: never;
  [IntegrationType.CUSTOM]: never;
};

export type IntegrationData<T extends IntegrationTypes> = IntegrationDataMap[T];
