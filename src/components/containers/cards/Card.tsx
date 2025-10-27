import React from 'react';
import { Box, BoxProps } from '@chakra-ui/layout';

export const Card: React.FC<BoxProps> = ({
  children,
  ...restProps
}: BoxProps) => {
  return (
    <Box borderRadius='2xl' bgColor='brand.white' p='6' {...restProps}>
      {children}
    </Box>
  );
};

export default Card;
