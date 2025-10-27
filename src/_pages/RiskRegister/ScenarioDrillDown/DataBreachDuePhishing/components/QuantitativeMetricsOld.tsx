import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/atoms/collapsible';
import { useCurrencySignAdderPredefinedCurrency } from '@/helpers/string';
import type { CurrencyCodeType } from '@/options/constants';
import type {
  ImpactDistribution as ImpactDistributionType,
  RiskRegisterResponse,
} from '@/types/riskRegister';
import { ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CrqPoweredMessage } from './CrqPoweredMessage';
import { ImpactDistributionOld } from './ImpactDistributionOld';

interface QuantitativeMetricsProps {
  averageLoss?: number;
  averageLossCurrency?: CurrencyCodeType;
  annualLikelihood?: number;
  peerBaseRate?: number;
  impactDistribution?: ImpactDistributionType;
  data: RiskRegisterResponse;
}

export function QuantitativeMetricsOld({
  averageLoss,
  averageLossCurrency,
  annualLikelihood,
  peerBaseRate,
  impactDistribution,
  data,
}: QuantitativeMetricsProps) {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.dataBreachPhishing',
  });
  const currencySignFormatter = useCurrencySignAdderPredefinedCurrency({
    currency: averageLossCurrency,
    shorten: true,
  });
  return (
    <Collapsible defaultOpen>
      <div className='mb-4 flex items-center justify-between'>
        <h2 className='text-[17px] font-[700]'>{t('quantitativeMetrics')}</h2>
        <CollapsibleTrigger className='text-muted-foreground hover:text-foreground [&[data-state=open]>svg]:rotate-180'>
          <ChevronUp className='h-5 w-5 transition-transform duration-200' />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <CrqPoweredMessage scenario={data} />
        <div className='flex flex-row justify-around'>
          <div className='flex flex-col items-center p-6'>
            <h3 className='mb-4 text-[16px] font-[400]'>
              {t('averageFinancialLoss')}
            </h3>
            {averageLoss ? (
              <div className='flex items-baseline gap-2'>
                <span className='text-[38px] font-[900]'>
                  {currencySignFormatter(averageLoss)}
                </span>
              </div>
            ) : (
              <div className='flex justify-center text-xl italic text-text-base-secondary'>
                {t('notEstimated')}
              </div>
            )}
          </div>
          <div className='flex flex-col items-center p-6'>
            <h3 className='mb-4 text-[16px] font-[400]'>
              {t('annualLikelihood')}
            </h3>
            <div className='flex w-full flex-col items-center space-y-4'>
              {annualLikelihood ? (
                <div className='text-4xl font-bold'>
                  {annualLikelihood.toFixed(2)}%
                </div>
              ) : (
                <div className='flex justify-center text-xl italic text-text-base-secondary'>
                  {t('notEstimated')}
                </div>
              )}
              <div className='flex w-full min-w-[145px] flex-row items-center justify-between gap-10 text-sm'>
                <span className='text-[14px] font-[700] text-text-base-secondary'>
                  {t('peerBaseRate')}
                </span>
                {peerBaseRate ? (
                  <span className='text-[21px] font-[700]'>
                    {peerBaseRate.toFixed(2)}%
                  </span>
                ) : (
                  <div className='flex w-14 justify-center text-center text-[13px] italic text-text-base-secondary'>
                    {t('notEstimated')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {impactDistribution && (
          <ImpactDistributionOld
            distribution={impactDistribution}
            currency={averageLossCurrency}
            averageLoss={averageLoss}
          />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
