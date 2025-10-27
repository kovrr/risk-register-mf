import { Button } from '@/components/atoms/button';
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
import { useDebounce } from '@/components/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, Loader2, Plus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

export interface AsyncSelectProps<T> {
  /** Async function to fetch options */
  fetcher: (query?: string) => Promise<T[]>;
  /** Preload all data ahead of time */
  preload?: boolean;
  /** Function to filter options */
  filterFn?: (option: T, query: string) => boolean;
  /** Function to render each option */
  renderOption: (option: T) => React.ReactNode;
  /** Function to get the value from an option */
  getOptionValue: (option: T) => string;
  /** Function to get the display value for the selected option */
  getDisplayValue: (option: T) => React.ReactNode;
  /** Custom not found message */
  notFound?: React.ReactNode;
  /** Custom loading skeleton */
  loadingSkeleton?: React.ReactNode;
  /** Currently selected value */
  value: string;
  /** Callback when selection changes */
  onChange: (value: string) => Promise<void> | void;
  /** Label for the select field */
  label: string;
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Disable the entire select */
  disabled?: boolean;
  /** Custom width for the popover */
  width?: string | number;
  /** Custom class names */
  className?: string;
  /** Custom trigger button class names */
  triggerClassName?: string;
  /** Custom no results message */
  noResultsMessage?: string;
  /** Allow clearing the selection */
  clearable?: boolean;
  /** trigger variant */
  triggerVariant?: 'outline' | 'ghost';
  /** Hide chevron */
  hideChevron?: boolean;
  /** Callback when user wants to create a new option */
  onCreateOption?: (inputValue: string) => (void | T) | Promise<void | T>;
  /** Data test id */
  'data-testid'?: string;
}

const CreateOptionCommandItem = ({
  inputValue,
  handleSelect,
}: {
  inputValue: string;
  handleSelect: (inputValue: string) => void | Promise<void>;
}) => {
  return (
    <CommandItem
      key={'create-option'}
      value={inputValue}
      onSelect={handleSelect}
      className='data-[selected=true]:cursor-pointer data-[selected=true]:bg-fill-base-4 data-[selected=true]:text-text-base-primary'
    >
      <Plus className='mr-2 h-4 w-4' />
      {`Add ${inputValue} as a new option`}
    </CommandItem>
  );
};

export function AsyncSelect<T>({
  fetcher,
  preload,
  filterFn,
  renderOption,
  getOptionValue,
  getDisplayValue,
  notFound,
  loadingSkeleton,
  label,
  placeholder = 'Select...',
  value,
  onChange,
  disabled = false,
  width = '200px',
  className,
  triggerClassName,
  noResultsMessage,
  clearable = true,
  triggerVariant = 'outline',
  hideChevron,
  onCreateOption,
  'data-testid': dataTestId,
}: AsyncSelectProps<T>) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState(value);
  const [selectedOption, setSelectedOption] = useState<T | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, preload ? 0 : 300);
  const [originalOptions, setOriginalOptions] = useState<T[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingOption, setUpdatingOption] = useState<T | null>(null);

  useEffect(() => {
    setMounted(true);
    setSelectedValue(value);
  }, [value]);

  // Initialize selectedOption when options are loaded and value exists
  useEffect(() => {
    if (value && options.length > 0) {
      const option = options.find((opt) => getOptionValue(opt) === value);
      if (option) {
        setSelectedOption(option);
      }
    }
  }, [value, options, getOptionValue]);

  // Effect for initial fetch
  useEffect(() => {
    const initializeOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        // If we have a value, use it for the initial search
        const data = await fetcher(value);
        setOriginalOptions(data);
        setOptions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch options',
        );
      } finally {
        setLoading(false);
      }
    };

    if (!mounted) {
      void initializeOptions();
    }
  }, [mounted, fetcher, value]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetcher(debouncedSearchTerm);
        setOriginalOptions(data);
        setOptions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch options',
        );
      } finally {
        setLoading(false);
      }
    };

    if (!mounted) {
      void fetchOptions();
    } else if (!preload) {
      void fetchOptions();
    } else if (preload) {
      if (debouncedSearchTerm) {
        setOptions(
          originalOptions.filter((option) =>
            filterFn ? filterFn(option, debouncedSearchTerm) : true,
          ),
        );
      } else {
        setOptions(originalOptions);
      }
    }
  }, [
    fetcher,
    debouncedSearchTerm,
    mounted,
    preload,
    filterFn,
    originalOptions,
  ]);

  // Add ref to track previous open state
  const prevOpenRef = useRef(false);
  // Add effect to fetch options when dropdown opens
  useEffect(() => {
    const fetchOptionsOnOpen = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetcher(searchTerm);
        setOriginalOptions(data);
        setOptions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch options',
        );
      } finally {
        setLoading(false);
      }
    };

    // Only fetch when the dropdown transitions from closed to open
    if (open && !prevOpenRef.current) {
      void fetchOptionsOnOpen();
    }

    // Update the ref with current open state
    prevOpenRef.current = open;
  }, [open, fetcher, searchTerm]);

  const handleSelect = useCallback(
    async (currentValue: string) => {
      const newValue =
        clearable && currentValue === selectedValue ? '' : currentValue;
      setSelectedValue(newValue);
      const option =
        options.find((opt) => getOptionValue(opt) === newValue) || null;
      setSelectedOption(option);

      setIsUpdating(true);
      setUpdatingOption(option);
      try {
        await onChange(newValue);
      } finally {
        setIsUpdating(false);
        setUpdatingOption(null);
      }

      setOpen(false);
    },
    [selectedValue, onChange, clearable, options, getOptionValue],
  );

  const handleCreateOption = useCallback(
    async (inputValue: string) => {
      const newOption = await onCreateOption?.(inputValue);
      if (newOption) {
        setOptions([...options, newOption]);
        setOriginalOptions([...originalOptions, newOption]);
        setSelectedOption(newOption);
        await onChange(getOptionValue(newOption));
        setOpen(false);
      }
    },
    [getOptionValue, onChange, onCreateOption, options, originalOptions],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={triggerVariant}
          role='combobox'
          aria-expanded={open}
          data-testid={`${dataTestId}-trigger`}
          className={cn(
            'justify-between',
            'text-xs hover:bg-transparent hover:text-text-base-primary',
            'rounded-3xl',
            disabled && 'cursor-not-allowed opacity-50',
            triggerClassName,
          )}
          disabled={disabled || isUpdating}
        >
          <div className='flex items-center gap-2'>
            {isUpdating && updatingOption ? (
              <Loader2 className='h-3 w-3 animate-spin' />
            ) : selectedOption ? (
              getDisplayValue(selectedOption)
            ) : (
              placeholder
            )}
          </div>
          {!hideChevron && <ChevronDown className='h-4 w-4' />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('p-0', className)}>
        <Command shouldFilter={false}>
          <div
            className='relative w-full border-b'
            data-testid={`${dataTestId}-input`}
          >
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchTerm}
              onValueChange={(value) => {
                setSearchTerm(value);
              }}
            />
            {loading && options.length > 0 && (
              <div className='absolute right-2 top-1/2 flex -translate-y-1/2 transform items-center'>
                <Loader2 className='h-4 w-4 animate-spin' />
              </div>
            )}
          </div>
          <CommandList>
            {error && (
              <div className='p-4 text-center text-destructive'>{error}</div>
            )}
            {loading &&
              options.length === 0 &&
              (loadingSkeleton || <DefaultLoadingSkeleton />)}
            {!loading &&
              !error &&
              options.length === 0 &&
              (notFound || (
                <CommandEmpty>
                  {noResultsMessage ?? `No ${label.toLowerCase()} found.`}
                </CommandEmpty>
              ))}
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={getOptionValue(option)}
                  value={getOptionValue(option)}
                  onSelect={handleSelect}
                  className='!text-text-base-primary data-[selected=true]:bg-fill-base-4'
                >
                  {renderOption(option)}
                  <Check
                    className={cn(
                      'ml-auto h-3 w-3',
                      selectedValue === getOptionValue(option)
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
              {onCreateOption && searchTerm && (
                <CreateOptionCommandItem
                  inputValue={searchTerm}
                  handleSelect={handleCreateOption}
                />
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function DefaultLoadingSkeleton() {
  return (
    <CommandGroup>
      {[1, 2, 3].map((i) => (
        <CommandItem key={i} disabled>
          <div className='flex w-full items-center gap-2'>
            <div className='h-6 w-6 animate-pulse rounded-full bg-muted' />
            <div className='flex flex-1 flex-col gap-1'>
              <div className='h-4 w-24 animate-pulse rounded bg-muted' />
              <div className='h-3 w-16 animate-pulse rounded bg-muted' />
            </div>
          </div>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
