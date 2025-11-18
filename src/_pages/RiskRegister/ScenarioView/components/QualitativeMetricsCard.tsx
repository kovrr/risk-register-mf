import { Skeleton } from '@/components/atoms/skeleton';
import { Card } from '@/components/atoms/card';
import { convertToInternationalCurrencySystemToFixed } from '@/components/ui/charts/utils';
import { useCurrentRiskRegisterScenario } from '@/services/hooks';
import type { ImpactDistribution } from '@/types/riskRegister';
import { useTranslation } from 'react-i18next';
import { DataExposureSection } from './DataExposureSection';
import { ImpactDistributionSection } from './ImpactDistributionSection';

type Props = {
  distribution?: ImpactDistribution;
  currency?: string;
  averageLoss?: number;
};

export const QualitativeMetricsCard: React.FC<Props> = ({
  distribution,
  currency,
  averageLoss: _averageLoss,
}) => {
  const { data: scenario, isLoading } = useCurrentRiskRegisterScenario();
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.dataBreachPhishing',
  });

  const annualLikelihood = scenario?.scenario_data.annual_likelihood;
  const averageLoss = scenario?.scenario_data.average_loss;

  return (
    <Card className='flex flex-col gap-6 p-6 shadow-sm'>
      {/* Header */}
      <h2 className='text-lg font-bold text-text-base-primary'>
        Qualitative Metrics
      </h2>

      {/* Annual Events Likelihood and Average Financial Loss Grid */}
      <div className='grid grid-cols-2 gap-5'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-sm font-semibold text-text-base-primary'>
            Annual Events Likelihood (%)
          </h3>
          <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
            {isLoading ? (
              <Skeleton className='h-10 w-full' />
            ) : annualLikelihood !== undefined ? (
              <p className='flex items-baseline gap-1 text-2xl font-bold'>
                {typeof annualLikelihood === 'number'
                  ? (annualLikelihood * 100).toFixed(2)
                  : annualLikelihood}
                <span className='text-base font-normal'>%</span>
              </p>
            ) : (
              <span className='text-sm italic text-text-base-secondary'>
                Not available
              </span>
            )}
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='text-sm font-semibold text-text-base-primary'>
            Average Financial Loss
          </h3>
          <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
            {isLoading ? (
              <Skeleton className='h-10 w-full' />
            ) : averageLoss !== undefined ? (
              <div>
                {(() => {
                  const { value, suffix } =
                    convertToInternationalCurrencySystemToFixed(averageLoss, 2);
                  return (
                    <p className='flex items-baseline gap-1 text-2xl font-bold'>
                      <span>{value}</span>
                      <span className='text-base font-normal'>{suffix}</span>
                      <span className='text-base font-normal'>
                        {scenario?.scenario_data.average_loss_currency || 'USD'}
                      </span>
                    </p>
                  );
                })()}
              </div>
            ) : (
              <span className='text-sm italic text-text-base-secondary'>
                Not available
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Data Exposure Section */}
      <DataExposureSection scenario={scenario} />

      {/* Impact Distribution Section */}
      <ImpactDistributionSection
        distribution={distribution}
        currency={currency}
        averageLoss={averageLoss}
      />
    </Card>
  );
};

