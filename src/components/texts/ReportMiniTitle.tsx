import { TextProps } from '@chakra-ui/react';
import { FC, PropsWithChildren } from 'react';
import { LargeTextBold } from './CommonTexts';

export const ReportMiniTitle: FC<PropsWithChildren & TextProps> = ({
  children,
  ...restProps
}) => {
  return <LargeTextBold {...restProps}>{children}</LargeTextBold>;
};
