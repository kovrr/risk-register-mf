# Custom Fields Feature Blueprint

## Overview
- `CustomFieldsSection` owns scenario-level state, applies optimistic updates, and persists via `useUpdateRiskRegisterScenarioField`.
- `CustomFieldsContainer` renders the list UI, handles drag-and-drop reordering, and opens the add/edit wizard with guest-user protections.
- `AddFieldWizard`, `FieldTypeSelection`, and `FieldConfiguration` compose the creation/edit flow and enforce per-type metadata like currency codes.
- `CustomFieldRenderer`, `FieldWrapper`, and the `fields/` primitives encapsulate per-field interactions (text, number, currency, date, tags) including demo-mode gating.
- `CustomField` types and Cypress coverage (`customFields.cy.tsx`) must travel with the feature to keep type-safety and regression coverage intact.

## File-by-file source

### `src/_pages/RiskRegister/ScenarioDrillDown/RiskManagement/CustomFields.tsx`
```tsx
import { useUpdateRiskRegisterScenarioField } from '@/service/hooks';
import { CustomField, RiskRegisterResponse } from '@/types/riskRegister';
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

```

### `src/_pages/RiskRegister/components/CustomFields/CustomFieldsContainer.tsx`
```tsx
import { DemoExperienceContext } from '@/DemoExperienceContext';
import { CustomField } from '@/types/riskRegister';
import { Plus } from 'lucide-react';
import { useIsGuestUser } from 'permissions/use-permissions';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AddFieldWizard } from './AddFieldWizard';
import { CustomFieldRenderer } from './FieldRenderer';

interface CustomFieldsContainerProps {
  fields: CustomField[];
  values: Record<string, any>;
  onChange?: (fieldId: string, value: any) => void;
  onAddField: (field: Omit<CustomField, 'id'>) => void;
  onEditField: (fieldId: string, field: Partial<CustomField>) => void;
  onDeleteField: (fieldId: string) => void;
  onReorder: (fields: CustomField[]) => void;
  mode?: 'edit' | 'view';
}

export function CustomFieldsContainer({
  fields,
  values,
  onChange,
  onAddField,
  onEditField,
  onDeleteField,
  onReorder,
  mode = 'edit',
}: CustomFieldsContainerProps) {
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [editFieldId, setEditFieldId] = React.useState<string | null>(null);
  const [editFieldData, setEditFieldData] = React.useState<CustomField | null>(
    null,
  );
  const { t } = useTranslation('common');
  const isGuestUser = useIsGuestUser();
  const { showDemoModal } = useContext(DemoExperienceContext);

  const handleFieldChange = (fieldId: string, value: any) => {
    onChange?.(fieldId, value);
  };

  const handleEditField = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field) return;

    setEditFieldId(fieldId);
    setEditFieldData(field);
    setIsWizardOpen(true);
  };

  const handleWizardClose = () => {
    setIsWizardOpen(false);
    setEditFieldId(null);
    setEditFieldData(null);
  };

  const handleWizardCreateOrEdit = (field: Omit<CustomField, 'id'>) => {
    if (editFieldId) {
      // Edit existing field
      onEditField(editFieldId, field);
    } else {
      // Add new field
      onAddField(field);
    }
    handleWizardClose();
  };

  const handleAddFieldClick = () => {
    if (isGuestUser) {
      showDemoModal({ title: t('addCustomField') });
      return;
    }
    setIsWizardOpen(true);
    setEditFieldId(null);
    setEditFieldData(null);
  };

  return (
    <div
      className='flex max-w-[600px] flex-1 flex-col items-start gap-[20px] self-stretch rounded-br-[20px] rounded-tr-[20px] bg-white p-5'
      style={{ borderRadius: '0px 20px 20px 0px' }}
    >
      <div className='flex w-full items-center justify-between'>
        <span
          style={{
            color: 'var(--Text-Base-Primary, #303045)',
            fontFamily: 'var(--Font-Family-Primary, \"Source Sans Pro\")',
            fontSize: 'var(--Font-Size-Large, 16px)',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: 'normal',
          }}
        >
          {t('riskRegister.customFields.title')}
        </span>
        {mode === 'edit' && (
          <button
            onClick={handleAddFieldClick}
            style={{
              display: 'flex',
              padding: '8px 16px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              borderRadius: 'var(--Button, 15px)',
              border: '1px solid var(--Fill-Brand-Primary, #5551F7)',
              background: 'var(--Fill-Base-0, #FFF)',
              color: 'var(--Text-Brand-Primary, #5551F7)',
              fontFamily: 'var(--Font-Family-Primary, "Source Sans Pro")',
              fontSize: 'var(--Font-Size-Regular, 14px)',
              fontStyle: 'normal',
              fontWeight: 600,
              lineHeight: 'normal',
            }}
          >
            <Plus size={16} /> {t('riskRegister.customFields.add')}
          </button>
        )}
      </div>

      <div className='w-full space-y-4'>
        {fields.map((field, index) => (
          <div
            key={field.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', index.toString());
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const fromIndex = Number(e.dataTransfer.getData('text/plain'));
              const toIndex = index;
              if (fromIndex !== toIndex) {
                const reorderedFields = [...fields];
                const [movedItem] = reorderedFields.splice(fromIndex, 1);
                reorderedFields.splice(toIndex, 0, movedItem);
                onReorder(reorderedFields);
              }
            }}
          >
            <CustomFieldRenderer
              field={field}
              value={values[field.id]}
              onChange={(value) => handleFieldChange(field.id, value)}
              mode={mode}
              onEdit={() => handleEditField(field.id)}
              onDelete={() => onDeleteField(field.id)}
              isGuestUser={isGuestUser}
            />
          </div>
        ))}
      </div>

      <AddFieldWizard
        open={isWizardOpen}
        onClose={handleWizardClose}
        onCreate={handleWizardCreateOrEdit}
        initialField={editFieldData}
      />
    </div>
  );
}

```

### `src/_pages/RiskRegister/components/CustomFields/AddFieldWizard.tsx`
```tsx
import React from 'react';
import { CustomField, customFieldTypes } from '@/types/riskRegister';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent } from '@/newComponents/atoms/dialog';
import { FieldTypeSelection, FieldTypeOption } from './FieldTypeSelection';
import { FieldConfiguration } from './FieldConfiguration';

interface AddFieldWizardProps {
  open: boolean;
  onClose: () => void;
  onCreate: (field: Omit<CustomField, 'id'>) => void;
  initialField?: CustomField | null;
}

export function AddFieldWizard({
  open,
  onClose,
  onCreate,
  initialField,
}: AddFieldWizardProps) {
  const { t } = useTranslation('common');
  const [step, setStep] = React.useState<'choose' | 'config'>('choose');
  const [selectedType, setSelectType] = React.useState<FieldTypeOption | null>(
    null,
  );

  const FIELD_TYPES: FieldTypeOption[] = React.useMemo(
    () => [
      {
        type: customFieldTypes.CURRENCY,
        label: t('riskRegister.customFields.wizard.fieldTypes.currency.label'),
        subtitle: t(
          'riskRegister.customFields.wizard.fieldTypes.currency.subtitle',
        ),
      },
      {
        type: customFieldTypes.NUMBER,
        label: t('riskRegister.customFields.wizard.fieldTypes.number.label'),
        subtitle: t(
          'riskRegister.customFields.wizard.fieldTypes.number.subtitle',
        ),
      },
      {
        type: customFieldTypes.TAGS,
        label: t('riskRegister.customFields.wizard.fieldTypes.tags.label'),
        subtitle: t(
          'riskRegister.customFields.wizard.fieldTypes.tags.subtitle',
        ),
      },
      {
        type: customFieldTypes.DATE,
        label: t('riskRegister.customFields.wizard.fieldTypes.date.label'),
        subtitle: t(
          'riskRegister.customFields.wizard.fieldTypes.date.subtitle',
        ),
      },
      {
        type: customFieldTypes.TEXT,
        label: t('riskRegister.customFields.wizard.fieldTypes.text.label'),
        subtitle: t(
          'riskRegister.customFields.wizard.fieldTypes.text.subtitle',
        ),
      },
    ],
    [t],
  );

  React.useEffect(() => {
    if (open && initialField) {
      const fieldType =
        FIELD_TYPES.find((t) => t.type === initialField.field_type) || null;
      setSelectType(fieldType);
      setStep('config');
    } else {
      setStep('choose');
      setSelectType(null);
    }
  }, [initialField, open, FIELD_TYPES]);

  const reset = () => {
    setStep('choose');
    setSelectType(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSelectFieldType = (fieldType: FieldTypeOption) => {
    setSelectType(fieldType);
    setStep('config');
  };

  const handleBack = () => {
    // When going back from an edit, we close the modal entirely
    if (initialField) {
      handleClose();
    } else {
      setStep('choose');
    }
  };

  const handleSave = (config: { name: string; currency?: string }) => {
    if (!config.name || !selectedType) return;
    onCreate({
      field_name: config.name,
      field_type: selectedType.type,
      attributes:
        selectedType.type === 'currency' ? { currency: config.currency } : {},
      value: initialField?.value,
    });
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className='max-h-[90vh] w-full max-w-2xl overflow-y-auto'>
        {step === 'choose' ? (
          <FieldTypeSelection
            fieldTypes={FIELD_TYPES}
            onSelect={handleSelectFieldType}
          />
        ) : selectedType ? (
          <FieldConfiguration
            selectedFieldType={selectedType}
            onBack={handleBack}
            onSave={handleSave}
            initialField={initialField}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

```

### `src/_pages/RiskRegister/components/CustomFields/FieldRenderer.tsx`
```tsx
import { CustomField, customFieldTypes } from '@/types/riskRegister';
import { CurrencyField } from './fields/CurrencyField';
import { DateField } from './fields/DateField';
import { NumericField } from './fields/NumericField';
import { TagsField } from './fields/TagsField';
import { TextField } from './fields/TextField';
import { FieldWrapper } from './FieldWrapper';

interface FieldRendererProps {
  field: CustomField;
  value: any;
  onChange?: (value: any) => void;
  mode?: 'edit' | 'view';
  onEdit?: () => void;
  onDelete?: () => void;
  isGuestUser?: boolean;
}

export function CustomFieldRenderer({
  field,
  value,
  onChange,
  mode = 'edit',
  onEdit,
  onDelete,
  isGuestUser,
}: FieldRendererProps) {
  const sharedProps = { value, onChange, mode };

  const renderField = () => {
    switch (field.field_type) {
      case customFieldTypes.CURRENCY:
        return <CurrencyField {...sharedProps} field={field} isGuestUser={isGuestUser} />;
      case customFieldTypes.NUMBER:
        return <NumericField {...sharedProps} isGuestUser={isGuestUser} />;
      case customFieldTypes.DATE:
        return <DateField {...sharedProps} isGuestUser={isGuestUser} />;
      case customFieldTypes.TAGS:
        return <TagsField {...sharedProps} isGuestUser={isGuestUser} />;
      default:
        return <TextField {...sharedProps} isGuestUser={isGuestUser} />;
    }
  };

  return (
    <FieldWrapper
      label={field.field_name}
      mode={mode}
      onEdit={onEdit}
      onDelete={onDelete}
      fieldId={field.id}
    >
      {renderField()}
    </FieldWrapper>
  );
}

```

### `src/_pages/RiskRegister/components/CustomFields/FieldWrapper.tsx`
```tsx
import { DemoExperienceContext } from '@/DemoExperienceContext';
import Image from 'next/image';
import { useIsGuestUser } from 'permissions/use-permissions';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import HamburgerIcon from '../icons/HamburgerIcon.svg';
import PencilIcon from '../icons/PencilIcon.svg';
import TrashIcon from '../icons/TrashIcon.svg';
export const INPUT =
  'w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-600 focus:ring-blue-600 disabled:bg-gray-100';

interface FieldWrapperProps {
  label: string;
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  mode?: 'edit' | 'view';
  fieldId?: string;
}

export function FieldWrapper({
  label,
  children,
  mode,
  onEdit,
  onDelete,
  fieldId,
}: FieldWrapperProps) {
  const isGuestUser = useIsGuestUser();
  const { showDemoModal } = useContext(DemoExperienceContext);
  const { t } = useTranslation('riskRegister');

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <div
      className='flex w-full max-w-[600px] items-center'
      data-testid={fieldId ? `field-${fieldId}` : undefined}
    >
      <div className='flex-1'>
        <div className='flex items-center gap-[5px]' style={{ width: '170px' }}>
          <label
            title={label}
            className='truncate'
            style={{
              color: 'var(--Text-Base-Primary, #303045)',
              fontFamily: 'var(--Font-Family-Primary, "Source Sans Pro")',
              fontSize: 'var(--Font-Size-Regular, 14px)',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: 'normal',
            }}
          >
            {label}
          </label>
          {mode === 'edit' && (
            <button
              type='button'
              onClick={isGuestUser ? () => showDemoModal({ title: t('demo.editScenario') }) : handleEditClick}
              className='flex h-[24px] w-[24px] flex-shrink-0 items-center justify-center rounded-[5px] p-1 hover:bg-gray-100'
              tabIndex={-1}
              data-testid='field-edit-button'
            >
              <Image src={PencilIcon} alt='' />
            </button>
          )}
        </div>
      </div>

      <div className='flex-shrink-0' style={{ width: '146px' }}
        onClick={isGuestUser ? () => showDemoModal({ title: t('demo.editField') }) : undefined}>
        {children}
      </div>

      {
        mode === 'edit' && (
          <div className='flex flex-shrink-0 items-center gap-4 pl-4'>
            <div className={isGuestUser ? 'cursor-not-allowed' : 'cursor-grab'} data-testid='field-drag-handle'
              onClick={isGuestUser ? () => showDemoModal({ title: t('demo.editScenario') }) : onDelete}>
              <Image src={HamburgerIcon} alt='drag handle' />
            </div>
            {onDelete && (
              <button
                type='button'
                onClick={isGuestUser ? () => showDemoModal({ title: t('demo.editScenario') }) : onDelete}
                className='flex items-center justify-center'
                tabIndex={-1}
                data-testid='field-delete-button'
              >
                <Image src={TrashIcon} alt='delete' />
              </button>
            )}
          </div>
        )
      }
    </div >
  );
}

```

### `src/_pages/RiskRegister/components/CustomFields/FieldTypeSelection.tsx`
```tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CustomFieldType } from '@/types/riskRegister';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/newComponents/atoms/dialog';

export type FieldTypeOption = {
  type: CustomFieldType;
  label: string;
  subtitle: string;
};

interface FieldTypeSelectionProps {
  fieldTypes: FieldTypeOption[];
  onSelect: (fieldType: FieldTypeOption) => void;
}

export const FieldTypeSelection: React.FC<FieldTypeSelectionProps> = ({
  fieldTypes,
  onSelect,
}) => {
  const { t } = useTranslation('common');

  return (
    <>
      <DialogHeader className='mb-6'>
        <DialogTitle>{t('riskRegister.customFields.wizard.title')}</DialogTitle>
        <DialogDescription>
          {t('riskRegister.customFields.wizard.subtitle')}
        </DialogDescription>
      </DialogHeader>
      <div className='flex flex-nowrap items-stretch gap-x-[5px] overflow-x-auto pb-2'>
        {fieldTypes.map((ft) => (
          <button
            key={ft.type}
            onClick={() => onSelect(ft)}
            className='flex h-[127px] w-[128px] flex-col items-start justify-start rounded-[10px] border-2 border-blue-500 bg-white px-[18px] py-5 transition-all duration-150 hover:border-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300'
            data-testid={`field-type-select-${ft.type}`}
          >
            <span className='mb-1 text-base font-semibold text-blue-800'>
              {ft.label}
            </span>
            <span className='text-left text-xs font-normal leading-tight text-gray-500'>
              {ft.subtitle}
            </span>
          </button>
        ))}
      </div>
    </>
  );
};

```

### `src/_pages/RiskRegister/components/CustomFields/FieldConfiguration.tsx`
```tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Plus } from 'lucide-react';
import { CURRENCY_CODES } from '@/options/constants';
import { CustomField } from '@/types/riskRegister';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/newComponents/atoms/dialog';
import { FieldTypeOption } from './FieldTypeSelection';

interface FieldConfigurationProps {
  selectedFieldType: FieldTypeOption;
  onBack: () => void;
  onSave: (config: { name: string; currency?: string }) => void;
  initialField?: CustomField | null;
}

export const FieldConfiguration: React.FC<FieldConfigurationProps> = ({
  selectedFieldType,
  onBack,
  onSave,
  initialField,
}) => {
  const { t } = useTranslation('common');
  const [name, setName] = React.useState('');
  const [currency, setCurrency] = React.useState('USD');

  React.useEffect(() => {
    if (initialField) {
      setName(initialField.field_name);
      if (
        initialField.field_type === 'currency' &&
        initialField.attributes?.currency
      ) {
        setCurrency(initialField.attributes.currency);
      }
    } else {
      setName('');
      setCurrency('USD');
    }
  }, [initialField]);

  const handleSave = () => {
    onSave({
      name: name.trim(),
      ...(selectedFieldType.type === 'currency' && { currency }),
    });
  };

  const title = t('riskRegister.customFields.wizard.titleConfigure', {
    type: selectedFieldType.label,
  });
  const backText = initialField
    ? t('riskRegister.customFields.wizard.back')
    : t('riskRegister.customFields.wizard.backToFieldTypes');

  return (
    <>
      <DialogHeader className='mb-4'>
        <button
          onClick={onBack}
          className='-ml-1 mb-2 flex w-fit items-center text-sm text-blue-600 hover:underline'
          data-testid='field-config-back-button'
        >
          <ArrowLeft size={14} className='mr-1' />
          {backText}
        </button>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{selectedFieldType.subtitle}</DialogDescription>
      </DialogHeader>

      <div className='grid items-start gap-6 sm:grid-cols-2'>
        <div className='space-y-1'>
          <label className='text-sm font-medium'>
            {t('riskRegister.customFields.wizard.fieldNameLabel')}
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-600 focus:ring-blue-600'
            maxLength={20}
            data-testid='field-name-input'
          />
          <p className='text-right text-xs text-gray-500'>{name.length}/20</p>
        </div>
        {selectedFieldType.type === 'currency' && (
          <div className='space-y-1'>
            <label className='text-sm font-medium'>
              {t('riskRegister.customFields.wizard.fieldTypes.currency.label')}
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-600 focus:ring-blue-600'
              data-testid='field-currency-select'
            >
              {CURRENCY_CODES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className='mt-8 flex justify-end'>
        <button
          disabled={!name.trim()}
          onClick={handleSave}
          className='flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50'
          data-testid='field-config-save-button'
        >
          <Plus size={16} />{' '}
          {initialField
            ? t('riskRegister.customFields.wizard.updateButton')
            : t('riskRegister.customFields.wizard.saveButton')}
        </button>
      </div>
    </>
  );
};

```

### `src/_pages/RiskRegister/components/CustomFields/fields/InputField.tsx`
```tsx
import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  'data-testid'?: string;
}

export function InputField({
  type,
  value,
  onChange,
  className,
  'data-testid': dataTestId,
  ...props
}: InputFieldProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={className}
      data-testid={dataTestId}
      {...props}
    />
  );
}

```

### `src/_pages/RiskRegister/components/CustomFields/fields/CurrencyField.tsx`
```tsx
import { CustomField } from '@/types/riskRegister';
import React from 'react';
import { InputField } from './InputField';

interface CurrencyFieldProps {
  value: number;
  onChange?: (value: number) => void;
  mode?: 'edit' | 'view';
  field: CustomField;
  isGuestUser?: boolean;
}

export function CurrencyField({
  value,
  onChange,
  mode = 'edit',
  field,
  isGuestUser,
}: CurrencyFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue =
      e.target.value === '' ? 0 : Math.round(Number(e.target.value));
    onChange?.(newValue);
  };

  return (
    <div className='relative'>
      <InputField
        type='number'
        value={value}
        onChange={handleChange}
        disabled={mode === 'view' || isGuestUser}
        data-testid='currency-field-input'
        className='w-full rounded-lg border border-gray-300 px-4 py-2 pr-12 text-sm focus:border-blue-600 focus:ring-blue-600 disabled:bg-gray-100'
      />
      <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500'>
        {field.attributes?.currency || 'USD'}
      </span>
    </div>
  );
}

```

### `src/_pages/RiskRegister/components/CustomFields/fields/NumericField.tsx`
```tsx
import React from 'react';
import { InputField } from './InputField';

interface NumericFieldProps {
  value: number;
  onChange?: (value: number) => void;
  mode?: 'edit' | 'view';
  isGuestUser?: boolean;
}

export function NumericField({
  value,
  onChange,
  mode = 'edit',
  isGuestUser,
}: NumericFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const parsed = Number(newValue);
    onChange?.(isNaN(parsed) ? 0 : parsed);
  };

  return (
    <InputField
      type='number'
      value={value}
      onChange={handleChange}
      disabled={mode === 'view' || isGuestUser}
      data-testid='number-field-input'
      className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-600 focus:ring-blue-600 disabled:bg-gray-100'
    />
  );
}

```

### `src/_pages/RiskRegister/components/CustomFields/fields/DateField.tsx`
```tsx
import React from 'react';
import { InputField } from './InputField';

interface DateFieldProps {
  value: any;
  onChange?: (value: any) => void;
  mode?: 'edit' | 'view';
  isGuestUser?: boolean;
}

export const DateField: React.FC<DateFieldProps> = ({
  value,
  onChange,
  isGuestUser,
  ...props
}) => {
  // Convert datetime to yyyy-mm-dd string for input
  const formatDate = (date: any) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    // Convert to yyyy-mm-dd string
    return d.toISOString().split('T')[0];
  };

  // Convert yyyy-mm-dd string to datetime for onChange
  const handleChange = (dateStr: string) => {
    if (!dateStr) {
      onChange?.(null);
      return;
    }
    const date = new Date(dateStr);
    onChange?.(date.toISOString());
  };

  return (
    <InputField
      {...props}
      type='date'
      value={formatDate(value)}
      onChange={(e) => handleChange(e.target.value)}
      data-testid='date-field-input'
      disabled={isGuestUser}
    />
  );
};

```

### `src/_pages/RiskRegister/components/CustomFields/fields/TextField.tsx`
```tsx
import { InputField } from './InputField';

interface TextFieldProps {
  value: string;
  onChange?: (value: string) => void;
  mode?: 'edit' | 'view';
  isGuestUser?: boolean;
}

export function TextField({ value, onChange, mode = 'edit', isGuestUser }: TextFieldProps) {
  return (
    <InputField
      type='text'
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={mode === 'view' || isGuestUser}
      data-testid='text-field-input'
      className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-600 focus:ring-blue-600 disabled:bg-gray-100'
    />
  );
}

```

### `src/_pages/RiskRegister/components/CustomFields/fields/TagsField.tsx`
```tsx
import { DemoExperienceContext } from '@/DemoExperienceContext';
import { X } from 'lucide-react';
import { useIsGuestUser } from 'permissions/use-permissions';
import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TagsFieldProps {
  value: string[];
  onChange?: (value: string[]) => void;
  mode?: 'edit' | 'view';
  isGuestUser?: boolean;
}

export const TagsField: React.FC<TagsFieldProps> = ({
  value = [],
  onChange,
  mode = 'edit',
  isGuestUser: propIsGuestUser,
}) => {
  const { t } = useTranslation('common');
  const [inputValue, setInputValue] = useState('');
  const tags = value || [];
  const inputRef = useRef<HTMLInputElement>(null);
  const isGuestUser = useIsGuestUser() || propIsGuestUser;
  const { showDemoModal } = useContext(DemoExperienceContext);

  const addTags = (newTags: string[]) => {
    if (isGuestUser) {
      showDemoModal({ title: t('demo.editTags') });
      return;
    }
    const validTags = newTags
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0 && !tags.includes(tag));
    if (validTags.length > 0) {
      onChange?.([...tags, ...validTags]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
      e.preventDefault();
      addTags([inputValue]);
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (isGuestUser) {
      showDemoModal({ title: t('demo.editTags') });
      return;
    }
    onChange?.(tags.filter((tag) => tag !== tagToRemove));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const newTags = paste.split(',');
    addTags(newTags);
    setInputValue('');
  };

  const clearAll = () => {
    if (isGuestUser) {
      showDemoModal({ title: t('demo.editTags') });
      return;
    }
    onChange?.([]);
  };

  if (mode === 'view') {
    return (
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <div
            key={tag}
            className='rounded bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800'
          >
            {tag}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='relative w-full'>
      <div
        className='flex w-full flex-wrap items-center gap-1 rounded-lg border border-gray-300 px-2 py-1 text-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 disabled:bg-gray-100'
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <div
            key={tag}
            className='flex items-center gap-1 rounded-md bg-gray-200 px-2 py-1 text-sm text-gray-700'
          >
            <span>{tag}</span>
            <button
              type='button'
              onClick={() => removeTag(tag)}
              className='rounded-full p-0.5 hover:bg-gray-300'
              aria-label={`Remove ${tag}`}
              data-testid={`remove-tag-${tag}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={
            tags.length === 0
              ? t('riskRegister.customFields.fields.tags.placeholder')
              : ''
          }
          className='min-w-[120px] flex-1 bg-transparent py-1 focus:outline-none'
          data-testid='new-tag-input'
          disabled={isGuestUser}
        />
      </div>
      {tags.length > 0 && (
        <button
          type='button'
          onClick={clearAll}
          className='absolute inset-y-0 right-0 flex items-center pr-3'
          aria-label='Clear all tags'
        >
          <X size={16} className='text-gray-500 hover:text-gray-700' />
        </button>
      )}
    </div>
  );
};

```

### `src/_pages/RiskRegister/components/CustomFields/fields/index.ts`
```ts
export { CurrencyField } from './CurrencyField';
export { NumericField } from './NumericField';
export { TextField } from './TextField';
export { DateField } from './DateField';
export { TagsField } from './TagsField';

```

### `src/types/riskRegister.ts`
```ts
import { CisV7SafeguardsImplementation } from '@/options/cisControls';
import { CisV8SafeguardsImplementation } from '@/options/cisV8Controls';
import { CurrencyCodeType } from '@/options/constants';
import { NistV2SafeguardsImplementation } from '@/options/nistV2Controls';
import { SecControlsType } from './companyForm';
import {
  ControlScenarios,
  CostComponentsBreakdown,
  LeanSimulationExposure,
} from './quantificationData';
import { ImplementationLevel, ISO27001ImplementationLevel } from './sphereForm';

export const riskRegisterLikelihoods = {
  Expected: 'Expected',
  Likely: 'Likely',
  Possible: 'Possible',
  Unlikely: 'Unlikely',
  Rare: 'Rare',
} as const;

export type RiskRegisterLikelihood = keyof typeof riskRegisterLikelihoods;

export const riskRegisterImpacts = {
  Negligible: 'Negligible',
  Minor: 'Minor',
  Moderate: 'Moderate',
  Significant: 'Significant',
  Severe: 'Severe',
} as const;

export type RiskRegisterImpact = keyof typeof riskRegisterImpacts;

export const riskRegisterPriorities = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
  Critical: 'Critical',
} as const;

export type RiskRegisterPriority = keyof typeof riskRegisterPriorities;

export const riskRegisterResponsePlans = {
  Mitigate: 'Mitigate',
  Accept: 'Accept',
  Transfer: 'Transfer',
  Avoid: 'Avoid',
} as const;

export type RiskRegisterResponsePlan = keyof typeof riskRegisterResponsePlans;

export type RiskOwner = {
  id: string;
  email: string;
  active_tenant: string;
  tenant_ids: string[];
};

export type RiskRegisterRow = {
  id: string;
  scenarioId: string;
  version: number;
  customerScenarioId: string;
  scenario: null;
  scenarioTitle: string;
  scenarioDescription: string;
  entity?: string;
  company_id?: string;
  company_name?: string | null;
  likelihood: RiskRegisterLikelihood;
  impact: RiskRegisterImpact;
  annualLikelihood?: number;
  averageLoss?: number;
  averageLossCurrency?: CurrencyCodeType;
  priority?: RiskRegisterPriority;
  responsePlan?: RiskRegisterResponsePlan;
  lastUpdated: string;
  owner?: string;
  scenarioType: ScenarioType;
  status: ScenarioStatus;
  tableOptions: null;
  crqData?: CRQData;
};

export type ControlsFrameworkLevelsServer = {
  cis_implementation_level: ImplementationLevel;
  cis_v7_safeguards: CisV7SafeguardsImplementation;
  nist_implementation_level: ImplementationLevel;
  iso27001_implementation_level: ISO27001ImplementationLevel;
  cis_v8_implementation_level_igs: ImplementationLevel;
  cis_v8_safeguards: CisV8SafeguardsImplementation;
  nist_v2_safeguard_implementation: NistV2SafeguardsImplementation;
  tisax_implementation_level: ImplementationLevel;
  relevant_cis_controls: string[];
  relevant_nist_controls: string[];
  relevant_nist_v2_controls: string[];
  relevant_iso27001_controls: string[];
  relevant_cis_v8_controls: string[];
  relevant_cis_v8_safeguards: string[];
  relevant_cis_v7_safeguards: string[];
  relevant_tisax_controls: string[];
};

export type ControlsFrameworkLevels = {
  cis_implementation_level: ImplementationLevel;
  cis_v7_safeguards: ImplementationLevel;
  nist_implementation_level: ImplementationLevel;
  iso27001_implementation_level: ImplementationLevel;
  cis_v8_implementation_level_igs: ImplementationLevel;
  cis_v8_safeguards: ImplementationLevel;
  nist_v2_safeguard_implementation: ImplementationLevel;
  tisax_implementation_level: ImplementationLevel;
  relevant_cis_controls: Set<string>;
  relevant_nist_controls: Set<string>;
  relevant_nist_v2_controls: Set<string>;
  relevant_iso27001_controls: Set<string>;
  relevant_cis_v8_controls: Set<string>;
  relevant_cis_v8_safeguards: Set<string>;
  relevant_cis_v7_safeguards: Set<string>;
  relevant_tisax_controls: Set<string>;
};

export type CRQScenarioFilters = {
  initial_vector_filter: string[] | null;
  event_type_filter: string[] | null;
  impact_type_filter: string[] | null;
  asset_groups_filter: string[] | null;
  duration_percentiles_filter_min_value: number | null;
  duration_percentiles_filter_max_value: number | null;
  affected_records_percentiles_filter_min_val: number | null;
  affected_records_percentiles_filter_max_val: number | null;
  min_damage_filter: number | null;
  max_damage_filter: number | null;
  min_number_of_records_filter: number | null;
  max_number_of_records_filter: number | null;
  min_duration_filter: number | null;
  max_duration_filter: number | null;
};

type ExampleEvent = {
  event_loss: number;
  event_type: string;
  hazard_category: string;
  event_duration: number;
  num_of_data_records_compromised: number;
  event_description: string;
};

export type ExampleEvents = {
  median?: ExampleEvent;
  maximum?: ExampleEvent;
};

export type CRQScenarioResults = {
  control_scenarios?: ControlScenarios;
  cost_components_breakdown?: CostComponentsBreakdown;
  example_events?: ExampleEvents;
  lean_simulation_exposure?: LeanSimulationExposure;
};

export type CRQData = {
  company_id: string;
  fq_id?: string;
  filters: Partial<CRQScenarioFilters>;
  results?: CRQScenarioResults;
  is_crq_up_to_date: boolean;
};

export const scenarioTypes = {
  MANUAL: 'manual',
  CRQ: 'crq',
} as const;

export type ScenarioType = (typeof scenarioTypes)[keyof typeof scenarioTypes];

export const customFieldTypes = {
  CURRENCY: 'currency',
  NUMBER: 'number',
  TEXT: 'text',
  DATE: 'date',
  TAGS: 'tags',
} as const;

export type CustomFieldType =
  (typeof customFieldTypes)[keyof typeof customFieldTypes];

export type CustomField = {
  id: string;
  field_name: string;
  field_type: CustomFieldType;
  attributes?: Record<string, any>;
  value?: any;
};

export type ScenarioData = {
  likelihood: RiskRegisterLikelihood;
  impact: RiskRegisterImpact;
  company_id?: string;
  annual_likelihood?: number;
  peer_base_rate?: number;
  average_loss?: number;
  average_loss_currency?: CurrencyCodeType;
  impact_distribution?: ImpactDistribution;
  risk_priority?: RiskRegisterPriority;
  response_plan?: RiskRegisterResponsePlan;
  risk_owner?: string;
  ticket?: string;
  methodology_insights?: string;
  relevant_controls: ControlsFrameworkLevelsServer;
  sec_controls_framework?: SecControlsType;
  crq_data?: CRQData;
  sub_category?: string;
  review_date?: string;
  mitigation_cost?: number;
  custom_fields?: CustomField[];
};

export const scenarioStatus = {
  COMPLETED: 'completed',
  // IN_PROGRESS: 'in_progress',
  // PENDING: 'pending',
} as const;

export type ScenarioStatus =
  (typeof scenarioStatus)[keyof typeof scenarioStatus];

export type RiskRegisterResponse = {
  id: string;
  scenario_id: string;
  tenant_id: string;
  version: number;
  customer_scenario_id: string;
  name: string;
  description: string;
  scenario_data: ScenarioData;
  notes: NoteOutput[];
  created_at: string;
  updated_at: string;
  scenario_type: ScenarioType;
  status: ScenarioStatus;
  company_name?: string | null;
};

export interface MetricDataPoint {
  timestamp: string;
  annual_likelihood: number | null;
  average_loss: number | null;
  version: number;
  currency: string | null;
  fq_id: string;
  targeted_benchmark_annual_rate: number | null;
}

export interface ScenarioMetricsHistory {
  scenario_id: string;
  metrics_history: MetricDataPoint[];
}

export type RiskRegisterScenarioPaginatedResponse = {
  items: RiskRegisterResponse[];
  total: number;
  page: number;
  size: number;
};

export type ImpactDistribution = {
  ninety_nine: number;
  seventy_five: number;
  fifty: number;
  twenty_five: number;
  one: number;
};

export type ScenarioCreateRequest = {
  customer_scenario_id: string;
  name: string;
  description: string;
  likelihood: RiskRegisterLikelihood;
  impact: RiskRegisterImpact;
  company_id?: string;
  annual_likelihood?: number;
  peer_base_rate?: number;
  average_loss?: number;
  average_loss_currency?: CurrencyCodeType;
  impact_distribution?: ImpactDistribution;
  sub_category?: string;
  review_date?: string;
  mitigation_cost?: number;
};

export type CRQScenarioCreateRequest = ScenarioCreateRequest & {
  crq_data: CRQData;
};

export type BaseScenarioUpdateRequest = {
  risk_priority?: RiskRegisterPriority;
  response_plan?: RiskRegisterResponsePlan;
  risk_owner?: string;
  ticket?: string;
  methodology_insights?: string;
  relevant_controls?: ControlsFrameworkLevelsServer;
  custom_fields?: CustomField[];
} & ScenarioCreateRequest;

export type SimpleScenarioUpdateRequest = BaseScenarioUpdateRequest & {
  scenario_type: typeof scenarioTypes.MANUAL;
};

export type CRQScenarioUpdateRequest = {
  scenario_type: typeof scenarioTypes.CRQ;
  crq_data?: CRQData;
} & BaseScenarioUpdateRequest;

export type DocumentOutput = {
  id: string;
  filename: string;
};

export type NoteOutput = {
  id: string;
  content: string;
  user: string;
  created_at: string;
  updated_at: string;
  documents: DocumentOutput[];
};

```

### `cypress/component/risk-register/customFields.cy.tsx`
```tsx
import { CustomFieldsSection } from '@/_pages/RiskRegister/ScenarioDrillDown/RiskManagement/CustomFields';
import {
  CustomField,
  customFieldTypes,
  RiskRegisterResponse,
} from '@/types/riskRegister';
import { BaseDriver } from '../../support/base-driver';
import { buildCRQRiskRegisterResponse } from '@/mocks/builders/riskRegisterBuilders';
import { buildQuantification } from '@/mocks/builders/quantificationBuilders';
import { CompanyApiData, CompanyStatus } from '@/types/companyForm';
import { QuantificationData } from '@/types/quantificationData';
import {
  buildCompanyWithSphere,
  buildLastQuantification,
} from '@/mocks/builders/companyBuilder';
import {
  cisResultsFQNewSchema,
  mockCisInputData,
} from '@/mocks/data/fqResults';

describe('Custom Fields', () => {
  let driver: BaseDriver,
    company: CompanyApiData,
    fq: QuantificationData,
    mockScenario: RiskRegisterResponse;

  beforeEach(() => {
    driver = new BaseDriver();
    company = buildCompanyWithSphere({
      status: CompanyStatus.COMPLETED,
      last_quantification: buildLastQuantification({
        id: 'new-schema-cis-fq-id',
        results_narrative: cisResultsFQNewSchema,
      }),
    });
    fq = buildQuantification({
      id: 'new-schema-cis-fq-id',
      results_narrative: cisResultsFQNewSchema,
      input_data: mockCisInputData,
      status: 'Success',
    });

    mockScenario = buildCRQRiskRegisterResponse(
      {
        customer_scenario_id: 'RISK-001',
        name: 'Test Risk Scenario',
        description: 'This is a test risk scenario description',
      },
      'complete',
      { company_id: company.id },
    );

    // Ensure custom_fields exists
    if (!mockScenario.scenario_data.custom_fields) {
      mockScenario.scenario_data.custom_fields = [];
    }

    // Mock API calls
    cy.intercept(
      'GET',
      `/api/risk-register/scenarios/${mockScenario.scenario_id}`,
      {
        statusCode: 200,
        body: mockScenario,
      },
    ).as('getScenario');

    cy.intercept(
      'PATCH',
      `/api/risk-register/scenarios/${mockScenario.scenario_id}`,
      {
        statusCode: 200,
        body: (req: { body: Partial<RiskRegisterResponse> }) => {
          // Update the mock scenario with the new data
          mockScenario = {
            ...mockScenario,
            scenario_data: {
              ...mockScenario.scenario_data,
              ...req.body,
            },
          };
          return mockScenario;
        },
      },
    ).as('updateScenario');
    driver.withCompanies([company]).withFq([fq]).mock();
    cy.mockFrontegg([]);
    cy.mount(<CustomFieldsSection scenario={mockScenario} />, {
      routerParams: {
        scenarioId: mockScenario.scenario_id,
      },
    });
    cy.wait(1000);
  });

  it('should render all custom fields in view mode', () => {
    const mockFields = mockScenario.scenario_data.custom_fields || [];
    mockFields.forEach((field) => {
      cy.contains(field.field_name).should('be.visible');
    });
  });

  it('should add a new custom field', () => {
    const newField = {
      field_name: 'New Currency Field',
      field_type: customFieldTypes.CURRENCY,
      attributes: { currency: 'EUR' },
    };

    // Click add button
    cy.contains('Add').click();

    // Select field type
    cy.get('[data-testid="field-type-select-currency"]').click();

    // Configure field
    cy.get('[data-testid="field-name-input"]').type(newField.field_name);
    cy.get('[data-testid="field-currency-select"]').select(
      newField.attributes.currency,
    );

    // Save field
    cy.get('[data-testid="field-config-save-button"]').click();

    // Verify the update request
    cy.wait('@updateScenario').then((interception) => {
      const updatedFields = interception.request.body.custom_fields;
      const addedField = updatedFields.find(
        (f: CustomField) => f.field_name === newField.field_name,
      );
      expect(addedField).to.exist;
      expect(addedField.field_type).to.equal(newField.field_type);
      expect(addedField.attributes).to.deep.equal(newField.attributes);
    });
  });

  it('should edit an existing custom field', () => {
    const mockFields = mockScenario.scenario_data.custom_fields || [];
    if (mockFields.length === 0) return;

    const fieldToEdit = mockFields[0];
    const updatedName = 'Updated Field Name';

    // Click edit button for first field
    cy.get('[data-testid="field-edit-button"]').first().click();

    // Edit field name
    cy.get('[data-testid="field-name-input"]').clear().type(updatedName);

    // Save changes
    cy.get('[data-testid="field-config-save-button"]').click();

    // Verify the update request
    cy.wait('@updateScenario').then((interception) => {
      const updatedFields = interception.request.body.custom_fields;
      const updatedField = updatedFields.find(
        (f: CustomField) => f.id === fieldToEdit.id,
      );
      expect(updatedField.field_name).to.equal(updatedName);
    });
  });

  it('should delete a custom field', () => {
    const mockFields = mockScenario.scenario_data.custom_fields || [];
    if (mockFields.length === 0) return;

    const fieldToDelete = mockFields[0];

    // Click delete button for first field
    cy.get('[data-testid="field-delete-button"]').first().click();

    // Verify the update request
    cy.wait('@updateScenario').then((interception) => {
      const updatedFields = interception.request.body.custom_fields;
      expect(updatedFields.find((f: CustomField) => f.id === fieldToDelete.id))
        .to.not.exist;
    });
  });

  describe('Field Validations', () => {
    it.only('should validate field values', () => {
      // Add and validate currency field
      cy.get('[data-testid^="field-"]').then(($fieldsBefore) => {
        const countBefore = $fieldsBefore.length;
        cy.contains('Add').click();
        cy.get('[data-testid="field-type-select-currency"]').click();
        cy.get('[data-testid="field-name-input"]').type('Currency Field');
        cy.get('[data-testid="field-currency-select"]').select('USD');
        cy.get('[data-testid="field-config-save-button"]').click();
        cy.wait('@updateScenario');
        cy.get('[data-testid^="field-"]')
          .should('have.length.greaterThan', countBefore)
          .then(($fieldsAfter) => {
            cy.wrap($fieldsAfter[countBefore]).within(() => {
              cy.get('[data-testid="currency-field-input"]').should('exist');
              cy.get('[data-testid="currency-field-input"]')
                .clear()
                .type('abc')
                .should('have.value', '');
              cy.get('[data-testid="currency-field-input"]')
                .clear()
                .type('123.45')
                .should('have.value', '1235');
            });
          });
      });

      // Add and validate number field
      cy.get('[data-testid^="field-"]').then(($fieldsBefore) => {
        const countBefore = $fieldsBefore.length;
        cy.contains('Add').click();
        cy.get('[data-testid="field-type-select-number"]').click();
        cy.get('[data-testid="field-name-input"]').type('Number Field');
        cy.get('[data-testid="field-config-save-button"]').click();
        cy.wait('@updateScenario');
        cy.get('[data-testid^="field-"]')
          .should('have.length.greaterThan', countBefore)
          .then(($fieldsAfter) => {
            cy.wrap($fieldsAfter[countBefore]).within(() => {
              cy.get('[data-testid="number-field-input"]').should('exist');
              cy.get('[data-testid="number-field-input"]')
                .clear()
                .type('-100')
                .should('have.value', '-100');
              cy.get('[data-testid="number-field-input"]')
                .clear()
                .type('abc')
                .should('have.value', '0');
              cy.get('[data-testid="number-field-input"]')
                .clear()
                .type('123.45')
                .should('have.value', '123.450');
            });
          });
      });

      // Add and validate date field
      cy.get('[data-testid^="field-"]').then(($fieldsBefore) => {
        const countBefore = $fieldsBefore.length;
        cy.contains('Add').click();
        cy.get('[data-testid="field-type-select-date"]').click();
        cy.get('[data-testid="field-name-input"]').type('Date Field');
        cy.get('[data-testid="field-config-save-button"]').click();
        cy.wait('@updateScenario');
        cy.get('[data-testid^="field-"]')
          .should('have.length.greaterThan', countBefore)
          .then(($fieldsAfter) => {
            cy.wrap($fieldsAfter[countBefore]).within(() => {
              cy.get('[data-testid="date-field-input"]').should('exist');
              cy.get('[data-testid="date-field-input"]')
                .click()
                .type('2024-12-31');
              cy.get('[data-testid="date-field-input"]').should(
                'have.value',
                '2024-12-31',
              );
            });
          });
      });

      // Add and validate text field
      cy.get('[data-testid^="field-"]').then(($fieldsBefore) => {
        const countBefore = $fieldsBefore.length;
        cy.contains('Add').click();
        cy.get('[data-testid="field-type-select-text"]').click();
        cy.get('[data-testid="field-name-input"]').type('Text Field');
        cy.get('[data-testid="field-config-save-button"]').click();
        cy.wait('@updateScenario');
        cy.get('[data-testid^="field-"]')
          .should('have.length.greaterThan', countBefore)
          .then(($fieldsAfter) => {
            cy.wrap($fieldsAfter[countBefore]).within(() => {
              cy.get('[data-testid="text-field-input"]').should('exist');
              cy.get('[data-testid="text-field-input"]')
                .clear()
                .type('a'.repeat(39))
                .should('have.value', 'a'.repeat(39));
            });
          });
      });

      // Add and validate tags field
      cy.get('[data-testid^="field-"]').then(($fieldsBefore) => {
        const countBefore = $fieldsBefore.length;
        cy.contains('Add').click();
        cy.get('[data-testid="field-type-select-tags"]').click();
        cy.get('[data-testid="field-name-input"]').type('Tags Field');
        cy.get('[data-testid="field-config-save-button"]').click();
        cy.wait('@updateScenario');
        cy.get('[data-testid^="field-"]')
          .should('have.length.greaterThan', countBefore)
          .then(($fieldsAfter) => {
            cy.wrap($fieldsAfter[countBefore]).within(() => {
              cy.get('[data-testid="new-tag-input"]').type('   ');
              cy.get('[data-testid="new-tag-input"]')
                .type('tag1')
                .trigger('keydown', { key: 'Tab' });
              cy.get('[data-testid="remove-tag-tag1"]').should('exist');
              cy.get('[data-testid="new-tag-input"]')
                .type('tag2')
                .trigger('keydown', { key: 'Tab' });
              cy.get('[data-testid="remove-tag-tag2"]').should('exist');
              cy.get('[data-testid="new-tag-input"]')
                .type(`${`a`.repeat(100)}`)
                .trigger('keydown', { key: 'Tab' });
              cy.get(`[data-testid="remove-tag-${`a`.repeat(100)}"]`).should(
                'exist',
              );
            });
          });
      });
    });
  });
});

```
