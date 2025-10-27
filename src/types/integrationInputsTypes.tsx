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
