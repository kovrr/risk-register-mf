import { Skeleton } from '@/components/atoms/skeleton';
import { Triangle } from '@/_pages/RiskRegister/components/icons/Triangle';
import { BasicTooltip } from '@/components/molecules/BasicTooltip';
import type { ScenarioMetricsHistory } from '@/types/riskRegister';
import 'chart.js/auto';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CrqAALMetricFooter } from './chart/CrqAALMetricFooter';
import { PercentageDifference } from './PercentageDiff';
import { ScenarioMetricCard } from './ScenarioMetricCard';

type Props = {
  metricsHistory: ScenarioMetricsHistory | null;
  isLoading: boolean;
};
export const CrqAALMetric: FC<Props> = ({ metricsHistory, isLoading }) => {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.dataBreachPhishing',
  });

  const metricsLength = metricsHistory?.metrics_history?.length ?? 0;
  const lastIndex = metricsLength > 0 ? metricsLength - 1 : 0;
  const previousIndex = metricsLength > 1 ? metricsLength - 2 : 0;

  const annualLikelihood =
    (metricsHistory?.metrics_history[lastIndex]?.annual_likelihood ?? 0) * 100;
  const previousAnnualLikelihood =
    (metricsHistory?.metrics_history[previousIndex]?.annual_likelihood ?? 0) *
    100;

  const targetedBenchmark =
    (metricsHistory?.metrics_history[lastIndex]
      ?.targeted_benchmark_annual_rate ?? 0) * 100;

  if (isLoading) {
    return <Skeleton className='h-[280px] w-full' />;
  }

  if (!metricsHistory) {
    return null;
  }

  return (
    <ScenarioMetricCard
      title={t('aalLikelihoodTitle')}
      description={t('metricAnnualEventsLikelihoodDescription')}
      footer={<CrqAALMetricFooter metricsHistory={metricsHistory} />}
    >
      <div className='mt-6 flex h-[88px] w-full flex-col justify-between gap-6 text-sm text-text-base-secondary'>
        <div className='flex items-baseline gap-4 text-[38px] font-bold'>
          <span className='text-gray-900'>{annualLikelihood.toFixed(2)} %</span>
          {metricsLength > 1 && (
            <PercentageDifference
              rateA={annualLikelihood}
              rateB={previousAnnualLikelihood}
              shouldShowNoDifference={true}
            />
          )}
        </div>
        <div className='flex h-[50px] items-center justify-between gap-2 text-base'>
          <div className='flex items-center gap-2 font-bold'>
            <Triangle />
            <BasicTooltip
              triggerText={t('peerBaseRate')}
              content={t('peerBaseRateDescription')}
              triggerClassName='font-bold'
            />
          </div>
          <p className=''>{targetedBenchmark.toFixed(2)}%</p>
        </div>
      </div>
    </ScenarioMetricCard>
  );
};
