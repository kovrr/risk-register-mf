import { Box, BoxProps, Flex, Text } from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import Card from './Card';

type Props = {
  title: string;
  description: string;
  unavailableText?: string;
  scoreComponent?: ReactNode;
} & BoxProps;

export const ScoreCard: FC<Props> = ({
  title,
  description,
  scoreComponent,
  unavailableText,
  ...restProps
}) => {
  return (
    <Card mb='8' p='15px 20px 0 20px' width='550px' {...restProps}>
      {scoreComponent ? (
        <Flex gap='25px'>
          <Flex direction='column' gap='10px'>
            <Text variant='cardTitle3'>{title}</Text>
            <Text variant='cardDesc3' mb='20px'>
              {description}
            </Text>
          </Flex>
          {scoreComponent}
        </Flex>
      ) : (
        <Box>
          <Text fontSize='14px' color='brand.misc.6' mb='20px'>
            {unavailableText}
          </Text>
        </Box>
      )}
    </Card>
  );
};
