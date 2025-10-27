import { useCurrentRiskRegisterScenario } from '@/services/hooks';
import { scenarioTypes } from '@/types/riskRegister';
import type React from 'react';
import MASView from './MASView';
import NaiveView from './NaiveView';

const ScenarioView: React.FC = () => {
  const { data: scenario } = useCurrentRiskRegisterScenario();

  const isCRQScenario = scenario?.scenario_type === scenarioTypes.CRQ;

  return isCRQScenario ? <MASView /> : <NaiveView />;
};

export default ScenarioView;
