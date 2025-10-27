import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';

const SpeechBubble: React.FC<BoxProps> = ({
  children,
  ...restProps
}: BoxProps) => {
  return (
    <Box
      bgColor='brand.white'
      position='relative'
      w='390px'
      h='205px'
      padding='6'
      borderWidth='0.5px'
      borderColor='#D9D9D9'
      borderRadius='0px 5px 5px 5px'
      _after={{
        content: '""',
        position: 'absolute',
        left: 0,
        top: '20.5px',
        width: 0,
        height: 0,
        borderRightColor: 'white',
        borderLeft: 0,
        borderTop: 0,
        borderBottomWidth: '72px',
        borderTopLeftRadius: '4px',
        marginTop: '-20.5px',
        marginLeft: '-32px',
        zIndex: 2,
      }}
      _before={{
        content: '""',
        position: 'absolute',
        left: '-0.5px',
        top: '19.5px',
        width: 0,
        height: '74px',
        borderLeft: 0,
        borderTop: 0,
        borderBottomWidth: '72px',
        borderTopLeftRadius: '4px',
        marginTop: '-20.5px',
        marginLeft: '-32px',
        zIndex: 1,
        borderRightColor: '#D9D9D9',
      }}
      {...restProps}
    >
      {children}
    </Box>
  );
};

export default SpeechBubble;
