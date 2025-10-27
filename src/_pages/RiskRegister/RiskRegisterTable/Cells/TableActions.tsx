import {
  DropMenu,
  type DropMenuItem,
} from '@/components/molecules/DropdownMenu';
import { DemoExperienceContext } from '@/contexts/DemoExperienceContext';
import { useIsGuestUser } from '@/permissions/use-permissions';
import {
  useDeleteRiskRegisterScenario,
  useRiskRegisterScenario,
} from '@/services/hooks';
import type { RiskRegisterRow } from '@/types/riskRegister';
import { EllipsisVertical } from 'lucide-react';
import { type FC, useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteScenarioModal } from '../../components/DeleteScenarioModal';
import ScenarioInputModal from '../../ScenarioInputForm/ScenarioInputModal';
import { useRiskRegisterDemoFeatures } from '../../utils/use-risk-register-demo-features';
import { useUpdateRiskRegisterQueries } from '../useUpdateRiskRegisterQueries';

type Props = {
  scenario: RiskRegisterRow;
};

export const TableActions: FC<Props> = ({ scenario }) => {
  const [isEditScenarioOpen, setIsEditScenarioOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isGuestUser = useIsGuestUser();
  const { showDemoModal } = useContext(DemoExperienceContext);
  const { t } = useTranslation('riskRegister');

  const {
    data: scenarioResponse,
    refetch: getCurrentRiskScenario,
    isLoading: isScenarioLoading,
    isFetching: isScenarioFetching,
  } = useRiskRegisterScenario(
    scenario.scenarioId,
    {
      enabled: false,
    },
    ['tableActions'],
  );
  const { isLimitedUser, handleGuestUserClick } = useRiskRegisterDemoFeatures();
  const { updateQueriesWithDeletedRow } = useUpdateRiskRegisterQueries();
  const { mutateAsync: deleteRiskScenario } = useDeleteRiskRegisterScenario({
    onSuccess: () => {
      updateQueriesWithDeletedRow(scenario.scenarioId);
      setIsDeleteModalOpen(false);
    },
  });

  const handleEditScenario = useCallback(async () => {
    setIsEditScenarioOpen(true);
    await getCurrentRiskScenario();
  }, [getCurrentRiskScenario]);

  const handleDeleteClick = useCallback(() => {
    if (isLimitedUser) {
      handleGuestUserClick();
      return;
    }
    setIsDeleteModalOpen(true);
  }, [handleGuestUserClick, isLimitedUser]);

  const handleGuestUserAction = useCallback(() => {
    showDemoModal({ title: t('demo.editScenario') });
  }, [showDemoModal, t]);

  const tableActions: DropMenuItem[] = useMemo(
    () => [
      {
        label: 'Edit Scenario',
        action: async () => {
          if (isGuestUser) {
            handleGuestUserAction();
            return;
          }
          await handleEditScenario();
        },
      },
      {
        label: 'Delete Scenario',
        labelStyles:
          'text-text-information-error focus:text-text-information-error',
        action: () => {
          if (isGuestUser) {
            handleGuestUserAction();
            return;
          }
          handleDeleteClick();
        },
      },
    ],
    [handleEditScenario, handleDeleteClick, isGuestUser, handleGuestUserAction],
  );

  if (isGuestUser) {
    return (
      <div onClick={handleGuestUserAction} className='cursor-pointer'>
        <EllipsisVertical className='h-4 w-4' />
      </div>
    );
  }

  return (
    <>
      <DropMenu menuItems={tableActions} />
      <ScenarioInputModal
        open={isEditScenarioOpen}
        onOpenChange={setIsEditScenarioOpen}
        scenario={scenarioResponse}
        mode='edit'
        isInitialDataLoading={isScenarioLoading || isScenarioFetching}
        scenarioType={scenario.scenarioType}
      />
      <DeleteScenarioModal
        isOpen={isDeleteModalOpen}
        onDelete={async () => {
          await deleteRiskScenario(scenario.scenarioId);
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
};
