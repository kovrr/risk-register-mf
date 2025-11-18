import { Badge } from '@/components/atoms/badge';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/atoms/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/atoms/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import {
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Control, FieldValues } from 'react-hook-form';

type Option = {
  label: string;
  value: string;
  description?: string;
  group?: string;
};

type MultiSelectFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: string;
  options: Option[];
  label: string;
  placeholder?: string;
  info?: ReactNode;
  helperText?: string;
  disabled?: boolean;
  emptyText?: string;
  searchPlaceholder?: string;
  popoverProps?: ComponentPropsWithoutRef<typeof PopoverContent>;
  maxTagCount?: number;
  'data-testid'?: string;
};

const DEFAULT_GROUP = '__default';

export const MultiSelectField = <TFieldValues extends FieldValues>({
  control,
  name,
  options,
  label,
  info,
  helperText,
  placeholder = 'Select options',
  disabled,
  emptyText = 'No options found.',
  searchPlaceholder = 'Search…',
  popoverProps,
  maxTagCount = 3,
  'data-testid': dataTestId,
}: MultiSelectFieldProps<TFieldValues>) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!open) {
      setSearchTerm('');
    }
  }, [open]);

  const groupedOptions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredOptions = normalizedSearch
      ? options.filter((option) => {
        return (
          option.label.toLowerCase().includes(normalizedSearch) ||
          option.value.toLowerCase().includes(normalizedSearch) ||
          option.group?.toLowerCase().includes(normalizedSearch) ||
          option.description?.toLowerCase().includes(normalizedSearch)
        );
      })
      : options;

    return filteredOptions.reduce<Record<string, Option[]>>((acc, option) => {
      const group = option.group ?? DEFAULT_GROUP;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(option);
      return acc;
    }, {});
  }, [options, searchTerm]);

  return (
    <FormField
      control={control}
      name={name as any}
      render={({ field }) => {
        const selectedValues: string[] = Array.isArray(field.value)
          ? field.value
          : [];

        const toggleValue = (value: string) => {
          if (disabled) {
            return;
          }
          if (selectedValues.includes(value)) {
            field.onChange(selectedValues.filter((item) => item !== value));
          } else {
            field.onChange([...selectedValues, value]);
          }
        };

        const clearSelection = (event: MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          field.onChange([]);
        };

        const displayTags = selectedValues
          .map((value) => options.find((option) => option.value === value))
          .filter((option): option is Option => Boolean(option));

        const visibleTags = displayTags.slice(0, maxTagCount);
        const overflowCount =
          displayTags.length > maxTagCount
            ? displayTags.length - maxTagCount
            : 0;

        return (
          <FormItem className='space-y-2'>
            <div className='flex items-center gap-2'>
              <FormLabel className='text-sm font-medium text-text-base-primary'>
                {label}
                {info && <span className='ml-2'>{info}</span>}
              </FormLabel>
            </div>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <div
                    role='button'
                    tabIndex={disabled ? -1 : 0}
                    aria-disabled={disabled}
                    className={cn(
                      'flex min-h-[42px] w-full items-center justify-between rounded-lg border border-border-base bg-fill-base-1 px-3 py-2 text-left text-sm transition-colors hover:border-border-base-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
                      selectedValues.length === 0 && 'text-text-base-tertiary',
                      disabled && 'cursor-not-allowed opacity-60',
                    )}
                    data-testid={dataTestId}
                  >
                    <div className='flex flex-wrap gap-1 text-sm'>
                      {selectedValues.length === 0 && <span>{placeholder}</span>}
                      {visibleTags.map((option) => (
                        <Badge
                          key={option.value}
                          variant='secondary'
                          className='flex items-center gap-1 rounded-md bg-fill-base-3 text-xs font-medium text-text-base-primary'
                        >
                          {option.label}
                        </Badge>
                      ))}
                      {overflowCount > 0 && (
                        <Badge
                          variant='secondary'
                          className='rounded-md bg-fill-base-3 text-xs font-medium text-text-base-primary'
                        >
                          +{overflowCount}
                        </Badge>
                      )}
                    </div>
                    <div className='flex items-center gap-2'>
                      {selectedValues.length > 0 && (
                        <button
                          type='button'
                          onClick={clearSelection}
                          className='flex h-5 w-5 items-center justify-center rounded-full text-text-base-tertiary transition-colors hover:bg-fill-base-3 hover:text-text-base-primary'
                          aria-label='Clear selected options'
                          disabled={disabled}
                        >
                          <X className='h-3 w-3' />
                        </button>
                      )}
                      <ChevronsUpDown className='h-4 w-4 text-text-base-tertiary' />
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className='w-[320px] p-0'
                  align='start'
                  {...popoverProps}
                >
              <Command shouldFilter={false}>
                <CommandInput
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                  placeholder={searchPlaceholder}
                />
                    <CommandList>
                      <CommandEmpty>{emptyText}</CommandEmpty>
                      {Object.entries(groupedOptions).map(
                        ([groupName, groupOptions]) => (
                          <CommandGroup
                            key={groupName}
                            heading={
                              groupName === DEFAULT_GROUP ? undefined : groupName
                            }
                          >
                            {groupOptions.map((option) => {
                              const isSelected = selectedValues.includes(
                                option.value,
                              );
                              return (
                                <CommandItem
                                  key={option.value}
                                  className='flex cursor-pointer items-start gap-2 py-2'
                                  onSelect={() => {
                                    toggleValue(option.value);
                                  }}
                                  disabled={disabled}
                                >
                                  <span className='mt-[2px] flex h-4 w-4 items-center justify-center rounded border border-border-base bg-white'>
                                    <Check
                                      className={cn(
                                        'h-3 w-3 text-fill-brand-primary transition-opacity',
                                        isSelected ? 'opacity-100' : 'opacity-0',
                                      )}
                                    />
                                  </span>
                                  <div className='flex flex-col'>
                                    <span className='text-sm font-medium text-text-base-primary'>
                                      {option.label}
                                    </span>
                                    {option.description && (
                                      <span className='text-xs text-text-base-secondary'>
                                        {option.description}
                                      </span>
                                    )}
                                  </div>
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        ),
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            {helperText && (
              <FormDescription className='text-xs text-text-base-secondary'>
                {helperText}
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

