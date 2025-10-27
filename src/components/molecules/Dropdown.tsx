import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu';
import { cn } from '@/lib/utils';
import { ChevronDown, Loader2 } from 'lucide-react';
import type React from 'react';
import { type FC, useState } from 'react';

export type Option = {
  label: string;
  value: any;
  className?: string;
  icon?: React.ReactNode;
};

type Props = {
  defaultValue?: Option;
  options: Option[];
  onChange?: (value: Option) => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  dataTestId?: string;
};

const defaultOption: Option = {
  label: 'Select',
  value: 'Select',
  className: 'text-text-base-secondary border-stroke-base-1 border-2',
};

export const Dropdown: FC<Props> = ({
  defaultValue,
  options,
  onChange,
  className,
  disabled = false,
  isLoading = false,
  dataTestId,
}) => {
  const [selectedValue, setSelectedValue] = useState<Option>(
    defaultValue || defaultOption,
  );

  const handleChange = (value: Option) => {
    setSelectedValue(value);
    onChange?.(value);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex items-center rounded-2xl px-2 py-1 text-xs font-bold text-text-base-invert focus-visible:outline-none',
          (disabled || isLoading) && 'cursor-not-allowed',
          className,
          selectedValue.className,
        )}
        disabled={disabled || isLoading}
        data-testid={dataTestId}
      >
        <div className='flex items-center gap-1'>
          {isLoading && <Loader2 className='h-4 w-4 animate-spin' />}
          {!isLoading && selectedValue.icon}
          {selectedValue.label}
        </div>
        <ChevronDown className='h-4 w-4' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleChange(option)}
            className='focus:bg-fill-base-4 focus:text-text-base-primary'
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
