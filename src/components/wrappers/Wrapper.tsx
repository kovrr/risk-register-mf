import React from 'react';
import { Box, BoxProps } from '@chakra-ui/layout';

const Wrapper: React.FC<BoxProps> = ({ children, ...restProps }: BoxProps) => {
  return (
    <Box
      maxWidth='container.xxl'
      margin='0 auto'
      w='100%'
      px='14'
      {...restProps}
    >
      {children}
    </Box>
  );
};

export default Wrapper;
