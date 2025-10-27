import { DemoExperienceContext } from '@/DemoExperienceContext';
import { useIsLimitedAccessUser } from '@/permissions/use-permissions';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';

export const useRiskRegisterDemoFeatures = () => {
  const { t: tDemo } = useTranslation('demo');
  const isLimitedUser = useIsLimitedAccessUser();

  const { showDemoModal } = useContext(DemoExperienceContext);

  const handleGuestUserClick = useCallback(() => {
    showDemoModal({
      title: tDemo('demo.modal.riskRegister.title'),
    });
  }, [showDemoModal, tDemo]);

  return { isLimitedUser, handleGuestUserClick };
};
