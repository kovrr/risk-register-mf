import { Flex, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useThresholdCardContext } from './ThresholdCardContext';
import { ThresholdCardTypes } from './types';

export const ThresholdExplanations: FC = () => {
  const {
    translationPrefix,
    cardType,
    threshold,
    likelihoodPercentage,
    curveType,
  } = useThresholdCardContext();
  const { t } = useTranslation('resultsNarrative', {
    keyPrefix: `materialityAnalysis.thresholdCard.${translationPrefix}`,
  });
  const navigate = useNavigate();

  const navigateToThresholdDrillDown = () => {
    navigate(`threshold-drill-down?type=${curveType}&value=${threshold}`);
  };

  return (
    <Flex
      direction='column'
      gap='2px'
      data-testid={`threshold-card-explanation-${cardType}`}
    >
      <Text
        fontSize='12px'
        fontWeight='400'
        lineHeight='normal'
        color='brand.gray.12'
      >
        {t('explanation', { likelihood: likelihoodPercentage, threshold })}
      </Text>
      {cardType === ThresholdCardTypes.DEFAULT && likelihoodPercentage >= 1 && (
        <Text
          fontSize='12px'
          variant='link'
          onClick={navigateToThresholdDrillDown}
        >
          {t('explore')}
        </Text>
      )}
    </Flex>
  );
};
