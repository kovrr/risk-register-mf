import { CustomFieldsContainer } from '@/_pages/RiskRegister/components/CustomFields/CustomFieldsContainer';
import { useDebounceCallback } from '@react-hook/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useUpdateRiskScenarioField } from '@/services/hooks';
import type { CustomField, RiskRegisterResponse } from '@/types/riskRegister';

type CustomFieldsSectionProps = {
  scenario: RiskRegisterResponse;
};

export function CustomFieldsSection({ scenario }: CustomFieldsSectionProps) {
  const initialFields = useMemo(
    () => scenario.scenario_data.custom_fields || [],
    [scenario.scenario_data.custom_fields],
  );

  const [customFields, setCustomFields] =
    useState<CustomField[]>(initialFields);
  const { mutateAsync: updateRiskScenarioField } = useUpdateRiskScenarioField(
    {},
  );

  useEffect(() => {
    setCustomFields(initialFields);
  }, [initialFields]);

  const debouncedUpdate = useDebounceCallback(
    async (updatedFields: CustomField[]) => {
      await updateRiskScenarioField({
        custom_fields: updatedFields,
      });
    },
    500,
  );

  const handleAddField = useCallback(
    async (field: Omit<CustomField, 'id'>) => {
      const newField: CustomField = { ...field, id: uuidv4() };

      const updatedFields = [...customFields, newField];
      setCustomFields(updatedFields);
      debouncedUpdate(updatedFields);
    },
    [customFields, debouncedUpdate],
  );

  const handleEditField = useCallback(
    async (fieldId: string, updatedField: Partial<CustomField>) => {
      const updatedFields = customFields.map((field) =>
        field.id === fieldId ? { ...field, ...updatedField } : field,
      );

      setCustomFields(updatedFields);
      debouncedUpdate(updatedFields);
    },
    [customFields, debouncedUpdate],
  );

  const handleFieldValueChange = useCallback(
    async (fieldId: string, value: CustomField['value']) => {
      const updatedFields = customFields.map((field) =>
        field.id === fieldId ? { ...field, value } : field,
      );

      setCustomFields(updatedFields);
      debouncedUpdate(updatedFields);
    },
    [customFields, debouncedUpdate],
  );

  const handleDeleteField = useCallback(
    async (fieldId: string) => {
      const updatedFields = customFields.filter(
        (field) => field.id !== fieldId,
      );

      setCustomFields(updatedFields);
      debouncedUpdate(updatedFields);
    },
    [customFields, debouncedUpdate],
  );

  const handleReorderFields = useCallback(
    async (reorderedFields: CustomField[]) => {
      setCustomFields(reorderedFields);
      debouncedUpdate(reorderedFields);
    },
    [debouncedUpdate],
  );

  return (
    <CustomFieldsContainer
      fields={customFields}
      values={Object.fromEntries(
        customFields.map((field) => [field.id, field.value]),
      )}
      onChange={handleFieldValueChange}
      onAddField={handleAddField}
      onEditField={handleEditField}
      onDeleteField={handleDeleteField}
      onReorder={handleReorderFields}
      mode='edit'
    />
  );
}
