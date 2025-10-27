import {
  RiskRegisterResponsePlan,
  RiskRegisterRow,
} from '@/types/riskRegister';
import React, { FC } from 'react';
import { ResponsePlanDropdown } from './ResponsePlanDropdown';
import { useUpdateDropdownCell } from '../RiskRegisterTable/useUpdateDropdownCell';
import { ErrorDialog } from './ErrorDialog';

type Props = {
  value?: RiskRegisterResponsePlan;
  rowData: RiskRegisterRow;
};

export const ResponsePlanDropdownMutate: FC<Props> = ({ value, rowData }) => {
  const { handleChange, isMutating, isLoading, errorDialogProps } =
    useUpdateDropdownCell({
      value,
      rowData,
      fieldToUpdate: 'responsePlan',
    });

  return (
    <>
      <ResponsePlanDropdown
        value={value}
        onChange={handleChange}
        disabled={isMutating}
        isLoading={isLoading}
      />
      <ErrorDialog {...errorDialogProps} />
    </>
  );
};
