import { useFeatureRiskRegisterCRQ } from '@/services/feature-toggles';
import { AddScenarioMenu } from './AddScenarioMenu';
import { AddSimpleScenarioButton } from './AddSimpleScenarioButton';

export const AddRiskScenarioButton = () => {
  const isRiskRegisterCRQEnabled = useFeatureRiskRegisterCRQ();

  return (
    <div className='flex justify-end'>
      {isRiskRegisterCRQEnabled ? <AddScenarioMenu /> : <AddSimpleScenarioButton />}
    </div>
  );
};
