import { Checkbox } from '@/components/atoms/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/atoms/form';
import { ImpactTypes } from '@/types/riskDrivers/impactTypes';
import type { CheckedState } from '@radix-ui/react-checkbox';
import type { FC } from 'react';
import type { Control, ControllerRenderProps } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { CRQScenarioFormValues } from './form-config';

type Props = {
  control: Control<CRQScenarioFormValues>;
  isEditMode?: boolean;
};

export const ImpactTypesCheckboxes: FC<Props> = ({ control, isEditMode }) => {
  const { t } = useTranslation('riskRegister', { keyPrefix: 'modal' });

  const handleImpactTypeChange = (
    field: ControllerRenderProps<
      CRQScenarioFormValues,
      'crq_data.filters.impact_type_filter'
    >,
    impactTypes: string[],
    checked: CheckedState,
  ) => {
    const currentValue = field.value || [];
    if (checked) {
      field.onChange([...currentValue, ...impactTypes]);
    } else {
      field.onChange(
        currentValue.filter((v: string) => !impactTypes.includes(v)),
      );
    }
  };

  return (
    <div className='flex flex-col gap-5'>
      <div>
        <h2 className='text-[17px] font-bold text-text-base-primary'>
          {t('labels.crqImpactTypes')}
        </h2>
        <p className='text-[13px] text-text-base-secondary'>
          {t('labels.crqImpactTypesInformation')}
        </p>
      </div>
      <div
        className='ml-4 flex flex-col gap-3'
        data-testid='impact-types-checkboxes'
      >
        {Object.values(ImpactTypes).map((impactTypes) => {
          const impactTypesValues = impactTypes.value;
          return (
            <FormField
              key={impactTypes.label}
              control={control}
              name={`crq_data.filters.impact_type_filter`}
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-2 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={impactTypesValues.every((impactType) =>
                        field.value?.includes(impactType),
                      )}
                      onCheckedChange={(checked) =>
                        handleImpactTypeChange(
                          field,
                          impactTypesValues,
                          checked,
                        )
                      }
                      disabled={isEditMode}
                      className='border-stroke-base-0 data-[state=checked]:border-fill-brand-primary'
                      name={impactTypes.name}
                    />
                  </FormControl>
                  <FormLabel className='cursor-pointer text-sm font-medium capitalize leading-none text-text-base-primary'>
                    {impactTypes.label}
                  </FormLabel>
                </FormItem>
              )}
            />
          );
        })}
      </div>
    </div>
  );
};
