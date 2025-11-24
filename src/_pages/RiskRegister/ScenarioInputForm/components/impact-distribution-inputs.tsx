'use client';

import { Button } from '@/components/atoms/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/atoms/collapsible';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';
import InfoPopover from '@/components/molecules/info-popover';
import { TransWithComponent } from '@/components/texts/TransWithComponent';
import type { CurrencyCodeType } from '@/options/constants';
import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type ImpactDistributionInputsProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  currencyFieldName?: FieldPath<TFieldValues>;
  fallbackCurrency?: string | null;
  currencyOptions?: CurrencyCodeType[];
  disabled?: boolean;
};

const DEFAULT_CURRENCY_OPTIONS: CurrencyCodeType[] = ['USD', 'EUR'];

export default function ImpactDistributionInputs<
  TFieldValues extends FieldValues,
>({
  control,
  currencyFieldName,
  fallbackCurrency = 'USD',
  currencyOptions = DEFAULT_CURRENCY_OPTIONS,
  disabled = false,
}: ImpactDistributionInputsProps<TFieldValues>) {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'modal.impactDistribution',
  });
  const [isOpen, setIsOpen] = useState(false);

  const baseCurrencyOptions =
    currencyOptions.length > 0 ? currencyOptions : DEFAULT_CURRENCY_OPTIONS;

  const currencyField = currencyFieldName
    ? useController({
      control,
      name: currencyFieldName,
    })
    : null;

  const currentCurrency =
    currencyField?.field.value || fallbackCurrency || baseCurrencyOptions[0];
  const resolvedCurrencyOptions = useMemo(() => {
    if (currentCurrency && !baseCurrencyOptions.includes(currentCurrency as CurrencyCodeType)) {
      return [...baseCurrencyOptions, currentCurrency as CurrencyCodeType];
    }
    return baseCurrencyOptions;
  }, [baseCurrencyOptions, currentCurrency]);

  const rows = useMemo(
    () => [
      {
        percentage: {
          value: t('percentages.99.value'),
          description: t('percentages.99.description'),
          information: t('percentages.99.information'),
        },
        fieldName: 'ninety_nine',
      },
      {
        percentage: {
          value: t('percentages.75.value'),
          description: t('percentages.75.description'),
          information: t('percentages.75.information'),
        },
        fieldName: 'seventy_five',
      },
      {
        percentage: {
          value: t('percentages.50.value'),
          description: t('percentages.50.description'),
          information: t('percentages.50.information'),
        },
        fieldName: 'fifty',
      },
      {
        percentage: {
          value: t('percentages.25.value'),
          description: t('percentages.25.description'),
          information: t('percentages.25.information'),
        },
        fieldName: 'twenty_five',
      },
      {
        percentage: {
          value: t('percentages.1.value'),
          description: t('percentages.1.description'),
          information: t('percentages.1.information'),
        },
        fieldName: 'one',
      },
    ],
    [t],
  );

  return (
    <div className='w-full max-w-3xl'>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant='link' size='link' className='hover:no-underline'>
            {t('title')}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                }`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className='mt-4 rounded-lg bg-slate-100 p-[15px]'>
            <div className='grid grid-cols-2 gap-y-[8px]'>
              <div className='font-medium text-gray-600'>{t('likelihood')}</div>
              <div className='font-medium text-gray-600'>{t('impact')}</div>
              <hr className='col-span-2 my-[2px] border-fill-specific-divider' />
              {rows.map((row, index) => (
                <div key={index} className='contents'>
                  <div className='flex items-center gap-2'>
                    <span className='font-[700] text-text-base-primary'>
                      {row.percentage.value}
                    </span>
                    {row.percentage.description && (
                      <span className='italic text-text-base-tertiary'>
                        {row.percentage.description}
                      </span>
                    )}
                  </div>
                  <FormField
                    control={control}
                    name={
                      `impact_distribution.${row.fieldName}` as FieldPath<TFieldValues>
                    }
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='sr-only'>
                          {row.percentage.value}
                        </FormLabel>
                        <FormControl>
                          <div className='flex items-center gap-2'>
                            <div className='flex flex-1 items-center gap-2'>
                              <Input
                                type='number'
                                className='bg-white'
                                value={field.value ?? ''}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                onChange={(e) =>
                                  field.onChange(e.target.valueAsNumber || undefined)
                                }
                                disabled={disabled}
                              />
                              <Select
                                value={currentCurrency ?? ''}
                                onValueChange={(value) =>
                                  currencyField?.field.onChange(value)
                                }
                                disabled={disabled || !currencyField}
                              >
                                <SelectTrigger className='w-[120px]'>
                                  <SelectValue placeholder='Currency' />
                                </SelectTrigger>
                                <SelectContent>
                                  {resolvedCurrencyOptions.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <InfoPopover
                              content={
                                <TransWithComponent
                                  components={{
                                    bold: <b />,
                                  }}
                                >
                                  {row.percentage.information}
                                </TransWithComponent>
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
