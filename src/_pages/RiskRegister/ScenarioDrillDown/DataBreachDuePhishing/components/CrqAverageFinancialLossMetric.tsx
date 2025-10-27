import { Skeleton } from '@/components/atoms/skeleton';
import { convertToInternationalCurrencySystemToFixed } from '@/components/charts/utils';
import type {
  ImpactDistribution,
  ScenarioMetricsHistory,
} from '@/types/riskRegister';
import 'chart.js/auto';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CrqAverageFinancialLossMetricFooter } from './chart/CrqAverageFinancialLossMetricFooter';
import { PercentageDifference } from './PercentageDiff';
import { ScenarioMetricCard } from './ScenarioMetricCard';

type Props = {
  metricsHistory: ScenarioMetricsHistory | null;
  isLoading: boolean;
  impactDistribution?: ImpactDistribution;
};

export const CrqAverageFinancialLossMetric: FC<Props> = ({
  metricsHistory,
  isLoading,
  impactDistribution,
}) => {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.dataBreachPhishing',
  });

  const metricsLength = metricsHistory?.metrics_history?.length ?? 0;
  const lastIndex = metricsLength > 0 ? metricsLength - 1 : 0;
  const previousIndex = metricsLength > 1 ? metricsLength - 2 : 0;

  const averageLoss =
    metricsHistory?.metrics_history[lastIndex]?.average_loss ?? 0;
  const previousAverageLoss =
    metricsHistory?.metrics_history[previousIndex]?.average_loss ?? 0;
  const averageLossCurrency =
    metricsHistory?.metrics_history[lastIndex]?.currency ?? '';
  const { value, suffix } = useMemo(
    () => convertToInternationalCurrencySystemToFixed(averageLoss, 2),
    [averageLoss],
  );

  if (isLoading) {
    return <Skeleton className='h-[280px] w-full' />;
  }

  if (!metricsHistory) {
    return null;
  }

  return (
    <ScenarioMetricCard
      title={t('averageFinancialLossTitle')}
      description={t('metricAverageFinancialLossDescription')}
      footer={
        <CrqAverageFinancialLossMetricFooter
          metricsHistory={metricsHistory}
          impactDistribution={impactDistribution}
        />
      }
    >
      <div className='mt-6 flex w-full flex-col justify-between gap-6 text-sm text-text-base-secondary'>
        <div className='mb-[58px] flex items-baseline gap-4 text-[38px] font-bold text-gray-900'>
          <span className=''>
            {value} {suffix}
          </span>
          <span className='text-base font-normal'>{averageLossCurrency}</span>
          {metricsLength > 1 && (
            <PercentageDifference
              rateA={averageLoss}
              rateB={previousAverageLoss}
              shouldShowNoDifference={true}
            />
          )}
        </div>
      </div>
    </ScenarioMetricCard>
  );
};
