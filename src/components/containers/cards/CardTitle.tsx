import { Flex, FlexProps, Text } from '@chakra-ui/react';
import { FC } from 'react';

export const CardTitle: FC<
  { title: string; description?: string; titleFontSize?: string } & FlexProps
> = ({ title, description, titleFontSize = '17px', ...restProps }) => {
  return (
    <Flex flexDirection='column' gap='2px' {...restProps}>
      <Text fontSize={titleFontSize} fontWeight='700'>
        {title}
      </Text>
      {description && <Text variant='cardDesc3'>{description}</Text>}
    </Flex>
  );
};
