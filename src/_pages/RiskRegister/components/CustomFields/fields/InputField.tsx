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
