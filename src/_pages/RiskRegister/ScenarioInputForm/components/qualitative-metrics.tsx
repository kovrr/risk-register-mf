'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';
import InfoPopover from '@/components/molecules/info-popover';
import { cn } from '@/lib/utils';
import type { Control, FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  type BaseScenarioFormValues,
  IMPACT_OPTIONS,
  LIKELIHOOD_OPTIONS,
} from './form-config';

interface QualitativeMetricsProps<T extends BaseScenarioFormValues> {
  control: Control<T>;
  isRequired?: boolean;
  className?: string;
}

export default function QualitativeMetrics<T extends BaseScenarioFormValues>({
  control,
  isRequired = true,
  className,
}: QualitativeMetricsProps<T>) {
  const { t } = useTranslation('riskRegister', { keyPrefix: 'modal' });

  return (
    <div className={cn('grid gap-6 md:grid-cols-2', className)}>
      <FormField
        control={control}
        name={'likelihood' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel
              required={isRequired}
              info={<InfoPopover content={t('labels.likelihoodInformation')} />}
              className='text-text-base-primary'
            >
              {t('labels.likelihood')}
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger data-testid='likelihood-select'>
                  <SelectValue placeholder={t('select.placeholder')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent data-testid='likelihood-select-content'>
                {LIKELIHOOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={'impact' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel
              required={isRequired}
              info={<InfoPopover content={t('labels.impactInformation')} />}
              className='text-text-base-primary'
            >
              {t('labels.impact')}
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger data-testid='impact-select'>
                  <SelectValue placeholder={t('select.placeholder')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent data-testid='impact-select-content'>
                {IMPACT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
