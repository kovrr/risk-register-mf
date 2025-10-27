import { cn } from '@/lib/utils';
import { RiskRegisterImpact, riskRegisterImpacts } from '@/types/riskRegister';
import React, { FC } from 'react';

const impactColors: Record<RiskRegisterImpact, string> = {
  [riskRegisterImpacts.Severe]: 'bg-viz-impact-tags-severe',
  [riskRegisterImpacts.Significant]: 'bg-viz-impact-tags-significant',
  [riskRegisterImpacts.Moderate]: 'bg-viz-impact-tags-moderate',
  [riskRegisterImpacts.Minor]: 'bg-viz-impact-tags-minor',
  [riskRegisterImpacts.Negligible]: 'bg-viz-impact-tags-negligible',
};

type Props = {
  value: RiskRegisterImpact;
};

const Circle: FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn('h-[6px] w-[6px] rounded-full bg-black', className)}
    ></div>
  );
};

export const Impact: FC<Props> = ({ value }) => {
  return (
    <div className='flex items-center gap-1'>
      <Circle className={impactColors[value]} />
      <span>{value}</span>
    </div>
  );
};
