import { Button } from '@/components/atoms/button';
import { useIsSelfAssessmentLimitedUser } from '@/permissions/use-permissions';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { PUBLIC_ROUTES } from '@/routes';

const GET_DEMO_URL = 'https://www.kovrr.com/demo';
const LEARN_MORE_URL = 'https://www.kovrr.com/cybersecurity-grc';
const SA_LEARN_MORE_URL = 'https://www.kovrr.com/ai-governance';
const SA_GET_DEMO_URL = 'https://www.kovrr.com/ai-risk-assessment-demo';

export const RiskRegisterMarketingButtons = () => {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'marketingButtons',
  });
  const location = useLocation();
  const isSelfAssessmentLimitedUser =
    useIsSelfAssessmentLimitedUser() &&
    location.pathname.includes(PUBLIC_ROUTES.SELF_ASSESSMENT);
  return (
    <div
      className='flex flex-row gap-2'
      data-testid='risk-register-marketing-buttons'
    >
      <Button
        variant='outline'
        size='sm'
        className='h-[30px] rounded-full border-fill-brand-primary font-semibold hover:border-fill-brand-primary hover:bg-transparent hover:text-text-brand-primary'
        onClick={() =>
          window.open(
            isSelfAssessmentLimitedUser ? SA_LEARN_MORE_URL : LEARN_MORE_URL,
            '_blank',
          )
        }
      >
        {t('learnMore')}
      </Button>
      <Button
        size='sm'
        onClick={() =>
          window.open(
            isSelfAssessmentLimitedUser ? SA_GET_DEMO_URL : GET_DEMO_URL,
            '_blank',
          )
        }
        className='h-[30px] rounded-full font-semibold'
      >
        {t('getDemo')}
      </Button>
    </div>
  );
};
