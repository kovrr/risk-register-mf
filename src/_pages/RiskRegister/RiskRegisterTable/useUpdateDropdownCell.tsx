import type { Option } from '@/components/molecules/Dropdown';
import { QUERY_KEYS, useUpdateRiskRegisterScenarioRow } from '@/services/hooks';
import type { RiskRegisterRow } from '@/types/riskRegister';
import { useState } from 'react';
import { useIsMutating } from 'react-query';
import { useUpdateRiskRegisterQueries } from './useUpdateRiskRegisterQueries';

export const useUpdateDropdownCell = <T extends string>({
  value,
  rowData,
  fieldToUpdate,
}: {
  value?: T;
  rowData: RiskRegisterRow;
  fieldToUpdate: keyof RiskRegisterRow;
}) => {
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { updateQueriesWithNewRow } = useUpdateRiskRegisterQueries();
  const { mutateAsync, isLoading } = useUpdateRiskRegisterScenarioRow(
    rowData.scenarioId,
    {
      onSuccess: (updatedScenario) => {
        updateQueriesWithNewRow(updatedScenario);
      },
      onError: (error: unknown) => {
        const axiosError = error as { response?: { data: { detail: string } } };
        setErrorMessage(
          axiosError.response?.data.detail || 'Unable to update row',
        );
        setIsErrorDialogOpen(true);
      },
    },
  );
  const amountOfUpdateActiveMutations = useIsMutating([
    QUERY_KEYS.RISK_REGISTER_SCENARIOS,
    rowData.scenarioId,
  ]);
  const amountOfUpdateFieldActiveMutations = useIsMutating([
    QUERY_KEYS.RISK_REGISTER_SCENARIOS,
    'updateField',
    rowData.scenarioId,
  ]);

  const isMutating =
    amountOfUpdateActiveMutations + amountOfUpdateFieldActiveMutations > 0;

  const handleChange = async (option: Option) => {
    if (option.value === value) return;
    const newRowData = {
      ...rowData,
      [fieldToUpdate]: option.value as T,
    };
    await mutateAsync(newRowData);
  };

  return {
    handleChange,
    isMutating,
    isLoading,
    errorDialogProps: {
      isOpen: isErrorDialogOpen,
      onOpenChange: setIsErrorDialogOpen,
      errorMessage,
    },
  };
};
