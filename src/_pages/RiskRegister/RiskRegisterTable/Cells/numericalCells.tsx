import { addCurrencySign } from '@/helpers/string';
import { CurrencyCodeType } from '@/options/constants';
import { FC } from 'react';

type Props = {
  value: number;
};

export const PercentageCell: FC<Props> = ({ value }) => {
  // Format value: up to 2 decimals, no trailing zeros for whole numbers
  const formattedValue = value ? Number(value.toFixed(2)) : undefined;
  if (formattedValue === undefined) {
    return <div className='text-sm'></div>;
  }
  return <div className='text-sm'>{formattedValue}%</div>;
};

export const CurrencyCell: FC<Props & { currency: CurrencyCodeType }> = ({
  value,
  currency,
}) => {
  const formattedValue = addCurrencySign(value, currency);
  return <div className='text-sm'>{formattedValue}</div>;
};
