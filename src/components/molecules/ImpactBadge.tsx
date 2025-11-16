import { Badge } from '@chakra-ui/react';
import { type FC } from 'react';
import { riskRegisterImpacts, type RiskRegisterImpact } from '@/types/riskRegister';

const impactBg: Record<RiskRegisterImpact, string> = {
  [riskRegisterImpacts.Severe]: '#FDE2E4',
  [riskRegisterImpacts.Significant]: '#FFE8D1',
  [riskRegisterImpacts.Moderate]: '#FFF6BF',
  [riskRegisterImpacts.Minor]: '#E7F0FF',
  [riskRegisterImpacts.Negligible]: '#EEF2F7',
};

type Props = {
  value?: RiskRegisterImpact;
};

export const ImpactBadge: FC<Props> = ({ value }) => {
  if (!value) return <>-</>;
  return (
    <Badge
      borderRadius='20px'
      fontSize='12px'
      fontWeight='500'
      px='8px'
      py='2px'
      bg={impactBg[value]}
      color='gray.800'
      textTransform='none'
      border='none'
      boxShadow='none'
    >
      {value}
    </Badge>
  );
};

export default ImpactBadge;


