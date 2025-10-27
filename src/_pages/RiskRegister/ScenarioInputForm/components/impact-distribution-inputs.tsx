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
  FormMessage,
} from '@/components/atoms/form';
import { Input } from '@/components/atoms/input';
import InfoPopover from '@/components/molecules/info-popover';
import { TransWithComponent } from '@/components/texts/TransWithComponent';
import type { CurrencyCodeType } from '@/options/constants';
import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface ImpactDistributionInputsProps {
  control: Control<any>;
  currency: CurrencyCodeType;
}

export default function ImpactDistributionInputs({
  control,
  currency,
}: ImpactDistributionInputsProps) {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'modal.impactDistribution',
  });
  const [isOpen, setIsOpen] = useState(false);

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
                    name={`impact_distribution.${row.fieldName}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className='flex items-center gap-2'>
                            <div className='relative flex-1'>
                              <Input
                                type='number'
                                className='bg-white pr-16'
                                {...field}
                                onChange={(e) =>
                                  field.onChange(e.target.valueAsNumber)
                                }
                              />
                              <span className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'>
                                {currency}
                              </span>
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
