import { CustomFieldsContainer } from '@/_pages/RiskRegister/components/CustomFields/CustomFieldsContainer';
import { useUpdateRiskScenarioField } from '@/services/hooks';
import type { CustomField, RiskRegisterResponse } from '@/types/riskRegister';
import { useEffect, useMemo, useState } from 'react';

type CustomFieldsSectionProps = {
  scenario: RiskRegisterResponse;
  mode?: 'edit' | 'view';
};

const createFieldValuesMap = (fields: CustomField[]) =>
  fields.reduce<Record<string, any>>((acc, field) => {
    acc[field.id] = field.value ?? '';
    return acc;
  }, {});

const generateFieldId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `custom-field-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export function CustomFieldsSection({
  scenario,
  mode = 'edit',
}: CustomFieldsSectionProps) {
  const [fields, setFields] = useState<CustomField[]>(
    scenario.scenario_data.custom_fields ?? [],
  );

  useEffect(() => {
    setFields(scenario.scenario_data.custom_fields ?? []);
  }, [scenario.scenario_id, scenario.updated_at]);

  const { mutateAsync: updateScenarioFields } = useUpdateRiskScenarioField({
    onSuccess: (updatedScenario) => {
      setFields(updatedScenario.scenario_data.custom_fields ?? []);
    },
  });

  const fieldValues = useMemo(() => createFieldValuesMap(fields), [fields]);

  const persistCustomFields = async (nextFields: CustomField[]) => {
    const previousFields = fields;
    setFields(nextFields);

    if (mode === 'view') {
      return;
    }

    try {
      await updateScenarioFields({
        custom_fields: nextFields,
      });
    } catch (error) {
      console.error('Failed to update custom fields', error);
      setFields(previousFields);
    }
  };

  const handleValueChange = (fieldId: string, value: any) => {
    const nextFields = fields.map((field) =>
      field.id === fieldId ? { ...field, value } : field,
    );
    void persistCustomFields(nextFields);
  };

  const handleAddField = (field: Omit<CustomField, 'id'>) => {
    const nextFields = [
      ...fields,
      {
        ...field,
        id: generateFieldId(),
      },
    ];
    void persistCustomFields(nextFields);
  };

  const handleEditField = (
    fieldId: string,
    partialField: Partial<CustomField>,
  ) => {
    const nextFields = fields.map((field) =>
      field.id === fieldId ? { ...field, ...partialField } : field,
    );
    void persistCustomFields(nextFields);
  };

  const handleDeleteField = (fieldId: string) => {
    const nextFields = fields.filter((field) => field.id !== fieldId);
    void persistCustomFields(nextFields);
  };

  const handleReorder = (nextOrder: CustomField[]) => {
    void persistCustomFields(nextOrder);
  };

  return (
    <CustomFieldsContainer
      fields={fields}
      values={fieldValues}
      onChange={handleValueChange}
      onAddField={handleAddField}
      onEditField={handleEditField}
      onDeleteField={handleDeleteField}
      onReorder={handleReorder}
      mode={mode}
    />
  );
}

