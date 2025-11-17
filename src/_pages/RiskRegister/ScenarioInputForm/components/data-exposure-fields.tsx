import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import InfoPopover from '@/components/molecules/info-popover';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

type DataExposureFieldsProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  isEditMode?: boolean;
};

const exposureFields = [
  {
    key: 'pii',
    label: 'PII Records',
    info: 'Personally identifiable information such as names, addresses, Social Security numbers, etc.',
  },
  {
    key: 'pci',
    label: 'PCI Records',
    info: 'Payment card information, including account numbers or authentication data.',
  },
  {
    key: 'phi',
    label: 'PHI Records',
    info: 'Protected health information like medical records, diagnoses, or treatment details.',
  },
] as const;

export function DataExposureFields<TFieldValues extends FieldValues>({
  control,
  isEditMode,
}: DataExposureFieldsProps<TFieldValues>) {
  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-sm font-semibold text-text-base-primary'>
          Data Exposure
        </h3>

      </div>
      <div className='grid gap-5 md:grid-cols-3'>
        {exposureFields.map((fieldConfig) => (
          <FormField<TFieldValues>
            key={fieldConfig.key}
            control={control}
            name={`data_exposure.${fieldConfig.key}` as FieldPath<TFieldValues>}
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className='text-text-base-primary'
                  info={<InfoPopover content={fieldConfig.info} />}
                >
                  {fieldConfig.label}
                </FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={0}
                    step='1'
                    value={field.value ?? ''}
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    onChange={(event) =>
                      field.onChange(event.target.valueAsNumber || undefined)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}
