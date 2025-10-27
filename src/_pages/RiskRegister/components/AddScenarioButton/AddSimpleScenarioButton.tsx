import { Button } from '@/components/atoms/button';
import { scenarioTypes } from '@/types/riskRegister';
import { Plus } from 'lucide-react';
import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ScenarioInputModal from '../../ScenarioInputForm/ScenarioInputModal';

export const AddSimpleScenarioButton: FC = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'createScenarioButton',
  });
  return (
    <>
      <Button
        data-testid='add-risk-scenario-simple-button'
        onClick={() => setOpen(true)}
      >
        <Plus size={16} />
        {t('label')}
      </Button>
      <ScenarioInputModal
        open={open}
        onOpenChange={setOpen}
        scenarioType={scenarioTypes.MANUAL}
      />
    </>
  );
};
