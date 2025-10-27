'use client';
import type { CheckedState } from '@radix-ui/react-checkbox';
import type { FC } from 'react';
import {
	type Control,
	type ControllerRenderProps,
	useFormContext,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/atoms/checkbox';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/atoms/form';
import { isCompanyWithError } from '@/components/molecules/CompanyErrorRow';
import { cn } from '@/lib/utils';
import { useCompanies } from '@/services/hooks';
import { InitialAttackVectors } from '@/types/riskDrivers/attackVectors';
import type { CRQScenarioFormValues } from './form-config';

type Props = {
	control: Control<CRQScenarioFormValues>;
	companyId: string;
	isEditMode: boolean;
	initialvectors?: string[];
};

const COMPANY_FIELDS = [
	'id',
	'name',
	'last_quantification.results_narrative.by_initial_vector_exposure',
];

export const InitialAccessVectors: FC<Props> = ({
	control,
	companyId,
	isEditMode,
	initialvectors,
}) => {
	const { t } = useTranslation('riskRegister', { keyPrefix: 'modal' });
	const { setValue } = useFormContext<CRQScenarioFormValues>();

	const { data: companies } = useCompanies({
		page: 1,
		size: 1,
		fields: COMPANY_FIELDS,
		id: companyId,
	});
	const company = companies?.items[0];
	const validCompany = company && !isCompanyWithError(company) ? company : null;

	let availableVectors: string[] = [];

	if (isEditMode && initialvectors) {
		availableVectors = [...initialvectors];
	} else {
		availableVectors = Object.keys(
			validCompany?.last_quantification?.results_narrative
				?.by_initial_vector_exposure || {},
		);
	}

	const vectorsToShow = Object.values(InitialAttackVectors).filter((vector) =>
		availableVectors.includes(vector),
	);

	const selectAll = () => {
		setValue('crq_data.filters.initial_vector_filter', [...vectorsToShow]);
	};

	const clearAll = () => {
		setValue('crq_data.filters.initial_vector_filter', []);
	};

	const handleVectorChange = (
		field: ControllerRenderProps<
			CRQScenarioFormValues,
			'crq_data.filters.initial_vector_filter'
		>,
		vector: string,
		checked: CheckedState,
	) => {
		const currentValue = field.value || [];
		if (checked) {
			field.onChange([...currentValue, vector]);
		} else {
			field.onChange(currentValue.filter((v: string) => v !== vector));
		}
	};

	if (vectorsToShow.length === 0) {
		return null;
	}

	return (
		<div className='flex w-full flex-col gap-5'>
			<div>
				<h2 className='text-[17px] font-bold text-text-base-primary'>
					{t('labels.initialAccessVectors')}
				</h2>
				<p className='mt-1 text-[13px] text-text-base-secondary'>
					{t('labels.initialAccessVectorsInformation')}
				</p>
			</div>

			<div
				className='space-y-2'
				data-testid='initial-access-vectors-checkboxes'
			>
				<div className='mb-4 flex items-center justify-start gap-4'>
					<button
						type='button'
						onClick={selectAll}
						className={cn(
							'text-sm font-medium text-blue-600 hover:text-blue-800',
							isEditMode && 'cursor-not-allowed',
						)}
						disabled={isEditMode}
					>
						Select All
					</button>
					<button
						type='button'
						onClick={clearAll}
						className={cn(
							'text-sm font-medium text-gray-600 hover:text-gray-800',
							isEditMode && 'cursor-not-allowed',
						)}
						disabled={isEditMode}
					>
						Clear
					</button>
				</div>
				{vectorsToShow.map((vector) => (
					<FormField
						key={vector}
						control={control}
						name={`crq_data.filters.initial_vector_filter`}
						render={({ field }) => (
							<FormItem className='ml-4 flex flex-row items-start space-x-2 space-y-0'>
								<FormControl>
									<Checkbox
										checked={field.value?.includes(vector)}
										onCheckedChange={(checked) =>
											handleVectorChange(field, vector, checked)
										}
										disabled={isEditMode}
										className='border-stroke-base-0 data-[state=checked]:border-fill-brand-primary'
										name={vector}
									/>
								</FormControl>
								<FormLabel className='cursor-pointer text-sm font-medium capitalize leading-none text-text-base-primary'>
									{vector}
								</FormLabel>
							</FormItem>
						)}
					/>
				))}
			</div>
		</div>
	);
};
