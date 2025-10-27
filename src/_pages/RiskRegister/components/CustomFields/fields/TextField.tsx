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
