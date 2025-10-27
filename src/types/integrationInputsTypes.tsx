// Simplified integration input types for Risk Register microfrontend
export interface IntegrationTile {
  id: string;
  name: string;
  type: string;
  description?: string;
  enabled: boolean;
}

export const ROCIIntegrationTypes = {
  ALLOY: 'alloyscanlite',
  KOVRR: 'kovrr',
} as const;

export type ROCIIntegrationType =
  (typeof ROCIIntegrationTypes)[keyof typeof ROCIIntegrationTypes];
