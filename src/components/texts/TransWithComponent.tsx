import React, { FC, PropsWithChildren } from 'react';
import { Trans, TransProps } from 'react-i18next';

type Props = TransProps<any> & PropsWithChildren;

export const TransWithComponent: FC<Props> = ({ children, ...transProps }) => {
  return <Trans {...transProps}>{children}</Trans>;
};
