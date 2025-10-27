import { useFeatureRiskRegisterReorganize } from '@/services/feature-toggles';
import type React from 'react';
import { NaiveScenarioView } from './NaiveScenarioView';
import { NaiveScenarioViewOld } from './NaiveScenarioViewOld';

const NaiveView: React.FC = () => {
  const isReorganize = useFeatureRiskRegisterReorganize();
  return isReorganize ? <NaiveScenarioView /> : <NaiveScenarioViewOld />;
};

export default NaiveView;
