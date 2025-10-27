import { Box, Flex, FlexProps } from '@chakra-ui/react';
import React, { FC } from 'react';
import { ThresholdType } from 'types/quantificationData';
import { useMaterialityContext } from '_pages/ResultsNarrative/MaterialityTab/MaterialityContext';
import Card from '../Card';
import { ThresholdCardContent } from './ThresholdCardContent';
import { ThresholdCardContextProvider } from './ThresholdCardContext';
import { ThresholdCardHeader } from './ThresholdCardHeader';
import {
  CardTranslationPrefix,
  ThresholdCardType,
  ThresholdCardTypes,
} from './types';

export type ThresholdCardProps = {
  threshold: number;
  targetedAnnualRate: number;
  thresholdValue: number;
  currency: string;
  translationPrefix: CardTranslationPrefix;
  curveType: ThresholdType;
  cardType?: ThresholdCardType;
  title?: string;
};

export const ThresholdCard: FC<ThresholdCardProps & FlexProps> = ({
  threshold,
  targetedAnnualRate,
  thresholdValue,
  currency,
  translationPrefix,
  curveType,
  cardType = ThresholdCardTypes.DEFAULT,
  title,
  ...restProps
}) => {
  const { isCardChecked, isCustomThresholdChecked, percentiles } =
    useMaterialityContext();

  const isChecked =
    cardType === ThresholdCardTypes.CUSTOM
      ? isCustomThresholdChecked
      : isCardChecked(threshold);

  const [cardWidth, cardContentHeight, dataTestId] =
    cardType === ThresholdCardTypes.DEFAULT
      ? ['198px', undefined, 'threshold-card']
      : ['411px', '81px', 'custom-threshold-card'];

  return (
    <Card
      padding='0'
      width={cardWidth}
      maxWidth={cardWidth}
      data-testid={dataTestId}
      alignSelf='stretch'
      {...restProps}
    >
      <ThresholdCardContextProvider
        threshold={threshold}
        targetedAnnualRate={targetedAnnualRate}
        thresholdValue={thresholdValue}
        currency={currency}
        translationPrefix={translationPrefix}
        curveType={curveType}
        cardType={cardType}
        percentiles={percentiles !== undefined ? percentiles : {}}
      >
        <Flex height='100%' direction='column'>
          <Box
            backgroundColor='brand.gray.17'
            height='32px'
            width='100%'
            borderTopRadius='2xl'
            padding='8px'
          >
            <ThresholdCardHeader
              title={title}
              defaultChecked={isChecked}
              showPopUpMenu={cardType == ThresholdCardTypes.CUSTOM}
            />
          </Box>
          <Box
            backgroundColor='brand.ghostWhite'
            borderBottomRadius='2xl'
            width='100%'
            padding='18px 8px'
            height={cardContentHeight}
            flexGrow='1'
          >
            <ThresholdCardContent />
          </Box>
        </Flex>
      </ThresholdCardContextProvider>
    </Card>
  );
};
