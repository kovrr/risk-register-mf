import {
  DropMenu,
  type DropMenuItem,
} from '@/components/molecules/DropdownMenu';
import { useIsGuestUser } from '@/permissions/use-permissions';
import {
  useCurrentRiskRegisterScenarioId,
  useDeleteRiskRegisterScenario,
} from '@/services/hooks';
import { EllipsisVertical } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteScenarioModal } from '../components/DeleteScenarioModal';
import { useRiskRegisterDemoFeatures } from '../utils/use-risk-register-demo-features';

export const ScenarioActionMenu = () => {
  const navigate = useNavigate();
  const scenarioId = useCurrentRiskRegisterScenarioId();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { mutateAsync: deleteRiskScenario } = useDeleteRiskRegisterScenario({
    onSuccess: () => {
      navigate('/');
    },
  });
  const { isLimitedUser, handleGuestUserClick } = useRiskRegisterDemoFeatures();
  const handleDeleteClick = useCallback(() => {
    if (isLimitedUser) {
      handleGuestUserClick();
      return;
    }
    setIsDeleteModalOpen(true);
  }, [isLimitedUser, handleGuestUserClick]);

  const menuActions: DropMenuItem[] = useMemo(
    () => [
      {
        label: 'Delete Scenario',
        labelStyles:
          'text-text-information-error focus:text-text-information-error',
        action: handleDeleteClick,
      },
    ],
    [handleDeleteClick],
  );
  const isGuestUser = useIsGuestUser();
  if (isGuestUser) {
    return (
      <EllipsisVertical className='h-4 w-4' onClick={handleGuestUserClick} />
    );
  }
  return (
    <div data-testid='scenario-action-menu'>
      <DropMenu menuItems={menuActions} />
      <DeleteScenarioModal
        isOpen={isDeleteModalOpen}
        onDelete={async () => {
          scenarioId && (await deleteRiskScenario(scenarioId));
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
