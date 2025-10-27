import { FC, useMemo } from 'react';

const calculateRateDiff = (amountA: number, amountB: number) =>
  (amountA / amountB - 1) * 100;

export type percentageDifferenceProps = {
  rateA: number;
  rateB?: number;
  shouldShowNoDifference?: boolean;
  className?: string;
  hideSign?: boolean;
};

export const PercentageDifference: FC<percentageDifferenceProps> = ({
  rateA,
  rateB,
  shouldShowNoDifference,
  className = '',
  hideSign,
}) => {
  const rateDiff = useMemo(() => {
    if (rateB === 0 || rateB === undefined) return 0;
    return calculateRateDiff(rateA, rateB);
  }, [rateA, rateB]);

  const [diffSign, diffArrow, textColorClass] = useMemo(() => {
    if (rateDiff > 0) {
      return ['+', '↑', 'text-red-600'];
    } else {
      return ['-', '↓', 'text-green-600'];
    }
  }, [rateDiff]);

  if (rateB === undefined) return null;

  if (rateDiff !== 0) {
    return (
      <span className={`text-base font-bold ${textColorClass} ${className}`}>
        {`${hideSign ? '' : diffSign}${Math.abs(
          Math.round(rateDiff * 100) / 100,
        )}% ${diffArrow}`}
      </span>
    );
  }

  if (shouldShowNoDifference) {
    return (
      <span className={`text-xs font-bold text-gray-500 ${className}`}>
        No Change
      </span>
    );
  }

  return null;
};
