import { Checkbox } from '@/components/atoms/checkbox';
import { DualRangeSlider } from '@/components/atoms/dual-range-slider';
import InfoPopover from '@/components/molecules/info-popover';
import { cn } from '@/lib/utils';
import { useCompanies } from '@/services/hooks';
import type { CheckedState } from '@radix-ui/react-checkbox';
import React, { type FC } from 'react';
import { type Control, useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isCompanyWithError } from '@/components/molecules/CompanyErrorRow';
import type { CRQScenarioFormValues } from './form-config';

interface ImpactMagnitudeProps {
  control: Control<CRQScenarioFormValues>;
  companyId: string;
  isEditMode?: boolean;
}

const TOP_SIMULATION_STATS_PREFIX =
  'last_quantification.results_narrative.simulation_exposure.top_simulation_stats';
const companyFields = [
  'id',
  'name',
  `${TOP_SIMULATION_STATS_PREFIX}.event_duration.maximum`,
  `${TOP_SIMULATION_STATS_PREFIX}.event_loss.maximum`,
  `${TOP_SIMULATION_STATS_PREFIX}.num_of_records_affected.maximum`,
  'currency',
];

export const ImpactMagnitude = ({
  control,
  companyId,
  isEditMode,
}: ImpactMagnitudeProps) => {
  const { t } = useTranslation('riskRegister', { keyPrefix: 'modal' });
  const { setValue, watch } = useFormContext<CRQScenarioFormValues>();
  const { data: companies } = useCompanies({
    page: 1,
    size: 1,
    fields: companyFields,
    id: companyId,
  });
  const company = companies?.items[0];
  const validCompany = company && !isCompanyWithError(company) ? company : null;

  const [isRecordsEnabled, setIsRecordsEnabled] = React.useState(false);
  const [isDurationEnabled, setIsDurationEnabled] = React.useState(false);
  const [isDamageEnabled, setIsDamageEnabled] = React.useState(false);

  // Initialize enabled states in edit mode based on filter values
  React.useEffect(() => {
    if (isEditMode) {
      const filters = watch('crq_data.filters');
      setIsRecordsEnabled(
        filters.min_number_of_records_filter !== null &&
        filters.max_number_of_records_filter !== null,
      );
      setIsDurationEnabled(
        filters.min_duration_filter !== null &&
        filters.max_duration_filter !== null,
      );
      setIsDamageEnabled(
        filters.min_damage_filter !== null &&
        filters.max_damage_filter !== null,
      );
    }
  }, [isEditMode, watch]);

  // Reset form values when company changes
  React.useEffect(() => {
    if (validCompany && !isEditMode) {
      setValue('crq_data.filters.min_number_of_records_filter', null);
      setValue('crq_data.filters.max_number_of_records_filter', null);
      setValue('crq_data.filters.min_duration_filter', null);
      setValue('crq_data.filters.max_duration_filter', null);
      setValue('crq_data.filters.min_damage_filter', null);
      setValue('crq_data.filters.max_damage_filter', null);
    }
  }, [validCompany, companyId, isEditMode, setValue]);

  if (!validCompany) {
    return null;
  }
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col text-[17px]'>
        <h2 className='text-[17px] font-bold text-text-base-primary'>
          {t('labels.impactMagnitude')}
        </h2>
        <p className='text-sm text-text-base-secondary'>
          {t('labels.impactMagnitudeDescription')}
        </p>
      </div>
      <div
        className='flex flex-col gap-8'
        data-testid='impact-magnitude-sliders'
      >
        <ImpactMagnitudeSlider
          title={t('labels.dataRecordsCompromised')}
          control={control}
          minField='crq_data.filters.min_number_of_records_filter'
          maxField='crq_data.filters.max_number_of_records_filter'
          maxValue={
            validCompany.last_quantification?.results_narrative
              ?.simulation_exposure?.top_simulation_stats
              ?.num_of_records_affected?.maximum ?? 0
          }
          disabled={isEditMode}
          dataTestId='data-records-compromised'
          isEnabled={isRecordsEnabled}
          setIsEnabled={setIsRecordsEnabled}
        />
        <ImpactMagnitudeSlider
          title={t('labels.eventDuration')}
          control={control}
          minField='crq_data.filters.min_duration_filter'
          maxField='crq_data.filters.max_duration_filter'
          maxValue={
            validCompany.last_quantification?.results_narrative
              ?.simulation_exposure?.top_simulation_stats?.event_duration
              ?.maximum ?? 0
          }
          disabled={isEditMode}
          dataTestId='event-duration'
          isEnabled={isDurationEnabled}
          setIsEnabled={setIsDurationEnabled}
          suffix='hours'
        />
        <ImpactMagnitudeSlider
          title={t('labels.eventCost')}
          control={control}
          minField='crq_data.filters.min_damage_filter'
          maxField='crq_data.filters.max_damage_filter'
          maxValue={
            validCompany.last_quantification?.results_narrative
              ?.simulation_exposure?.top_simulation_stats?.event_loss
              ?.maximum ?? 0
          }
          currency={validCompany.currency}
          disabled={isEditMode}
          dataTestId='event-cost'
          isEnabled={isDamageEnabled}
          setIsEnabled={setIsDamageEnabled}
        />
      </div>
    </div>
  );
};

type ImpactMagnitudeFilterFields =
  | 'min_number_of_records_filter'
  | 'max_number_of_records_filter'
  | 'min_duration_filter'
  | 'max_duration_filter'
  | 'min_damage_filter'
  | 'max_damage_filter';

const parseValue = (value: number, currency?: string) => {
  return new Intl.NumberFormat(
    'en-US',
    currency
      ? {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }
      : {},
  ).format(value);
};

const ImpactMagnitudeSlider: FC<{
  title: string;
  description?: string;
  control: Control<CRQScenarioFormValues>;
  minField: `crq_data.filters.${ImpactMagnitudeFilterFields}`;
  maxField: `crq_data.filters.${ImpactMagnitudeFilterFields}`;
  maxValue: number;
  suffix?: string;
  currency?: string;
  disabled?: boolean;
  dataTestId?: string;
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
}> = ({
  title,
  description,
  control,
  minField,
  maxField,
  maxValue,
  suffix = '',
  currency,
  disabled,
  dataTestId,
  isEnabled,
  setIsEnabled,
}) => {
    const { field: minValueField } = useController({
      name: minField,
      control,
      defaultValue: 0,
    });

    const { field: maxValueField } = useController({
      name: maxField,
      control,
      defaultValue: maxValue,
    });

    const [displayMin, setDisplayMin] = React.useState(0);
    const [displayMax, setDisplayMax] = React.useState(maxValue);

    // Initialize display values from form values
    React.useEffect(() => {
      if (minValueField.value !== null && maxValueField.value !== null) {
        setDisplayMin(minValueField.value as number);
        setDisplayMax(maxValueField.value as number);
      }
    }, [maxValueField.value, minValueField.value]);

    const handleCheckboxChange = (checked: CheckedState) => {
      setIsEnabled(checked === true);
      if (!checked) {
        // When disabled, set filter values to null but keep display values
        minValueField.onChange(null);
        maxValueField.onChange(null);
      } else {
        // When enabled, set filter values to current display values
        minValueField.onChange(displayMin);
        maxValueField.onChange(displayMax);
      }
    };

    const handleSliderChange = ([min, max]: [number, number]) => {
      setDisplayMin(min);
      setDisplayMax(max);
      if (isEnabled) {
        minValueField.onChange(min);
        maxValueField.onChange(max);
      }
    };

    return (
      <div
        className='flex flex-col gap-8'
        data-testid={`${dataTestId}-slider-container`}
      >
        <div className='flex items-center gap-2'>
          <Checkbox
            checked={isEnabled}
            onCheckedChange={handleCheckboxChange}
            disabled={disabled}
            className='mr-2'
            data-testid={`${dataTestId}-checkbox`}
          />
          <p className='text-sm font-bold text-text-base-primary'>{title}</p>
          {description && <InfoPopover content={description} />}
        </div>
        <DualRangeSlider
          label={(value) => (
            <span className='whitespace-nowrap'>{`${parseValue(value ?? 0, currency)} ${suffix}`}</span>
          )}
          value={[displayMin, displayMax]}
          onValueChange={handleSliderChange}
          min={0}
          max={maxValue}
          step={Math.round(maxValue / 100)}
          className={cn(
            'w-[300px]',
            (!isEnabled || disabled) && 'cursor-not-allowed opacity-50',
          )}
          disabled={!isEnabled || maxValue === 0 || disabled}
        />
      </div>
    );
  };
