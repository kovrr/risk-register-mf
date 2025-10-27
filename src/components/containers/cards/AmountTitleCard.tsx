import { Flex, FlexProps, Text, TextProps } from '@chakra-ui/react';
import React, { FC } from 'react';

export interface AmountTitleCardProps {
  amount: string;
  suffix: string;
  currency?: string;
  containerProps?: FlexProps;
  amountProps?: TextProps;
  suffixProps?: TextProps;
  currencyProps?: TextProps;
}

export const AmountTitleCard: FC<AmountTitleCardProps> = ({
  amount,
  suffix,
  currency,
  containerProps,
  amountProps,
  suffixProps,
  currencyProps,
}) => {
  return (
    <Flex
      gap='4px'
      alignItems='baseline'
      data-testid='amount-title-card'
      {...containerProps}
    >
      <Text
        fontSize='38px'
        fontWeight='900'
        textAlign='center'
        {...amountProps}
      >
        {amount}
      </Text>
      <Text fontSize='38px' textAlign='center' {...suffixProps}>
        {suffix}
      </Text>
      <Text fontSize='16px' textAlign='center' {...currencyProps}>
        {currency}
      </Text>
    </Flex>
  );
};
