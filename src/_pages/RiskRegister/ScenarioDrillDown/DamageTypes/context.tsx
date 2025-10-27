import { createContext } from 'react';
import { DamageTypesExposure } from './common/ExposureParameter';

export type ContextPropsType = {
  exposure: DamageTypesExposure;
  isClickable: boolean;
  showBenchmarks: boolean;
  showSeeAll?: boolean;
  limitVectors?: boolean;
  vectorsFlexGap?: string;
  customCostComponents: any;
};

export const DamageTypeExposureContext = createContext<
  ContextPropsType | undefined
>(undefined);

export const PROGRESS_ITEMS: Record<string, { bgColor: string }> = {
  'Ransomware & Extortion': {
    bgColor: 'fill.visualization.impactScenarios.ransomwareAndExtortion',
  },
  'Business Interruption': {
    bgColor: 'fill.visualization.impactScenarios.businessInterruption',
  },
  'Third Party Service Provider Failure': {
    bgColor:
      'fill.visualization.impactScenarios.thirdPartyServiceProviderFailure',
  },
  'Third Party Liability': {
    bgColor: 'fill.visualization.impactScenarios.thirdPartyLiability',
  },
  'Data Theft & Privacy': {
    bgColor: 'fill.visualization.impactScenarios.dataBreachAndPrivacy',
  },
  'Regulation & Compliance': {
    bgColor: 'fill.visualization.impactScenarios.regulationAndGovernance',
  },
};
