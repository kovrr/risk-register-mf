import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const EmptyTable: React.FC = () => {
  const { t } = useTranslation('resultsNarrative', {
    keyPrefix: 'riskEvaluation.topActions.emptyState',
  });

  return (
    <Box>
      <Box textAlign='center'>
        <Box margin='auto' textAlign='center'>
          <Text fontSize='14px' fontWeight={600} mb='3px' color='brand.gray.12'>
            {t('messageTitle')}
          </Text>
          <Text
            fontSize='12px'
            color='brand.gray.16'
            fontWeight={400}
            mb='0px'
            mt='0px'
            lineHeight='1.2'
          >
            {t('messageDescription')}
          </Text>
          <Text
            fontSize='12px'
            color='brand.gray.16'
            fontWeight={400}
            mb='0px'
            mt='0px'
            lineHeight='1.2'
          >
            {t('reasons.zeroImpact')}
          </Text>
          <Text
            fontSize='12px'
            color='brand.gray.16'
            fontWeight={400}
            mt='0px'
            lineHeight='1.2'
          >
            {t('reasons.allControlsUnknown')}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
