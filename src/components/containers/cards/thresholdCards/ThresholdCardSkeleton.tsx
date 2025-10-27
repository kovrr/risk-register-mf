import { BoxProps, Skeleton } from '@chakra-ui/react';
import React, { FC } from 'react';
import Card from '../Card';
import { ThresholdCardType, ThresholdCardTypes } from './types';

const DEFAULT_CARD_WIDTH = '196px';
const DEFAULT_CARD_HEIGHT = '214px';
const CUSTOM_CARD_WIDTH = '411px';
const CUSTOM_CARD_HEIGHT = '113px';

type Props = {
  cardType: ThresholdCardType;
};

export const ThresholdCardSkeleton: FC<Props & BoxProps> = ({
  cardType,
  ...restProps
}) => {
  const [cardWidth, cardHeight] =
    cardType === ThresholdCardTypes.DEFAULT
      ? [DEFAULT_CARD_WIDTH, DEFAULT_CARD_HEIGHT]
      : [CUSTOM_CARD_WIDTH, CUSTOM_CARD_HEIGHT];
  return (
    <Skeleton isLoaded={false} borderRadius='2xl'>
      <Card
        padding='0'
        width={cardWidth}
        maxWidth={cardWidth}
        height={cardHeight}
        {...restProps}
      ></Card>
    </Skeleton>
  );
};
