import { Box, BoxProps, Flex, Image } from '@chakra-ui/react';
import { DoubleXLTextBold } from 'components/texts/CommonTexts';
import React from 'react';
import { useTranslation } from 'react-i18next';

const QuestionMark = () => {
  return (
    <Flex
      fontSize='2.5xl'
      color='text.base.invert'
      backgroundColor='fill.brand.primary'
      boxSize='50px'
      textAlign='center'
      justifyContent='center'
      alignItems='center'
    >
      <Image
        alt='question mark'
        src='/assets/QuestionMark.svg'
        width='20px'
        height='32px'
      />
    </Flex>
  );
};

type RociExplanationCardProps = {
  title?: string;
  children: React.ReactNode;
} & BoxProps;

export const RociExplanationCard: React.FC<RociExplanationCardProps> = ({
  title,
  children,
  ...props
}) => {
  const { t } = useTranslation('roci', {
    keyPrefix: 'report.rociExplanationCard',
  });

  return (
    <Flex
      backgroundColor='fill.base.1'
      margin='auto'
      flexDirection='column'
      {...props}
    >
      <Flex gap='10px' alignItems='center'>
        <QuestionMark />
        <DoubleXLTextBold color='text.brand.primary'>
          {title ?? t('title')}
        </DoubleXLTextBold>
      </Flex>
      <Box padding='20px' flexGrow={1}>
        {children}
      </Box>
    </Flex>
  );
};
