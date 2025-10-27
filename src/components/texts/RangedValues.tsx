import { Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import { QuadrupleXLText, QuadrupleXLTextExtraBold } from './CommonTexts';

        
const DASH_SIGN = '-';

type RangeTextDisplayProps = {
  value: string;
  order: string;
  prefix?: string;
  suffix?: string;
};

const RangeTextDisplay: FC<RangeTextDisplayProps> = ({
  value,
  order,
  prefix = '',
  suffix = '',
}) => {
  return (
    <Flex>
      <QuadrupleXLTextExtraBold>{`${prefix}${value}${suffix}`}</QuadrupleXLTextExtraBold>
      <QuadrupleXLText>{order}</QuadrupleXLText>
    </Flex>
  );
};

type RangedValuesDisplayProps = {
  lowerEndValue: string;
  lowerEndOrder: string;
  upperEndValue: string;
  upperEndOrder: string;
  prefix?: string;
  suffix?: string;
};

export const RangedValuesDisplay: FC<RangedValuesDisplayProps> = ({
  lowerEndValue,
  lowerEndOrder,
  upperEndValue,
  upperEndOrder,
  prefix,
  suffix,
}) => {
  return (
    <Flex gap='5px'>
      <RangeTextDisplay
        value={lowerEndValue}
        order={lowerEndOrder}
        prefix={prefix}
        suffix={suffix}
      />
      <QuadrupleXLTextExtraBold>{DASH_SIGN}</QuadrupleXLTextExtraBold>
      <RangeTextDisplay
        value={upperEndValue}
        order={upperEndOrder}
        prefix={prefix}
        suffix={suffix}
      />
    </Flex>
  );
};
