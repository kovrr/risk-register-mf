import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { useCompany } from '@/services/hooks';
import type { RiskRegisterResponse } from '@/types/riskRegister';
import type { FC } from 'react';

type Props = {
  label: string;
  value?: number;
  labelClassName: string;
  onChange: (value: string) => void;
  scenario: RiskRegisterResponse;
  disabled?: boolean;
};
export const MitigationCostField: FC<Props> = ({
  label,
  value,
  labelClassName,
  onChange,
  scenario,
  disabled,
}) => {
  const { data: company } = useCompany(
    scenario.scenario_data.crq_data?.company_id ?? '',
  );
  const currency =
    company?.currency || scenario.scenario_data.average_loss_currency || 'USD';

  return (
    <>
      <Label className={labelClassName}>{label}</Label>
      <div className='relative w-full max-w-md'>
        <Input
          type='number'
          value={value}
          className='pr-12'
          onChange={(e) => onChange(e.target.value)}
          name='mitigation-cost'
          disabled={disabled}
        />
        <span className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
          {currency}
        </span>
      </div>
    </>
  );
};
