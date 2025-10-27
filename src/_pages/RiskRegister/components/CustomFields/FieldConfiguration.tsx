import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog';
import { CURRENCY_CODES } from '@/options/constants';
import type { CustomField } from '@/types/riskRegister';
import { ArrowLeft, Plus } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { FieldTypeOption } from './FieldTypeSelection';

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
