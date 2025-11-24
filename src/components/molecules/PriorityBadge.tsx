import { Badge } from '@chakra-ui/react';
import { type FC } from 'react';
import { type RiskRegisterPriority } from '@/types/riskRegister';

const priorityBg: Record<RiskRegisterPriority, string> = {
  Critical: '#FDE2E4', // pastel red/pink
  High: '#FFE8D1', // pastel amber/orange
  Medium: '#FFF6BF', // pastel yellow
  Low: '#DFF7E3', // pastel green
};

type Props = {
  value?: RiskRegisterPriority;
};

export const PriorityBadge: FC<Props> = ({ value }) => {
  if (!value) return <>-</>;
  return (
    <Badge
      borderRadius='20px'
      fontSize='12px'
      fontWeight='500'
      px='8px'
      py='2px'
      bg={priorityBg[value]}
      color='gray.800'
      textTransform='none'
      border='none'
      boxShadow='none'
    >
      {value}
    </Badge>
  );
};

export default PriorityBadge;


