import { Button } from '@/components/atoms/button';
import { useExportRiskRegisterScenario, useTenantData } from '@/services/hooks';
import { Text } from '@chakra-ui/react';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { AddRiskScenarioButton } from './AddScenarioButton';

const ScenarioTopBarNoSearch: React.FC = () => {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioTable',
  });
  const { mutateAsync: exportRiskScenario, isPending } =
    useExportRiskRegisterScenario();

  const handleExport = async () => {
    await exportRiskScenario();
  };
  const { data: tenantData } = useTenantData();

  return (
    <div className='flex flex-row items-center justify-between'>
      <Text fontSize='28px'>{tenantData?.name || 'My Organization'}</Text>
      <div className='flex flex-row gap-4'>
        <Button
          data-testid='export-scenario-button'
          onClick={handleExport}
          variant='outline'
          className='hover:bg-background hover:text-text-base-primary'
          loading={isPending}
        >
          {t('export')}
        </Button>
        <AddRiskScenarioButton />
      </div>
    </div>
  );
};

export default ScenarioTopBarNoSearch;


