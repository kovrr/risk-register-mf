import { resources } from 'i18n';

export type CardTranslationPrefix =
  | keyof (typeof resources.en)['resultsNarrative']['materialityAnalysis']['thresholdCard']
  | `outageDuration.${keyof (typeof resources.en)['resultsNarrative']['materialityAnalysis']['thresholdCard']['outageDuration']}`;

export const ThresholdCardTypes = {
  DEFAULT: 'default',
  CUSTOM: 'custom',
} as const;
export type ThresholdCardType =
  (typeof ThresholdCardTypes)[keyof typeof ThresholdCardTypes];
