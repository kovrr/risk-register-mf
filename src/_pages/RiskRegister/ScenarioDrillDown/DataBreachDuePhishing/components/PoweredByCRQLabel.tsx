import { Badge } from '@/components/atoms/badge';
import { Sparkle } from '@/_pages/RiskRegister/components/icons/Sparkle';
import { useTranslation } from 'react-i18next';

export const PoweredByCRQLabel = () => {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.dataBreachPhishing',
  });

  return (
    <div data-testid='powered-by-crq'>
      <Badge className='flex items-center gap-2 px-[8px] py-[5px] text-xs font-bold'>
        <Sparkle />
        {t('poweredByCRQLabel')}
      </Badge>
    </div>
  );
};
