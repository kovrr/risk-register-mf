import type { RiskRegisterResponse } from '@/types/riskRegister';
import { useTranslation } from 'react-i18next';
import { ScenarioMetricCard } from '../../ScenarioDrillDown/DataBreachDuePhishing/components/ScenarioMetricCard';

type Props = {
  scenario?: RiskRegisterResponse;
};

export const DataExposureSection: React.FC<Props> = ({ scenario }) => {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.dataBreachPhishing',
  });

  // Be defensive: scenario or scenario_data can be null/undefined for some records
  const dataExposure = scenario?.scenario_data?.data_exposure ?? undefined;

  const exposureItems = [
    {
      key: 'pii',
      title: 'PII',
      description: 'Personally identifiable information',
      value: dataExposure?.pii,
    },
    {
      key: 'pci',
      title: 'PCI',
      description: 'Payment card information',
      value: dataExposure?.pci,
    },
    {
      key: 'phi',
      title: 'PHI',
      description: 'Protected health information',
      value: dataExposure?.phi,
    },
  ];

  return (
    <ScenarioMetricCard
      title={t('dataExposureTitle', { defaultValue: 'Data Exposure' })}
      description={t('dataExposureDescription', {
        defaultValue:
          'Estimated number of records exposed by data type in this scenario.',
      })}
    >
      <div className='grid gap-4 md:grid-cols-3'>
        {exposureItems.map((item) => (
          <div key={item.key} className='flex flex-col gap-1'>
            <h4 className='text-sm font-semibold text-text-base-primary'>
              {item.title}
            </h4>
            <p className='text-xs text-text-base-secondary'>
              {item.description}
            </p>
            <p className='text-xl font-bold text-text-base-primary'>
              {typeof item.value === 'number' ? (
                item.value.toLocaleString()
              ) : (
                <span className='text-sm italic text-text-base-secondary'>
                  {t('notSet', { defaultValue: 'Not set' })}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </ScenarioMetricCard>
  );
};
