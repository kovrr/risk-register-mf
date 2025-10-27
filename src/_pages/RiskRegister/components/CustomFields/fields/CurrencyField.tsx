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
