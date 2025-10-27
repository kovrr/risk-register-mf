import {
  DropMenu,
  type DropMenuItem,
} from '@/components/molecules/DropdownMenu';
import { useFeatureRiskRegisterTemplate } from '@/services/feature-toggles';
import { useCRQScenarioRemainingLicenses } from '@/services/hooks';
import { type ScenarioType, scenarioTypes } from '@/types/riskRegister';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ScenarioInputModal from '../../ScenarioInputForm/ScenarioInputModal';
import { useRiskRegisterDemoFeatures } from '../../utils/use-risk-register-demo-features';
import { AddScenarioTemplateModal } from './AddScenarioTemplateModal';
import { LimitReachedDialog } from './WarningLimitDialog';

export const AddScenarioMenu = () => {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'createScenarioButton',
  });
  const isRiskRegisterTemplateEnabled = useFeatureRiskRegisterTemplate();
  const { isLimitedUser, handleGuestUserClick } = useRiskRegisterDemoFeatures();
  const [scenarioType, setScenarioType] = useState<ScenarioType | null>(null);
  const { data: remainingLicenses } = useCRQScenarioRemainingLicenses();
  const [showQuotaExceededModal, setShowQuotaExceededModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const handleSimpleScenarioClick = () => {
    setScenarioType(scenarioTypes.MANUAL);
  };

  const handleCRQScenarioClick = () => {
    if (isLimitedUser) {
      handleGuestUserClick();
      return;
    }
    const hasEnoughQuota = remainingLicenses && remainingLicenses > 0;

    if (!hasEnoughQuota) {
      setShowQuotaExceededModal(true);
      return;
    }

    setScenarioType(scenarioTypes.CRQ);
  };

  const handleTemplateClick = () => {
    setShowTemplateModal(true);
  };

  const menuItems: DropMenuItem[] = [
    {
      label: t('menuItems.simple'),
      action: handleSimpleScenarioClick,
    },
    {
      label: t('menuItems.crq'),
      action: handleCRQScenarioClick,
    },
    ...(isRiskRegisterTemplateEnabled
      ? [
        {
          label: t('menuItems.template'),
          action: handleTemplateClick,
        },
      ]
      : []),
  ];

  return (
    <>
      <DropMenu
        menuTrigger={
          <div
            data-testid='add-risk-scenario-dropdown-button'
            className='flex items-center gap-2 rounded-2xl bg-fill-brand-primary px-4 py-2 text-sm font-semibold text-fill-base-0'
          >
            <Plus size={16} />
            {t('label')}
          </div>
        }
        menuItems={menuItems}
      />
      {scenarioType && (
        <ScenarioInputModal
          open={!!scenarioType}
          onOpenChange={(open) => !open && setScenarioType(null)}
          scenarioType={scenarioType}
        />
      )}
      <LimitReachedDialog
        isOpen={showQuotaExceededModal}
        onOpenChange={setShowQuotaExceededModal}
      />
      {showTemplateModal && (
        <AddScenarioTemplateModal
          setShowTemplateModal={setShowTemplateModal}
          showTemplateModal={showTemplateModal}
        />
      )}
    </>
  );
};
