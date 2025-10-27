import { ControlScenario } from './security-controls';

export const MSProductBundles = {
  BP: 'BP',
  E3: 'E3',
  E5: 'E5',
} as const;

export type MSProductBundle =
  (typeof MSProductBundles)[keyof typeof MSProductBundles];

export type ByMSBundleScenario = {
  current_status: MSProductBundle;
} & Omit<ControlScenario, 'current_status'>;

export type ByMSBundleToMinimal = Record<MSProductBundle, ByMSBundleScenario>;
