import { LikelihoodBadge } from '@/components/molecules/LikelihoodBadge';
import type { RiskRegisterRow } from '@/types/riskRegister';
import type React from 'react';
import { Impact } from './Impact';

interface LikelihoodImpactCellProps {
  row: RiskRegisterRow;
}

export const LikelihoodImpactCell: React.FC<LikelihoodImpactCellProps> = ({
  row,
}) => {
  const likelihood = row.likelihood;
  const impact = row.impact;

  return (
    <div className='flex flex-col gap-1'>
      {likelihood && <LikelihoodBadge value={likelihood} />}
      {impact && <Impact value={impact} />}
    </div>
  );
};
