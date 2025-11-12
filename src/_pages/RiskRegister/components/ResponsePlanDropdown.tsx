import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu';
import { ScrewdriverWrenchCross } from '@/_pages/RiskRegister/components/icons/ScrewdriverWrenchCross';
import { Dropdown, type Option } from '@/components/molecules/Dropdown';
import { DemoExperienceContext } from '@/contexts/DemoExperienceContext';
import { cn } from '@/lib/utils';
import {
  type RiskRegisterResponsePlan,
  riskRegisterResponsePlans,
} from '@/types/riskRegister';
import { ArrowRight, Check, ChevronDown, Loader2, X } from 'lucide-react';
import { useIsGuestUser } from 'permissions/use-permissions';
import { type FC, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ICON_CLASS_NAME = 'text-base-secondary h-4 w-4';
const responsePlanIcons: Record<RiskRegisterResponsePlan, React.ReactNode> = {
	[riskRegisterResponsePlans.Mitigate]: <ScrewdriverWrenchCross />,
	[riskRegisterResponsePlans.Avoid]: <X className={ICON_CLASS_NAME} />,
	[riskRegisterResponsePlans.Transfer]: (
		<ArrowRight className={ICON_CLASS_NAME} />
	),
	[riskRegisterResponsePlans.Accept]: (
		<Check className='text-base-secondary h-4 w-4' />
	),
};

const RESPONSE_PLAN_OPTIONS = Object.keys(riskRegisterResponsePlans).map(
	(priority) => ({
		label: priority,
		value: priority,
		className: 'bg-fill-base-5 text-base-secondary',
		icon: responsePlanIcons[priority as RiskRegisterResponsePlan],
	}),
);

type Props = {
	value?: RiskRegisterResponsePlan;
	onChange: (option: Option) => void;
	disabled?: boolean;
	isLoading?: boolean;
};

export const ResponsePlanDropdown: FC<Props> = ({
	value,
	onChange,
	disabled = false,
	isLoading = false,
}) => {
	const isGuestUser = useIsGuestUser();
	const { showDemoModal } = useContext(DemoExperienceContext);
	const { t } = useTranslation('riskRegister');

	const selectedOption: Option | undefined = useMemo(
		() => RESPONSE_PLAN_OPTIONS.find((option) => option.value === value),
		[value],
	);

	const handleGuestUserChange = (_option: Option) => {
		showDemoModal({ title: t('demo.editScenario') });
	};

	return (
		<div>
			{isGuestUser ? (
				<GuestUserDropdown
					options={RESPONSE_PLAN_OPTIONS}
					selectedOption={selectedOption}
					onOptionClick={handleGuestUserChange}
					disabled={disabled}
					isLoading={isLoading}
					dataTestId='response-plan-dropdown'
				/>
			) : (
				<Dropdown
					options={RESPONSE_PLAN_OPTIONS}
					defaultValue={selectedOption}
					onChange={onChange}
					disabled={disabled}
					isLoading={isLoading}
					dataTestId='response-plan-dropdown'
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
	dataTestId?: string;
}> = ({
	options,
	selectedOption,
  onOptionClick,
  disabled = false,
  isLoading,
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
