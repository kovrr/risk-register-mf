'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form';
import { Label } from '@/components/atoms/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';
import InfoPopover from '@/components/molecules/info-popover';
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
}

export default function QualitativeMetrics<T extends BaseScenarioFormValues>({
  control,
  isRequired = true,
}: QualitativeMetricsProps<T>) {
  const { t } = useTranslation('riskRegister', { keyPrefix: 'modal' });

  return (
    <div className='w-1/2 space-y-xs'>
      <Label variant='section-label'>{t('labels.qualitativeMetrics')}</Label>
      <FormField
        control={control}
        name={'likelihood' as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel
              required={isRequired}
              info={<InfoPopover content={t('labels.likelihoodInformation')} />}
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
