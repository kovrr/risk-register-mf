import { FC } from 'react';
import { CurrencyCell, PercentageCell } from './numericalCells';
import { RiskRegisterRow } from '@/types/riskRegister';

interface AnnualLikelihoodAverageLossCellProps {
  row: RiskRegisterRow;
}

export const AnnualLikelihoodAverageLossCell: FC<
  AnnualLikelihoodAverageLossCellProps
> = ({ row }) => {
  const annualLikelihood = row.annualLikelihood;
  const averageLoss = row.averageLoss;
  const currency = row.averageLossCurrency ?? 'USD';

  return (
    <div className="flex flex-col gap-1">
      {annualLikelihood !== undefined && annualLikelihood !== null && (
        <PercentageCell value={annualLikelihood} />
      )}
      {averageLoss !== undefined && averageLoss !== null && (
        <CurrencyCell value={averageLoss} currency={currency} />
      )}
    </div>
  );
};
