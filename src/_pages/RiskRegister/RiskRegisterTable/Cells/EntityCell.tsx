import { RiskRegisterRow } from '@/types/riskRegister';
import { FC } from 'react';

interface EntityCellProps {
  row: RiskRegisterRow;
}

export const EntityCell: FC<EntityCellProps> = ({ row }) => {
  // Use the company_name field directly from the backend response
  // This field is populated by the backend based on the company_id
  return <div>{row.company_name || 'N/A'}</div>;
};
