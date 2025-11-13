import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import { Textarea } from '@/components/atoms/textarea';
import type { Control, FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { BaseScenarioFormValues } from './form-config';

interface BasicScenarioInfoProps<T extends BaseScenarioFormValues> {
  control: Control<T>;
  isEditMode: boolean;
}

export default function BasicScenarioInfo<T extends BaseScenarioFormValues>({
  control,
  isEditMode,
}: BasicScenarioInfoProps<T>) {
  const { t } = useTranslation('riskRegister', { keyPrefix: 'modal' });

  return (
    <div className='space-y-xs'>
      <div className='grid grid-cols-4 gap-4'>
        <FormField<T>
          control={control}
          name={'customer_scenario_id' as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel required className='text-text-base-primary'>
                {t('labels.scenarioId')}
              </FormLabel>
              <FormControl>
                <Input {...field} disabled={isEditMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField<T>
          control={control}
          name={'name' as FieldPath<T>}
          render={({ field }) => (
            <FormItem className='col-span-3'>
              <FormLabel required className='text-text-base-primary'>
                {t('labels.scenarioName')}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField<T>
        control={control}
        name={'description' as FieldPath<T>}
        render={({ field }) => (
            <FormItem className='col-span-4'>
              <FormLabel required className='text-text-base-primary'>
                {t('labels.description')}
              </FormLabel>
            <FormControl>
              <Textarea {...field} className='min-h-[120px]' />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
