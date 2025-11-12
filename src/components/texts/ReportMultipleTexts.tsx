import { Box, BoxProps, TextProps } from '@chakra-ui/react';
import { FC } from 'react';
import { SmallText } from './CommonTexts';

type Props = {
  texts: string[];
  textProps?: TextProps;
} & BoxProps;

export const ReportMultipleTexts: FC<Props> = ({
  texts,
  textProps,
  ...restProps
}) => {
  return (
    <Box {...restProps}>
      {texts.map((text: string, index: number) => (
        <SmallText key={index} {...textProps}>
          {text}
        </SmallText>
      ))}
    </Box>
  );
};
