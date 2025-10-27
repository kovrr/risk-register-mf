import { useCurrentRiskRegisterScenario } from '@/services/hooks';
import { useTranslation } from 'react-i18next';
import { CRQScenarioDate } from './CRQScenarioDate';
import { PoweredByCRQLabel } from './PoweredByCRQLabel';
import { RerunCRQScenario } from './RerunCRQScenario';
export const QuantitativeMetricsHeader = () => {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'modal.labels',
  });
  const { data: scenario } = useCurrentRiskRegisterScenario();
  const isCRQ = scenario?.scenario_type === 'crq';
  return (
    <div className='flex justify-between'>
      <div className='flex flex-col gap-2'>
        <div className='flex gap-5'>
          <h2 className='text-[17px] font-bold'>{t('qualitativeMetrics')}</h2>
          {isCRQ && <PoweredByCRQLabel />}
        </div>
        {scenario && isCRQ && <CRQScenarioDate scenario={scenario} />}
      </div>
      {scenario && isCRQ && <RerunCRQScenario scenario={scenario} />}
    </div>
  );
};
