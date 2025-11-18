import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import { Textarea } from '@/components/atoms/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';
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
  const mockGroups = [
    { id: 'mock-group-1', name: 'Mock Group A' },
    { id: 'mock-group-2', name: 'Mock Group B' },
    { id: 'mock-group-3', name: 'Mock Group C' },
  ];

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

      <FormField<T>
        control={control}
        name={'group_id' as FieldPath<T>}
        render={({ field }) => (
          <FormItem className='col-span-4'>
            <FormLabel className='text-text-base-primary'>
              {t('labels.group', { defaultValue: 'Group' })}
            </FormLabel>
            <FormControl>
              <Select
                value={field.value || undefined}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger data-testid='group-select'>
                  <SelectValue placeholder='Select a group' />
                </SelectTrigger>
                <SelectContent>
                  {mockGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
