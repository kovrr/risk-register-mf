import {
  Badge,
  type TableCellProps,
  Td,
  Text,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import type { CompanyWithError } from 'types/companyForm';

export const isCompanyWithError = (
  company: any,
): company is CompanyWithError => {
  return 'has_errors' in company && company.has_errors === true;
};

const styles = {
  td: {
    fontSize: 'sm',
    alignItems: 'center',
  } as TableCellProps,
};

const CompanyErrorRow: React.FC<CompanyWithError> = ({ name }) => {
  const { t } = useTranslation('common');

  return (
    <Tr bgColor='white'>
      <Td fontSize='14px' fontWeight='bold'>
        <Tooltip label={t('errors.companyValidation')} placement='top'>
          <Text
            color='gray.500'
            cursor='help'
            fontSize='14px'
            fontWeight='bold'
          >
            {name}
          </Text>
        </Tooltip>
      </Td>
      <Td {...styles.td}>-</Td>
      <Td {...styles.td}>-</Td>
      <Td {...styles.td}>-</Td>
      <Td {...styles.td}>-</Td>
      <Td {...styles.td}>
        <Tooltip label={t('errors.companyValidation')} placement='top'>
          <Badge
            bgColor='yellow.300'
            variant='solid'
            color='brand.black'
            fontWeight='bold'
            fontSize='13px'
            px='10px'
            py='5px'
          >
            {t('errors.requiresAttention')}
          </Badge>
        </Tooltip>
      </Td>
      <Td {...styles.td}>-</Td>
      <Td {...styles.td}>-</Td>
      <Td {...styles.td}>-</Td>
    </Tr>
  );
};

export default CompanyErrorRow;
