import { Avatar, AvatarFallback } from '@/components/atoms/avatar';
import { AsyncSelect } from '@/components/molecules/AsyncSelect';
import { DemoExperienceContext } from '@/contexts/DemoExperienceContext';
import { cn } from '@/lib/utils';
import {
  QUERY_KEYS,
  useCreateRiskOwner,
  useRiskOwners,
} from '@/services/hooks';
import type { RiskOwner, RiskRegisterRow } from '@/types/riskRegister';
import { UserRound } from 'lucide-react';
import { useIsGuestUser } from 'permissions/use-permissions';
import { type FC, useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { toast } from 'sonner';
import type { InvitationFormValues } from '../InvitationForm/components/form-config';
import { InvitationFormModal } from '../InvitationForm/InvitationFormModal';
import { useUpdateDropdownCell } from '../RiskRegisterTable/useUpdateDropdownCell';

const OwnerAvatar = () => {
  return (
    <Avatar className='h-[25px] w-[25px]'>
      <AvatarFallback className='bg-fill-base-5'>
        <UserRound className='h-[17px] w-[17px]' />
      </AvatarFallback>
    </Avatar>
  );
};

const OwnerView = ({ owner }: { owner: RiskOwner }) => {
  return (
    <div className='flex items-center gap-2'>
      <OwnerAvatar />
      <div className='flex flex-col'>
        <div className='text-ellipsis text-sm text-text-base-primary'>
          {owner.email}
        </div>
      </div>
    </div>
  );
};

type Props = {
  value?: string;
  rowData: RiskRegisterRow;
  disabled?: boolean;
};

export const RiskOwnerDropdownMutate: FC<Props> = ({
  value,
  rowData,
  disabled,
}) => {
  const queryClient = useQueryClient();
  const [currentValue, setCurrentValue] = useState<string>(value ?? '');
  const [isInvitationFormOpen, setIsInvitationFormOpen] = useState(false);
  const [invitationFormInitialValue, setInvitationFormInitialValue] =
    useState<string>('');

  const isGuestUser = useIsGuestUser();
  const { showDemoModal } = useContext(DemoExperienceContext);
  const { t } = useTranslation('riskRegister');

  const { refetch: _getRiskOwners } = useRiskOwners();
  const getRiskOwners = useCallback(
    async (_query?: string): Promise<RiskOwner[]> => {
      const { data } = await _getRiskOwners();
      return data ?? [];
    },
    [_getRiskOwners],
  );

  const { mutateAsync: createRiskOwner } = useCreateRiskOwner({
    onSuccess: async (riskOwner) => {
      await queryClient.invalidateQueries(QUERY_KEYS.RISK_OWNER);
      setIsInvitationFormOpen(false);
      await handleChange(riskOwner.id);
    },
    onError: (error) => {
      const errorData = error.response?.data as {
        detail: string | { msg: string }[];
      };
      if (Array.isArray(errorData.detail)) {
        errorData.detail.forEach((detail) => {
          toast.error(detail.msg);
        });
      } else {
        toast.error(errorData.detail);
      }
    },
  });
  const onSubmit = async (userDetails: InvitationFormValues) => {
    if (isGuestUser) {
      showDemoModal({ title: t('demo.editRiskOwner') });
      return;
    }
    await createRiskOwner(userDetails);
  };

  const {
    handleChange: updateRowData,
    isMutating,
    isLoading,
  } = useUpdateDropdownCell({
    value,
    rowData,
    fieldToUpdate: 'owner',
  });

  const handleChange = async (value: string) => {
    if (isGuestUser) {
      showDemoModal({ title: t('demo.editRiskOwner') });
      return;
    }
    await updateRowData({ value, label: value });
    setCurrentValue(value);
  };

  const [currentOwner, setCurrentOwner] = useState<RiskOwner | null>(null);

  useEffect(() => {
    if (isGuestUser && value) {
      void getRiskOwners().then((owners) => {
        const owner = owners.find((o) => o.id === value);
        setCurrentOwner(owner || null);
      });
    } else {
      setCurrentOwner(null);
    }
  }, [value, isGuestUser, getRiskOwners]);

  if (isGuestUser) {
    return (
      <div
        className={cn(
          'flex items-center justify-around rounded-2xl px-1 py-1 text-xs font-bold text-text-base-invert focus-visible:outline-none cursor-pointer max-w-[84px]',
          currentOwner
            ? 'h-[30px]'
            : 'h-[30px] text-text-base-secondary font-bold border-2 border-stroke-base-1',
        )}
        onClick={() => showDemoModal({ title: t('demo.editScenario') })}
      >
        {currentOwner ? (
          <OwnerView owner={{ ...currentOwner, email: 'guest@example.com' }} />
        ) : (
          <div className='flex items-center '>Assign</div>
        )}
      </div>
    );
  }

  return (
    <>
      <AsyncSelect<RiskOwner>
        key={currentValue}
        preload
        onCreateOption={(inputValue) => {
          setInvitationFormInitialValue(inputValue);
          setIsInvitationFormOpen(true);
        }}
        filterFn={(owner, input) =>
          owner.email.toLowerCase().includes(input.toLowerCase())
        }
        triggerVariant={!currentValue ? 'outline' : 'ghost'}
        triggerClassName={
          !currentValue
            ? 'h-[30px] text-text-base-secondary font-bold border-2 border-stroke-base-1'
            : 'h-[30px]'
        }
        hideChevron={!!currentValue}
        fetcher={getRiskOwners}
        renderOption={(owner) => <OwnerView owner={owner} />}
        getOptionValue={(owner) => owner.id}
        getDisplayValue={(owner) => <OwnerView owner={owner} />}
        label='Owner'
        placeholder='Assign'
        value={currentValue}
        onChange={handleChange}
        disabled={isMutating || isLoading || disabled}
        data-testid='risk-owner-dropdown'
      />
      <InvitationFormModal
        open={isInvitationFormOpen}
        onOpenChange={setIsInvitationFormOpen}
        initialValue={invitationFormInitialValue}
        onSubmit={onSubmit}
      />
    </>
  );
};
