import { useCurrencySignAdderPredefinedCurrency } from '@/helpers/string';
import type { CurrencyCodeType } from '@/options/constants';
import type { ImpactDistribution as ImpactDistributionType } from '@/types/riskRegister';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

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

export const ImpactDistributionSection: React.FC<ImpactDistributionProps> = ({
  distribution,
  currency,
  averageLoss: _averageLoss,
}) => {
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
    <div className='flex flex-col gap-4'>
      <h3 className='text-base font-semibold text-text-base-primary'>
        Impact Distribution
      </h3>
      <p className='text-sm font-normal leading-relaxed text-text-base-secondary'>
        {t('impactDistributionDescription')}
      </p>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-b-fill-specific-divider text-left text-sm font-bold text-text-base-secondary'>
              <th className='pb-2'>{t('table.likelihoodHeader')}</th>
              <th className='pb-2'>{t('table.impactHeader')}</th>
            </tr>
          </thead>
          <tbody className='text-muted-foreground'>
            {rows.map(({ percentage, value, fieldName }) => (
              <tr key={fieldName} className='border-b border-gray-100'>
                <td className='py-2'>
                  <span className='font-bold text-text-base-primary'>
                    {percentage.value}
                  </span>
                </td>
                {value && (
                  <td className='py-2'>{currencySignFormatter(value)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

