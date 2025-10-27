import { formatDatetimeOnlyDate } from '@/helpers/datetimeUtils';
import { useCompany, useQuantification } from '@/services/hooks';
import type { RiskRegisterResponse } from '@/types/riskRegister';
import { type FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  scenario: RiskRegisterResponse;
};

export const CRQScenarioDate: FC<Props> = ({ scenario }) => {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.dataBreachPhishing',
  });
  const { data: fq } = useQuantification(
    scenario.scenario_data.crq_data?.fq_id ?? '',
  );

  const { data: company } = useCompany(
    scenario.scenario_data.crq_data?.company_id ?? '',
  );

  return (
    <span
      className='text-sm text-text-base-secondary'
      data-testid='quantitative-metrics-header-description'
    >
      {t('scenarioDescription', {
        // @ts-ignore
        companyName: company?.name || 'your company',
        fqDate: fq?.updated_at ? formatDatetimeOnlyDate(fq?.updated_at) : '',
      })}
    </span>
  );
};
