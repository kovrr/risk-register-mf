import { useUpdateRiskRegisterScenarioField } from '@/services/hooks';
import type { CustomField, RiskRegisterResponse } from '@/types/riskRegister';
import { useDebounceCallback } from '@react-hook/debounce';
import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CustomFieldsContainer } from '../../components/CustomFields/CustomFieldsContainer';

type CustomFieldsSectionProps = {
  scenario: RiskRegisterResponse;
};

export function CustomFieldsSection({ scenario }: CustomFieldsSectionProps) {
  const { mutateAsync: updateRiskRegisterScenario } =
    useUpdateRiskRegisterScenarioField({});

  const [customFields, setCustomFields] = useState<CustomField[]>(
    scenario.scenario_data.custom_fields || [],
  );

  const debouncedUpdate = useDebounceCallback(
    async (updatedFields: CustomField[]) =>
      await updateRiskRegisterScenario({
        custom_fields: updatedFields,
      }),
    500,
  );

  const handleAddField = useCallback(
    async (field: Omit<CustomField, 'id'>) => {
      const newField: CustomField = {
        ...field,
        id: uuidv4(),
      };

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
    async (fieldId: string, value: any) => {
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
      values={Object.fromEntries(customFields.map((f) => [f.id, f.value]))}
      onChange={handleFieldValueChange}
      onAddField={handleAddField}
      onEditField={handleEditField}
      onDeleteField={handleDeleteField}
      onReorder={handleReorderFields}
      mode='edit'
    />
  );
}
