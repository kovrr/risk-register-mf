import React, { ReactNode } from 'react';
import { BoxProps, Text, TextProps } from '@chakra-ui/react';
import SpeechBubble from './components/SpeechBubble';
import InfoHeader from './components/InfoHeader';

type BubbleCardProps = {
  title: string;
  content: string | ReactNode;
  headerProps?: TextProps;
} & BoxProps;

const BubbleCard: React.FC<BubbleCardProps> = ({
  title,
  content,
  headerProps,
  ...restProps
}) => {
  return (
    <SpeechBubble
      h='fit-content'
      borderRadius='5px'
      border='1px solid brand.gray.15'
      {...restProps}
    >
      <InfoHeader title={title} textProps={headerProps} />
      {typeof content === 'string' ? (
        <Text fontSize='14px' color='brand.misc.6' lineHeight='normal'>
          {content}
        </Text>
      ) : (
        content
      )}
    </SpeechBubble>
  );
};

export default BubbleCard;
