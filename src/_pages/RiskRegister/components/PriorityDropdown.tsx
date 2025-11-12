import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu';
import { Dropdown, type Option } from '@/components/molecules/Dropdown';
import { DemoExperienceContext } from '@/contexts/DemoExperienceContext';
import { cn } from '@/lib/utils';
import {
  type RiskRegisterPriority,
  riskRegisterPriorities,
} from '@/types/riskRegister';
import { ChevronDown, Loader2 } from 'lucide-react';
import { useIsGuestUser } from 'permissions/use-permissions';
import { type FC, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const riskRegisterPrioritiesColors: Record<RiskRegisterPriority, string> = {
  [riskRegisterPriorities.Low]: 'bg-viz-priority-tags-low',
  [riskRegisterPriorities.Medium]: 'bg-viz-priority-tags-medium',
  [riskRegisterPriorities.High]: 'bg-viz-priority-tags-high',
  [riskRegisterPriorities.Critical]: 'bg-viz-priority-tags-critical',
};

const PRIORITY_OPTIONS = Object.keys(riskRegisterPriorities).map(
  (priority) => ({
    label: priority,
    value: priority,
    className: riskRegisterPrioritiesColors[priority as RiskRegisterPriority],
  }),
);

type Props = {
  value?: RiskRegisterPriority;
  onChange: (option: Option) => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
};

export const PriorityDropdown: FC<Props> = ({
  value,
  onChange,
  className,
  disabled = false,
  isLoading = false,
}) => {
  const isGuestUser = useIsGuestUser();
  const { showDemoModal } = useContext(DemoExperienceContext);
  const { t } = useTranslation('riskRegister');

  const selectedOption: Option | undefined = useMemo(
    () => PRIORITY_OPTIONS.find((option) => option.value === value),
    [value],
  );

  const handleGuestUserChange = (_option: Option) => {
    showDemoModal({ title: t('demo.editScenario') });
  };

  return (
    <div>
      {isGuestUser ? (
        <GuestUserDropdown
          options={PRIORITY_OPTIONS}
          selectedOption={selectedOption}
          onOptionClick={handleGuestUserChange}
          isLoading={isLoading}
          className={className}
          dataTestId='priority-dropdown'
        />
      ) : (
        <Dropdown
          options={PRIORITY_OPTIONS}
          defaultValue={selectedOption}
          onChange={onChange}
          className={className}
          disabled={disabled}
          isLoading={isLoading}
          dataTestId='priority-dropdown'
        />
      )}
    </div>
  );
};

// Custom dropdown component for guest users that doesn't change internal state
const GuestUserDropdown: FC<{
  options: Option[];
  selectedOption?: Option;
  onOptionClick: (option: Option) => void;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  dataTestId?: string;
}> = ({
  options,
  selectedOption,
  onOptionClick,
  disabled = false,
  isLoading,
  className,
  dataTestId,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOptionClick = (option: Option) => {
      onOptionClick(option);
      setIsOpen(false);
    };

    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
          className={cn(
            'flex items-center rounded-2xl px-2 py-1 text-xs font-bold text-text-base-invert focus-visible:outline-none',
            (isLoading || disabled) && 'cursor-not-allowed',
            className,
            selectedOption?.className,
          )}
          disabled={disabled || isLoading}
          data-testid={dataTestId}
        >
          <div className='flex items-center gap-1'>
            {isLoading && <Loader2 className='h-4 w-4 animate-spin' />}
            {!isLoading && selectedOption?.icon}
            {selectedOption?.label}
          </div>
          <ChevronDown className='h-4 w-4' />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className='focus:bg-fill-base-4 focus:text-text-base-primary'
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };
