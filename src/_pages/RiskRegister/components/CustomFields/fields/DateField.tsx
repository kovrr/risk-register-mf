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
