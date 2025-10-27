import { cn } from '@/lib/utils';
import { RiskRegisterImpact, riskRegisterImpacts } from '@/types/riskRegister';
import React, { FC } from 'react';

const severityBgColors = {
  [riskRegisterImpacts.Negligible]: 'bg-viz-impact-tags-negligible',
  [riskRegisterImpacts.Minor]: 'bg-viz-impact-tags-minor',
  [riskRegisterImpacts.Moderate]: 'bg-viz-impact-tags-moderate',
  [riskRegisterImpacts.Significant]: 'bg-viz-impact-tags-significant',
  [riskRegisterImpacts.Severe]: 'bg-viz-impact-tags-severe',
};

type Props = {
  value: RiskRegisterImpact;
};

export const SeverityBullet: FC<Props> = ({ value }) => {
  return (
    <div className='flex items-center gap-2'>
      <div className={cn('h-3 w-3 rounded-full', severityBgColors[value])} />
      <span className='text-lg'>{value}</span>
    </div>
  );
};
