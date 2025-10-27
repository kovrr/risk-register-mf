import { Skeleton } from '@/components/atoms/skeleton';
import { Triangle } from '@/_pages/RiskRegister/components/icons/Triangle';
import { BasicTooltip } from '@/components/molecules/BasicTooltip';
import { useCurrentRiskRegisterScenario } from '@/services/hooks';
import { useTranslation } from 'react-i18next';
import { ScenarioMetricCard } from './ScenarioMetricCard';

export const NaiveAALMetric = () => {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.dataBreachPhishing',
  });
  const { data: scenario, isLoading } = useCurrentRiskRegisterScenario();
  const annualLikelihood = scenario?.scenario_data.annual_likelihood ?? 0;
  const peerBaseRate = scenario?.scenario_data.peer_base_rate ?? 0;
  return (
    <ScenarioMetricCard
      title={t('aalLikelihoodTitle')}
      description={t('aalLikelihoodDescription')}
      footer={
        isLoading ? (
          <Skeleton className='h-[38px] w-full' />
        ) : (
          <div className='flex w-full justify-between text-sm text-text-base-secondary'>
            <div className='flex items-center gap-2'>
              <Triangle />
              <BasicTooltip
                triggerText={t('peerBaseRate')}
                content={t('peerBaseRateDescription')}
                triggerClassName='font-bold'
              />
            </div>
            <span>{peerBaseRate}%</span>
          </div>
        )
      }
    >
      {isLoading ? (
        <Skeleton className='h-[38px] w-full' />
      ) : (
        <p className='text-[38px] font-bold'>
          {annualLikelihood} <span className='font-normal'>%</span>
        </p>
      )}
    </ScenarioMetricCard>
  );
};
