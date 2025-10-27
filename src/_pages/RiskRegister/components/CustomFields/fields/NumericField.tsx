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
