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
import { type CompanyApiData, CompanyStatus } from '@/types/companyForm';
import type { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { CRQScenarioFormValues } from './form-config';

interface CRQEntitySelectProps {
  control: Control<CRQScenarioFormValues>;
  isEditMode?: boolean;
}

export default function CRQEntitySelect({
  control,
  isEditMode,
}: CRQEntitySelectProps) {
  const { t } = useTranslation('riskRegister', { keyPrefix: 'modal' });

  const { refetch: _getCompanies } = useCompanies({
    page: 1,
    size: 100,
    fields: ['id', 'name', 'status'],
  });

  const getCompanies = async (_query?: string): Promise<CompanyApiData[]> => {
    const { data } = await _getCompanies();
    const items = (data as { items?: unknown[] } | undefined)?.items ?? [];
    return items
      .filter((company): company is CompanyApiData => {
        return (
          typeof company === 'object' &&
          company !== null &&
          'id' in company &&
          'name' in company &&
          'status' in company
        );
      })
      .filter((company) => !isCompanyWithError(company))
      .filter((company) => company.status === CompanyStatus.COMPLETED);
  };

  const isCompany = (option: unknown): option is CompanyApiData =>
    typeof option === 'object' &&
    option !== null &&
    'name' in option &&
    'id' in option;

  return (
    <FormField<CRQScenarioFormValues>
      control={control}
      disabled={isEditMode}
      name={'crq_data.company_id'}
      render={({ field }) => {
        const { value, ...restField } = field;
        const typedValue = value as string;
        return (
          <FormItem>
            <FormLabel required>{t('labels.modelingEntity')}</FormLabel>
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
                data-testid='crq-entity-select'
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
