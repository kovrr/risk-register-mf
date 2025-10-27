import { Badge, BadgeProps } from '@chakra-ui/react';
import React from 'react';

type SquareBadgeProps = BadgeProps;

export const SquareBadge: React.FC<SquareBadgeProps> = ({ ...props }) => {
  return (
    <Badge
      borderRadius='4px'
      padding='2px 4px'
      alignContent='center'
      textAlign='center'
      backgroundColor='brand.blue.dark'
      textTransform='none'
      {...props}
    />
  );
};
