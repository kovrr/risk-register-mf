import { Flex, FlexProps } from '@chakra-ui/react';
import React, { FC } from 'react';

export const Legend: FC<FlexProps> = ({ children, ...restProps }) => {
  return (
    <Flex gap='12px' flexWrap='wrap' justifyContent='center' {...restProps}>
      {children}
    </Flex>
  );
};
