import { Text, Checkbox, Flex, Badge } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMaterialityContext } from '_pages/ResultsNarrative/MaterialityTab/MaterialityContext';
import { CustomThresholdPopupMenu } from './CustomThresholdPopupMenu';
import { useThresholdCardContext } from './ThresholdCardContext';
import { ThresholdCardTypes } from './types';

type Props = {
  defaultChecked?: boolean;
  title?: string;
  showPopUpMenu?: boolean;
};

export const ThresholdCardHeader: FC<Props> = ({
  defaultChecked,
  title,
  showPopUpMenu = false,
}) => {
  const { translationPrefix, cardType, threshold } = useThresholdCardContext();
  const { handleCheckCard, handleCustomThresholdCheck } =
    useMaterialityContext();

  const { t } = useTranslation('resultsNarrative', {
    keyPrefix: `materialityAnalysis.thresholdCard.${translationPrefix}`,
  });

  const onChange =
    cardType === ThresholdCardTypes.CUSTOM
      ? handleCustomThresholdCheck
      : handleCheckCard;

  return (
    <Flex
      gap='10px'
      alignItems='center'
      height='100%'
      data-testid={`threshold-card-header-${cardType}`}
    >
      <Checkbox
        variant='thresholdCardTitle'
        defaultChecked={defaultChecked ?? true}
        onChange={() => onChange(threshold)}
        data-testid='threshold-card-header-checkbox'
      >
        <Text fontSize='13px' lineHeight='normal'>
          {title || t('title', { threshold })}
        </Text>
      </Checkbox>
      {cardType === ThresholdCardTypes.CUSTOM && (
        <Badge variant='customThresholdHeader' fontSize='12px'>
          {t('customThreshold')}
        </Badge>
      )}
      {showPopUpMenu && <CustomThresholdPopupMenu />}
    </Flex>
  );
};
