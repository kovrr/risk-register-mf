import { LikelihoodBadge } from '@/components/molecules/LikelihoodBadge';
import { SeverityBullet } from '@/components/molecules/SeverityBullet';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

type ImpactType =
  | 'Negligible'
  | 'Minor'
  | 'Moderate'
  | 'Significant'
  | 'Severe';
type LikelihoodType = 'Expected' | 'Likely' | 'Possible' | 'Unlikely' | 'Rare';

type Props = {
  type: 'impact' | 'likelihood';
  value?: ImpactType | LikelihoodType;
};

export const ScenarioMetric: FC<Props> = ({ type, value }) => {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.dataBreachPhishing',
  });

  return (
    <div className='space-y-4'>
      <h2 className='text-center text-[16px] font-bold'>{t(type)}</h2>
      <div>
        {value ? (
          type === 'impact' ? (
            <SeverityBullet value={value as ImpactType} />
          ) : (
            <LikelihoodBadge value={value as LikelihoodType} />
          )
        ) : (
          <div className='flex justify-center text-xl italic text-text-base-secondary'>
            {t('notEstimated')}
          </div>
        )}
      </div>
    </div>
  );
};
