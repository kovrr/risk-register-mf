import { Checkbox } from '@/components/atoms/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/atoms/form';
import type { CheckedState } from '@radix-ui/react-checkbox';
import type { FC } from 'react';
import type { Control, ControllerRenderProps } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ClickableEventType,
  EVENT_TYPE_TO_TEXT,
} from 'types/riskDrivers/eventTypes';
import type { CRQScenarioFormValues } from './form-config';

type Props = {
  control: Control<CRQScenarioFormValues>;
  isEditMode?: boolean;
};

export const EventTypesCheckboxes: FC<Props> = ({ control, isEditMode }) => {
  const { t } = useTranslation('riskRegister', { keyPrefix: 'modal' });
  const handleEventTypeChange = (
    field: ControllerRenderProps<
      CRQScenarioFormValues,
      'crq_data.filters.event_type_filter'
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

  return (
    <div className='flex flex-col gap-5'>
      <div>
        <h2 className='text-[17px] font-bold text-text-base-primary'>
          {t('labels.crqEventTypes')}
        </h2>
        <p className='text-[13px] text-text-base-secondary'>
          {t('labels.crqEventTypesInformation')}
        </p>
      </div>

      <div
        className='ml-4 flex flex-col gap-3'
        data-testid='event-types-checkboxes'
      >
        {Object.values(ClickableEventType).map((eventType) => (
          <FormField
            key={eventType}
            control={control}
            name={`crq_data.filters.event_type_filter`}
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-2 space-y-0'>
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes(eventType)}
                    onCheckedChange={(checked) =>
                      handleEventTypeChange(field, eventType, checked)
                    }
                    disabled={isEditMode}
                    className='border-stroke-base-0 data-[state=checked]:border-fill-brand-primary'
                    name={eventType}
                  />
                </FormControl>
                <FormLabel className='cursor-pointer text-sm font-medium capitalize leading-none text-text-base-primary'>
                  {EVENT_TYPE_TO_TEXT[eventType]}
                </FormLabel>
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
};
