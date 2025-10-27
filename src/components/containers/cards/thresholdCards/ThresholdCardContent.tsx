import { Divider, Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useThresholdCardContext } from './ThresholdCardContext';
import { ThresholdExplanations } from './ThresholdExplanation';
import { ThresholdValues } from './ThresholdValues';
import { ThresholdCardTypes } from './types';

export const ThresholdCardContent: FC = () => {
  const { cardType } = useThresholdCardContext();
  const [direction, dividerStyles, thresholdValuesStyles] =
    cardType === ThresholdCardTypes.DEFAULT
      ? (['column', {}, { minWidth: '172px', alignSelf: 'center' }] as const)
      : ([
          'row',
          {
            orientation: 'vertical',
            height: '45px',
            color: 'brand.gray.8',
            border: '1px',
          },
          { minWidth: '145px', alignSelf: 'baseline' },
        ] as const);
  return (
    <Flex
      direction={direction}
      gap='10px'
      alignItems='center'
      data-testid={`threshold-card-content-${cardType}`}
    >
      <ThresholdValues {...thresholdValuesStyles} />
      <Divider {...dividerStyles} />
      <ThresholdExplanations />
    </Flex>
  );
};
