import { useFeatureRiskRegisterReorganize } from '@/services/feature-toggles';
import { MASScenarioOldView } from './MASScenarioOldView';
import { MASScenarioView } from './MASScenarioView';

const MASView: React.FC = () => {
  const isReorganize = useFeatureRiskRegisterReorganize();
  return isReorganize ? <MASScenarioView /> : <MASScenarioOldView />;
};

export default MASView;
