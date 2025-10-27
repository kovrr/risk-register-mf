import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form';
import { AsyncSelect } from '@/components/molecules/AsyncSelect';
import { useCompanies } from '@/services/hooks';
import type { CompanyApiData } from '@/types/companyForm';
import type { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { isCompanyWithError } from '@/components/molecules/CompanyErrorRow';
import type { SimpleScenarioFormValues } from './form-config';

interface SimpleEntitySelectProps {
  control: Control<SimpleScenarioFormValues>;
  isEditMode?: boolean;
}

export default function SimpleEntitySelect({
  control,
  isEditMode,
}: SimpleEntitySelectProps) {
  const { t } = useTranslation('riskRegister', { keyPrefix: 'modal' });

  const { refetch: _getCompanies } = useCompanies({
    page: 1,
    size: 100,
    fields: ['id', 'name', 'status'],
  });

  const getCompanies = async (_query?: string): Promise<CompanyApiData[]> => {
    const { data } = await _getCompanies();
    return (data?.items.filter((company) => !isCompanyWithError(company)) ??
      []) as CompanyApiData[];
  };

  return (
    <FormField<SimpleScenarioFormValues>
      control={control}
      disabled={isEditMode}
      name={'company_id'}
      render={({ field }) => {
        const { value, onChange, ...restField } = field;
        const typedValue = value as string;

        return (
          <FormItem>
            <FormLabel>{t('labels.modelingEntity')}</FormLabel>
            <FormControl>
              <AsyncSelect<CompanyApiData>
                preload
                filterFn={(company, input) =>
                  company.name.toLowerCase().includes(input.toLowerCase())
                }
                triggerClassName='w-[100%] rounded-[10px]'
                className='w-[100%]'
                fetcher={getCompanies}
                renderOption={(company) => company.name}
                getDisplayValue={(company) => company.name}
                getOptionValue={(company) => company.id}
                label='Modeling Entity'
                placeholder='Select Entity...'
                value={typedValue}
                data-testid='simple-entity-select'
                onChange={(companyId) => {
                  onChange(companyId);
                }}
                {...restField}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
