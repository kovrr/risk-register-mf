import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';
import InfoPopover from '@/components/molecules/info-popover';
import { CURRENCY_CODES } from '@/options/constants';
import type { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { SimpleScenarioFormValues } from './form-config';

interface QuantitativeMetricsProps {
  control: Control<SimpleScenarioFormValues>;
  currency: (typeof CURRENCY_CODES)[number];
}

export default function QuantitativeMetrics({
  control,
  currency: _currency,
}: QuantitativeMetricsProps) {
  const { t } = useTranslation('riskRegister', { keyPrefix: 'modal' });

  return (
    <div className='space-y-xs'>
      <Label variant='section-label'>
        {t('labels.quantitativeMetrics')}
        <span className='text-sm font-[400] italic text-text-base-secondary'>
          {t('labels.optional')}
        </span>
      </Label>
      <div className='grid grid-cols-2 gap-4'>
        <FormField
          control={control}
          name='annual_likelihood'
          render={({ field }) => (
            <FormItem>
              <FormLabel
                info={
                  <InfoPopover
                    content={t('labels.annualLikelihoodInformation')}
                  />
                }
                className='text-text-base-primary'
              >
                {t('labels.annualLikelihood')}
              </FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type='number'
                    step='any'
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                  <span className='absolute right-3 top-2.5 text-muted-foreground'>
                    %
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='peer_base_rate'
          render={({ field }) => (
            <FormItem>
              <FormLabel
                info={
                  <InfoPopover content={t('labels.peerBaseRateInformation')} />
                }
                className='text-text-base-primary'
              >
                {t('labels.peerBaseRate')}
              </FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type='number'
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                  <span className='absolute right-3 top-2.5 text-muted-foreground'>
                    %
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <FormField
          control={control}
          name='average_loss'
          render={({ field }) => (
            <FormItem>
              <FormLabel
                info={
                  <InfoPopover content={t('labels.averageLossInformation')} />
                }
                className='text-text-base-primary'
              >
                {t('labels.averageLoss')}
              </FormLabel>
              <FormControl>
                <div className='flex gap-2'>
                  <Input
                    type='number'
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                  <FormField
                    control={control}
                    name='average_loss_currency'
                    render={({ field: currencyField }) => (
                      <Select
                        value={currencyField.value}
                        onValueChange={currencyField.onChange}
                      >
                        <SelectTrigger
                          className='w-[100px]'
                          data-testid='currency-select'
                        >
                          <SelectValue
                            placeholder={t('select.placeholder.currency')}
                          />
                        </SelectTrigger>
                        <SelectContent
                          position='popper'
                          side='bottom'
                          className='max-h-[200px]'
                        >
                          {CURRENCY_CODES.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
