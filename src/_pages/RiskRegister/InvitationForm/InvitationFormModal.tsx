import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { InvitationFormValues } from './components/form-config';
import { UserInvitationForm } from './UserInvitationForm';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue?: string;
  onSubmit: (userDetails: InvitationFormValues) => void;
};

export const InvitationFormModal: FC<Props> = ({
  open,
  onOpenChange,
  initialValue,
  onSubmit,
}) => {
  const { t } = useTranslation('common', { keyPrefix: 'invitationForm' });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='mb-[25px] mt-[75px] max-h-[739px] max-w-[522px] min-w-[400px] overflow-y-auto'
        overlayClassName='fixed inset-0 grid items-center '
      >
        <div className='space-y-[20px]'>
          <DialogHeader>
            <DialogTitle className='text-[26px] font-[700]'>
              {t('title')}
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <UserInvitationForm
            initialEmailValue={initialValue}
            onSubmit={onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
