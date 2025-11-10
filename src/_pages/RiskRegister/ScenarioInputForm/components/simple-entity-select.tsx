import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form';
import { AsyncSelect } from '@/components/molecules/AsyncSelect';
import { isCompanyWithError } from '@/components/molecules/CompanyErrorRow';
import { useCompanies } from '@/services/hooks';
import type { CompanyApiData } from '@/types/companyForm';
import type { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
    return ((data as { items: CompanyApiData[] })?.items.filter((company: CompanyApiData) => !isCompanyWithError(company)) ??
      []) as CompanyApiData[];
  };

  const isCompany = (option: unknown): option is CompanyApiData =>
    typeof option === 'object' &&
    option !== null &&
    'name' in option &&
    'id' in option;

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
              <AsyncSelect
                preload
                filterFn={(company, input) =>
                  isCompany(company) &&
                  company.name.toLowerCase().includes(input.toLowerCase())
                }
                triggerClassName='w-[100%] rounded-[10px]'
                className='w-[100%]'
                fetcher={getCompanies}
                renderOption={(company) =>
                  isCompany(company) ? company.name : ''
                }
                getDisplayValue={(company) =>
                  isCompany(company) ? company.name : ''
                }
                getOptionValue={(company) =>
                  isCompany(company) ? company.id : ''
                }
                label='Modeling Entity'
                placeholder='Select Entity...'
                value={typedValue}
                data-testid='simple-entity-select'
                onChange={(companyId) => {
                  if (typeof companyId === 'string') {
                    onChange(companyId);
                  }
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
