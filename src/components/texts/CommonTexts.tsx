import { Text, TextProps } from '@chakra-ui/react';
import React, { FC } from 'react';

export const OneAndHalfXSText: FC<TextProps> = ({ children, ...restProps }) => {
  return (
    <Text fontSize='xss' {...restProps}>
      {children}
    </Text>
  );
};

export const OneAndHalfXSTextBold: FC<TextProps> = ({
  children,
  ...restProps
}) => {
  return (
    <OneAndHalfXSText fontWeight='700' {...restProps}>
      {children}
    </OneAndHalfXSText>
  );
};

export const ExtraSmallText: FC<TextProps> = ({ children, ...restProps }) => {
  return (
    <Text fontSize='xs' {...restProps}>
      {children}
    </Text>
  );
};

export const ExtraSmallTextBold: FC<TextProps> = ({
  children,
  ...restProps
}) => {
  return (
    <ExtraSmallText fontWeight='700' {...restProps}>
      {children}
    </ExtraSmallText>
  );
};

export const SmallText: FC<TextProps> = ({ children, ...restProps }) => {
  return (
    <Text fontSize='sm' {...restProps}>
      {children}
    </Text>
  );
};

export const SmallTextBold: FC<TextProps> = ({ children, ...restProps }) => {
  return (
    <SmallText fontWeight='700' {...restProps}>
      {children}
    </SmallText>
  );
};

export const MediumText: FC<TextProps> = ({ children, ...restProps }) => {
  return (
    <Text fontSize='md' {...restProps}>
      {children}
    </Text>
  );
};

export const MediumTextBold: FC<TextProps> = ({ children, ...restProps }) => {
  return (
    <MediumText fontWeight='700' {...restProps}>
      {children}
    </MediumText>
  );
};

export const LargeText: FC<TextProps> = ({ children, ...restProps }) => {
  return (
    <Text fontSize='lg' {...restProps}>
      {children}
    </Text>
  );
};

export const LargeTextBold: FC<TextProps> = ({ children, ...restProps }) => {
  return (
    <LargeText fontWeight='700' {...restProps}>
      {children}
    </LargeText>
  );
};

export const ExtraLargeText: FC<TextProps> = ({ children, ...restProps }) => {
  return (
    <Text fontSize='xl' {...restProps}>
      {children}
    </Text>
  );
};

export const ExtraLargeTextBold: FC<TextProps> = ({
  children,
  ...restProps
}) => {
  return (
    <ExtraLargeText fontWeight='700' {...restProps}>
      {children}
    </ExtraLargeText>
  );
};

export const OneAndHalfXLText: FC<TextProps> = ({ children, ...restProps }) => {
  return (
    <Text fontSize='1.5xl' {...restProps}>
      {children}
    </Text>
  );
};

export const OneAndHalfXLTextBold: FC<TextProps> = ({
  children,
  ...restProps
}) => {
  return (
    <OneAndHalfXLText fontWeight='700' {...restProps}>
      {children}
    </OneAndHalfXLText>
  );
};

export const OneAndHalfXLTextExtraBold: FC<TextProps> = ({
  children,
  ...restProps
}) => {
  return (
    <OneAndHalfXLText fontWeight='900' {...restProps}>
      {children}
    </OneAndHalfXLText>
  );
};

export const DoubleXLText: FC<TextProps> = ({ children, ...restProps }) => {
  return (
    <Text fontSize='2.5xl' {...restProps}>
      {children}
    </Text>
  );
};

export const DoubleXLTextBold: FC<TextProps> = ({ children, ...restProps }) => {
  return (
    <DoubleXLText fontWeight='700' {...restProps}>
      {children}
    </DoubleXLText>
  );
};

export const QuadrupleXLText: FC<TextProps> = ({ children, ...restProps }) => {
  return (
    <Text fontSize='4.5xl' {...restProps}>
      {children}
    </Text>
  );
};

export const QuadrupleXLTextBold: FC<TextProps> = ({
  children,
  ...restProps
}) => {
  return (
    <QuadrupleXLText fontWeight='700' {...restProps}>
      {children}
    </QuadrupleXLText>
  );
};
export const QuadrupleXLTextExtraBold: FC<TextProps> = ({
  children,
  ...restProps
}) => {
  return (
    <QuadrupleXLText fontWeight='900' {...restProps}>
      {children}
    </QuadrupleXLText>
  );
};
