import { ConfirmationDialog } from '@/components/molecules/ConfirmationDialog';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  isOpen: boolean;
  onDelete: () => void;
  onCancel: () => void;
};
export const DeleteScenarioModal: FC<Props> = ({
  isOpen,
  onDelete,
  onCancel,
}) => {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'deleteScenarioModal',
  });

  return (
    <ConfirmationDialog
      title={t('title')}
      description={t('description')}
      confirmButtonText={t('confirmButtonText')}
      cancelButtonText={t('cancelButtonText')}
      isOpen={isOpen}
      onConfirm={onDelete}
      onCancel={onCancel}
    />
  );
};
