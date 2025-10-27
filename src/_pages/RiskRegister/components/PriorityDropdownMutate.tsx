import { RiskRegisterPriority, RiskRegisterRow } from '@/types/riskRegister';
import { PriorityDropdown } from './PriorityDropdown';
import { useUpdateDropdownCell } from '../RiskRegisterTable/useUpdateDropdownCell';
import { ErrorDialog } from './ErrorDialog';

interface PriorityDropdownMutateProps {
  value?: RiskRegisterPriority;
  rowData: RiskRegisterRow;
}

export function PriorityDropdownMutate({
  value,
  rowData,
}: PriorityDropdownMutateProps) {
  const { handleChange, isMutating, isLoading, errorDialogProps } =
    useUpdateDropdownCell({
      value,
      rowData,
      fieldToUpdate: 'priority',
    });

  return (
    <>
      <PriorityDropdown
        value={value}
        onChange={handleChange}
        disabled={isMutating}
        isLoading={isLoading}
      />
      <ErrorDialog {...errorDialogProps} />
    </>
  );
}
