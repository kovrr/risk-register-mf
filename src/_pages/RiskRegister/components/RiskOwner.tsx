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
import { useQueryClient } from '@tanstack/react-query';
import { UserRound } from 'lucide-react';
import { useIsGuestUser } from 'permissions/use-permissions';
import { type FC, useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

// Display component for email string (when value is email directly but not in owners list)
const EmailDisplay = ({ email }: { email: string }) => {
  return (
    <div className='flex items-center gap-2'>
      <OwnerAvatar />
      <div className='flex flex-col'>
        <div className='text-ellipsis text-sm text-text-base-primary'>
          {email}
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
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  const isGuestUser = useIsGuestUser();
  const { showDemoModal } = useContext(DemoExperienceContext);
  const { t } = useTranslation('riskRegister');

  // Debug logs
  useEffect(() => {
    console.log('[RiskOwner] ============================================');
    console.log(
      '[RiskOwner] Component rendered for scenarioId:',
      rowData.scenarioId,
    );
    console.log('[RiskOwner] value prop (from table):', value);
    console.log('[RiskOwner] currentValue state:', currentValue);
    console.log('[RiskOwner] rowData.owner:', rowData.owner);
    console.log(
      '[RiskOwner] rowData object:',
      JSON.stringify(rowData, null, 2),
    );
    console.log(
      '[RiskOwner] Will render:',
      currentValue ? `Email: "${currentValue}"` : 'Assign',
    );
    console.log('[RiskOwner] ============================================');
  }, [value, currentValue, rowData]);

  // Get active group ID from localStorage
  useEffect(() => {
    try {
      const savedGroupId = localStorage.getItem('active_group_id');
      setActiveGroupId(savedGroupId);
    } catch (error) {
      console.warn('Failed to read active_group_id from localStorage:', error);
    }
  }, []);

  // Use the hook directly to get data immediately
  const { data: ownersData = [], refetch: _getRiskOwners } =
    useRiskOwners(activeGroupId);

  const getRiskOwners = useCallback(
    async (_query?: string): Promise<RiskOwner[]> => {
      // Return cached data immediately if available, otherwise refetch
      if (ownersData.length > 0 && !_query) {
        return ownersData;
      }
      const { data } = await _getRiskOwners();
      return data ?? [];
    },
    [_getRiskOwners, ownersData],
  );

  // Update currentValue when value prop changes
  useEffect(() => {
    if (value !== currentValue) {
      setCurrentValue(value ?? '');
    }
  }, [value, currentValue]);

  // Check if currentValue is an email that exists in owners list
  const foundOwner = ownersData.find((o) => o.email === currentValue);
  const isEmailValue = currentValue?.includes('@') ?? false;

  const { mutateAsync: createRiskOwner } = useCreateRiskOwner({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.RISK_OWNER,
      });
      setIsInvitationFormOpen(false);
      // Refresh the owners list to show the newly invited user
      await _getRiskOwners();
      toast.success('Invitation sent successfully');
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
    await createRiskOwner({
      email: userDetails.email,
      groupId: userDetails.groupId,
    });
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
        // Value is now email, so find by email
        const owner = owners.find((o) => o.email === value);
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
      {currentValue && isEmailValue && !foundOwner ? (
        // Display email directly when value exists but not in owners list
        <div className='flex items-center gap-2 h-[30px]'>
          <EmailDisplay email={currentValue} />
        </div>
      ) : (
        <AsyncSelect
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
          fetcher={async (query) => {
            const owners = await getRiskOwners(query);
            console.log('[RiskOwner] Fetched owners:', owners);
            console.log('[RiskOwner] Looking for value:', currentValue);
            const found = owners.find((o) => o.email === currentValue);
            console.log('[RiskOwner] Found owner for currentValue:', found);
            // If we have a currentValue that's not in the list, add it as a synthetic option
            if (currentValue && !found && currentValue.includes('@')) {
              const syntheticOwner: RiskOwner = {
                id: currentValue,
                email: currentValue,
                active_tenant: '',
                tenant_ids: [],
              };
              return [syntheticOwner, ...owners];
            }
            return owners;
          }}
          renderOption={(owner) => <OwnerView owner={owner} />}
          getOptionValue={(owner) => {
            console.log('[RiskOwner] getOptionValue called with:', owner.email);
            return owner.email;
          }}
          getDisplayValue={(owner) => {
            console.log(
              '[RiskOwner] getDisplayValue called with:',
              owner.email,
            );
            return <OwnerView owner={owner} />;
          }}
          label='Owner'
          placeholder='Assign'
          value={currentValue}
          onChange={handleChange}
          disabled={isMutating || isLoading || disabled}
          data-testid='risk-owner-dropdown'
        />
      )}
      <InvitationFormModal
        open={isInvitationFormOpen}
        onOpenChange={setIsInvitationFormOpen}
        initialValue={invitationFormInitialValue}
        onSubmit={onSubmit}
      />
    </>
  );
};
