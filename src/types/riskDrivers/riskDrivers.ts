export const RiskDriverTypes = {
  event: 'event',
  attackVector: 'attackVector',
} as const;

export type RiskDriverType =
  (typeof RiskDriverTypes)[keyof typeof RiskDriverTypes];
