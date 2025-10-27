import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog';
import type { CustomFieldType } from '@/types/riskRegister';
import type React from 'react';
import { useTranslation } from 'react-i18next';

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
