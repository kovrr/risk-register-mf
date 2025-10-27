import { LikelihoodBadge } from '@/components/molecules/LikelihoodBadge';
import { SeverityBullet } from '@/components/molecules/SeverityBullet';
import type {
  RiskRegisterImpact,
  RiskRegisterLikelihood,
  RiskRegisterResponse,
} from '@/types/riskRegister';
import { useTranslation } from 'react-i18next';

interface IntroSectionProps {
  title: string;
  description: string;
  impact?: RiskRegisterImpact;
  likelihood?: RiskRegisterLikelihood;
  data: RiskRegisterResponse;
}

export function IntroSection({
  title,
  description,
  impact,
  likelihood,
}: IntroSectionProps) {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.dataBreachPhishing',
  });

  return (
    <>
      <div>
        <h1 className='mb-2 text-[20px] font-[700]'>{title}</h1>
        <p className='text-[13px] font-[400] text-text-base-secondary'>
          {description}
        </p>
      </div>
      <div className='my-[50px] flex justify-between px-[80px]'>
        <div className='space-y-4'>
          <h2 className='text-center text-[16px] font-[400]'>{t('impact')}</h2>
          <div className='flex items-center gap-2'>
            {impact ? (
              <SeverityBullet value={impact} />
            ) : (
              <div className='flex justify-center text-xl italic text-text-base-secondary'>
                {t('notEstimated')}
              </div>
            )}
          </div>
        </div>
        <div className='space-y-[1.3rem]'>
          <h2 className='text-center text-[16px] font-[400]'>
            {t('likelihood')}
          </h2>
          <div>
            {likelihood ? (
              <LikelihoodBadge value={likelihood} />
            ) : (
              <div className='flex justify-center text-xl italic text-text-base-secondary'>
                {t('notEstimated')}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
