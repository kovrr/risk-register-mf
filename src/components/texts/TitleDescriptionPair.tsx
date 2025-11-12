import { Flex, FlexProps, TextProps } from '@chakra-ui/react';
import { FC } from 'react';
import { SmallText, SmallTextBold } from './CommonTexts';

type Props = {
  title: string;
  description: string;
  titleProps?: TextProps;
  descriptionProps?: TextProps;
} & FlexProps;

export const TitleDescriptionPair: FC<Props> = ({
  title,
  description,
  titleProps,
  descriptionProps,
  ...restProps
}) => {
  return (
    <Flex direction='column' {...restProps}>
      <SmallTextBold {...titleProps}>{title}</SmallTextBold>
      <SmallText {...descriptionProps}>{description}</SmallText>
    </Flex>
  );
};
