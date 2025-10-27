import { Box, Flex } from '@chakra-ui/react';
import { SmallTextBold } from 'components/texts/CommonTexts';
import React from 'react';

type CounterBadgeProps = {
  icon: React.ReactNode;
  text: string;
  count: string;
};

export const CounterBadge: React.FC<CounterBadgeProps> = ({
  icon,
  text,
  count,
}) => {
  return (
    <Flex
      direction='row'
      gap='10px'
      backgroundColor='fill.base.1'
      borderLeftRadius='15px'
      borderRightRadius='15px'
      paddingX='10px'
      paddingY='5px'
      alignContent='center'
    >
      <Box margin='auto'>{icon}</Box>
      {text}
      <Flex
        height='25px'
        width='25px'
        borderRadius='50%'
        backgroundColor='fill.brand.primary'
        justifyContent='center'
        alignContent='center'
        alignItems='center'
      >
        <SmallTextBold color='text.base.invert' alignContent='center'>
          {count}
        </SmallTextBold>
      </Flex>
    </Flex>
  );
};
