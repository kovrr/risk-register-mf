import { useCurrencySignAdderPredefinedCurrency } from '@/helpers/string';
import { CurrencyCodeType } from '@/options/constants';
import { ImpactDistribution as ImpactDistributionType } from '@/types/riskRegister';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ImpactChart from './chart/ImpactChart';

interface ImpactDistributionProps {
  distribution?: ImpactDistributionType;
  currency?: CurrencyCodeType;
  averageLoss?: number;
}

const distributionToArray = (distribution: ImpactDistributionType) => {
  return [
    distribution.ninety_nine,
    distribution.seventy_five,
    distribution.fifty,
    distribution.twenty_five,
    distribution.one,
  ];
};

export function ImpactDistributionOld({
  distribution,
  currency,
  averageLoss,
}: ImpactDistributionProps) {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.dataBreachPhishing',
  });
  const currencySignFormatter = useCurrencySignAdderPredefinedCurrency({
    currency: currency,
    shorten: true,
  });

  const rows = useMemo(
    () =>
      distribution
        ? [
            {
              percentage: {
                value: t('table.percentages.99.value'),
              },
              value: distribution.ninety_nine,
              fieldName: 'impactMin',
            },
            {
              percentage: {
                value: t('table.percentages.75.value'),
              },
              value: distribution.seventy_five,
              fieldName: 'impact75',
            },
            {
              percentage: {
                value: t('table.percentages.50.value'),
              },
              value: distribution.fifty,
              fieldName: 'impactMedian',
            },
            {
              percentage: {
                value: t('table.percentages.25.value'),
              },
              value: distribution.twenty_five,
              fieldName: 'impact25',
            },
            {
              percentage: {
                value: t('table.percentages.1.value'),
              },
              value: distribution.one,
              fieldName: 'impactMax',
            },
          ]
        : [],
    [distribution, t],
  );

  if (!distribution) return null;

  return (
    <div className='space-y-6'>
      <h2 className='text-[16px] font-[400]'>{t('impactDistribution')}</h2>
      <div className='grid grid-cols-[1fr_1fr] gap-4'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-b-fill-specific-divider text-left text-[14px] font-[700] text-text-base-secondary'>
                <th className='pb-[10px]'>{t('table.likelihoodHeader')}</th>
                <th className='pb-[10px]'>{t('table.impactHeader')}</th>
              </tr>
            </thead>
            <tbody className='text-muted-foreground'>
              {rows.map(({ percentage, value, fieldName }) => (
                <tr key={fieldName}>
                  <td className='py-2'>
                    <span className='font-[700] text-text-base-primary'>
                      {percentage.value}
                    </span>
                  </td>
                  {value && <td>{currencySignFormatter(value)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <ImpactChart
            points={distributionToArray(distribution)}
            averageLossCurrency={currency}
            averageLoss={averageLoss}
          />
        </div>
      </div>
    </div>
  );
}
