import { Badge } from '@/components/atoms/badge';
import { cn } from '@/lib/utils';
import {
  type RiskRegisterLikelihood,
  riskRegisterLikelihoods,
} from '@/types/riskRegister';
import { type FC } from 'react';

const likelihoodBgColors = {
  [riskRegisterLikelihoods.Expected]: 'bg-viz-likelihood-tags-expected',
  [riskRegisterLikelihoods.Likely]: 'bg-viz-likelihood-tags-likely',
  [riskRegisterLikelihoods.Possible]: 'bg-viz-likelihood-tags-possible',
  [riskRegisterLikelihoods.Unlikely]: 'bg-viz-likelihood-tags-unlikely',
  [riskRegisterLikelihoods.Rare]: 'bg-viz-likelihood-tags-rare',
};

type Props = {
  value: RiskRegisterLikelihood;
};

export const LikelihoodBadge: FC<Props> = ({ value }) => {
  return (
    <div className='flex items-center gap-[3px]'>
      {Object.values(riskRegisterLikelihoods).map((likelihood) =>
        likelihood === value ? (
          <Badge
            key={likelihood}
            className={cn(
              'font-bold',
              'h-[19px]',
              'text-xs',
              likelihoodBgColors[likelihood],
            )}
          >
            {value}
          </Badge>
        ) : (
          <Badge
            key={likelihood}
            className={cn(
              'font-bold',
              'opacity-[.15]',
              'p-0',
              'h-[19px] w-[7px]',
              likelihoodBgColors[likelihood],
            )}
          />
        ),
      )}
    </div>
  );
};
