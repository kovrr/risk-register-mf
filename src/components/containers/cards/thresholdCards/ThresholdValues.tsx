import { Flex, Badge, FlexProps } from '@chakra-ui/react';
import { convertToInternationalCurrencySystemToFixed } from 'components/ui/charts/utils';
import { FC } from 'react';
import { ThresholdTypes } from 'types/quantificationData';
import { AmountTitleCard } from '../AmountTitleCard';
import { useThresholdCardContext } from './ThresholdCardContext';
import { getDurationAmountAndSuffix } from './thresholdCardHelpers';

export const ThresholdValues: FC<FlexProps> = ({ ...restProps }) => {
  const { currency, thresholdValue, curveType, likelihoodPercentage } =
    useThresholdCardContext();
  const { value: amount, suffix } =
    curveType === ThresholdTypes.DURATION
      ? getDurationAmountAndSuffix(thresholdValue)
      : convertToInternationalCurrencySystemToFixed(thresholdValue, 2);

  return (
    <Flex justifyContent='space-between' {...restProps}>
      <AmountTitleCard
        amount={`${Number(amount)}`}
        suffix={suffix}
        currency={curveType === ThresholdTypes.COST ? currency : ''}
        containerProps={{ gap: '3px' }}
        amountProps={{ fontSize: '22px' }}
        suffixProps={{ fontSize: '22px' }}
        currencyProps={{ fontSize: '11px' }}
      />
      <Badge
        variant='thresholdPercentage'
        textTransform='capitalize'
        fontSize='14px'
        justifyContent='center'
        alignContent='center'
        verticalAlign='middle'
        textAlign='center'
        maxHeight='28px'
      >
        {`${likelihoodPercentage}%`}
      </Badge>
    </Flex>
  );
};
