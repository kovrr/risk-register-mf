// components/ui/TextWithPopover.tsx
import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Flex,
  Text,
  Box,
} from '@chakra-ui/react';

interface Props {
  description?: string;
  trigger?: 'click' | 'hover';
  text: string;
  bulletList?: { title: string; bgColor: string }[];
  bulletListTitle?: string;
}

const popoverStyle = {
  backgroundColor: 'brand.black',
  fontWeight: '400',
  color: 'brand.white',
  fontSize: '13px',
};

const TextWithPopover: React.FC<Props> = ({
  description,
  trigger = 'hover',
  text,
  bulletList,
  bulletListTitle,
}) => {
  return (
    <Popover trigger={trigger}>
      <PopoverTrigger>
        <Flex h='100%' alignItems='center'>
          {text}
        </Flex>
      </PopoverTrigger>
      {(description || bulletList) && (
        <PopoverContent>
          <PopoverArrow backgroundColor='brand.tooltip' />
          <PopoverBody {...popoverStyle} textTransform='none'>
            {description}
            {bulletList && (
              <>
                <Text
                  fontSize='13px'
                  fontWeight='700'
                  color='brand.white'
                  mt={2}
                  mb={2}
                >
                  {bulletListTitle}
                </Text>
                {bulletList.map((item) => (
                  <Flex key={item.title} alignItems='center' mb={2}>
                    <Box w='10px' h='10px' bgColor={item.bgColor} mr={1} />
                    <Text fontSize='13px' fontWeight='400' color='#fff'>
                      {item.title}
                    </Text>
                  </Flex>
                ))}
              </>
            )}
          </PopoverBody>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default TextWithPopover;
