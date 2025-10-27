import { Skeleton } from '@/components/atoms/skeleton';
import { convertToInternationalCurrencySystemToFixed } from '@/components/ui/charts/utils';
import { useCurrentRiskRegisterScenario } from '@/services/hooks';
import { useTranslation } from 'react-i18next';
import { ScenarioMetricCard } from './ScenarioMetricCard';

export const AverageFinancialLossMetric = () => {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.dataBreachPhishing',
  });
  const { data: scenario, isLoading } = useCurrentRiskRegisterScenario();
  const averageLoss = scenario?.scenario_data.average_loss ?? 0;
  const averageLossCurrency =
    scenario?.scenario_data.average_loss_currency ?? '';
  const { value, suffix } = convertToInternationalCurrencySystemToFixed(
    averageLoss,
    2,
  );
  return (
    <ScenarioMetricCard
      title={t('averageFinancialLossTitle')}
      description={t('averageFinancialLossDescription')}
    >
      {isLoading ? (
        <Skeleton className='h-[38px] w-full' />
      ) : (
        <p className='flex items-baseline gap-1 text-[38px] font-bold'>
          <span>{value}</span>
          <span className='font-normal'>{suffix}</span>
          <span className='text-base font-normal'>{averageLossCurrency}</span>
        </p>
      )}
    </ScenarioMetricCard>
  );
};
