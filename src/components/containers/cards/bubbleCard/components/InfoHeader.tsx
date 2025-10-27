import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Divider, Flex, Text, TextProps } from '@chakra-ui/react';
import React from 'react';

interface Props {
  title: string;
  textProps?: TextProps;
}

const InfoHeader: React.FC<Props> = ({ title, textProps }) => {
  return (
    <>
      <Flex alignItems='center'>
        <InfoOutlineIcon />
        <Text fontWeight='bold' fontSize='18px' ml='3' {...textProps}>
          {title}
        </Text>
      </Flex>
      <Divider
        variant='dashed'
        mt='1'
        mb='3'
        color='brand.misc.2'
        borderBottomWidth={3}
      />
    </>
  );
};

export default InfoHeader;
