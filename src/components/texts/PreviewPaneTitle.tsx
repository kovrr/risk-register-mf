import React, { FC } from 'react';
import { Text, TextProps } from '@chakra-ui/react';

export const PreviewPaneTitle: FC<TextProps> = ({ children, ...restProps }) => {
  return (
    <Text
      fontSize='30px'
      fontStyle='normal'
      fontWeight='700'
      lineHeight='normal'
      color='brand.blue.navy'
      {...restProps}
    >
      {children}
    </Text>
  );
};
