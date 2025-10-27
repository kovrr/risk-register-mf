import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog';
import { Button } from '@chakra-ui/button';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

type Props = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
};

export const RerunScenarioSuccessDialog: FC<Props> = ({
  showModal,
  setShowModal,
}) => {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.dataBreachPhishing',
  });
  const navigate = useNavigate();
  const handleModalChange = (open: boolean) => {
    setShowModal(open);
    if (!open) {
      navigate('/');
    }
  };
  return (
    <Dialog open={showModal} onOpenChange={handleModalChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('updateSuccessTitle')}</DialogTitle>
          <DialogDescription>{t('updateSuccessDescription')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className='mt-[15px] flex w-full flex-row justify-center'>
            <Button
              onClick={() => {
                setShowModal(false);
                navigate('/', { replace: true });
              }}
            >
              {t('ok')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
