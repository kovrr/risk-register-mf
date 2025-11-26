import type { RiskRegisterResponse } from '@/types/riskRegister';
import { useTranslation } from 'react-i18next';

type Props = {
  scenario?: RiskRegisterResponse;
};

export const DataExposureSection: React.FC<Props> = ({ scenario }) => {
  const { t } = useTranslation('riskRegister');

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
    <div className='flex flex-col gap-4'>
      <h3 className='text-base font-semibold text-text-base-primary'>
        Data Exposure
      </h3>
      <div className='grid grid-cols-3 gap-4'>
        {exposureItems.map((item) => (
          <div
            key={item.key}
            className='flex flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4'
          >
            <h4 className='text-sm font-semibold text-text-base-primary'>
              {item.title}
            </h4>
            <p className='text-xs text-text-base-secondary'>{item.description}</p>
            <p className='text-lg font-bold text-text-base-primary'>
              {typeof item.value === 'number' ? (
                item.value.toLocaleString()
              ) : (
                <span className='text-sm italic text-text-base-secondary'>
                  Not set
                </span>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

