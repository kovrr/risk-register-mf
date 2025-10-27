import { FC } from 'react';
import { Flex, Text } from '@chakra-ui/react';

export const RiskDriverLegendItem: FC<{
  icon: React.ReactNode;
  title: string;
  value?: string | number;
}> = ({ icon, title, value }) => {
  return (
    <Flex fontSize='12px' color={'brand.gray.16'}>
      <Flex gap='7px' alignItems='center'>
        {icon}
        <Text fontWeight='700'>{title}</Text>
        {value}
      </Flex>
    </Flex>
  );
};
