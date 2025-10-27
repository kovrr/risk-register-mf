import { FC } from 'react';
import { Badge } from '@chakra-ui/react';

export const StatusBadge: FC<{ status: string }> = ({ status }) => {
  return (
    <Badge variant={status.toLowerCase()} fontSize='12px'>
      {status}
    </Badge>
  );
};
