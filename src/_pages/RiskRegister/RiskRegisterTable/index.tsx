import { Toaster } from '@/components/atoms/sonner';
import { useMixpanel } from '@/hooks/useMixpanel';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRiskRegisterTable } from './useRiskRegisterTable';
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import PriorityBadge from '@/components/molecules/PriorityBadge';
import ImpactBadge from '@/components/molecules/ImpactBadge';
import { LikelihoodBadge } from '@/components/molecules/LikelihoodBadge';
import { StatusBadge } from '@/components/ui/Badge/StatusBadge';
import { ScenarioDetails } from './Cells/ScenarioDetails';

const RiskRegisterTable = () => {
  const { t } = useTranslation('riskRegister', { keyPrefix: 'table' });
  const [searchInput, setSearchInput] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  useMemo(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const {
    table,
    pageCount,
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    totalCount,
    isLoading,
    isFetching,
  } = useRiskRegisterTable({ search });

  const { track: trackEvent } = useMixpanel();

  useEffect(() => {
    trackEvent('risk_register.table_viewed');
  }, [trackEvent]);

  const rows = table.getRowModel().rows;

  return (
    <Box className='max-w-8xl mx-auto my-8' data-testid='risk-register-table'>
      <Flex mb='16px'>
        <InputGroup width={['350px', '420px']}>
          <InputLeftElement pointerEvents='none' pl='8px'>
            <SearchIcon color='gray.400' />
          </InputLeftElement>
          <Input
            height='40px'
            border='1px solid #E2E8F0'
            bg='white'
            borderRadius='8px'
            pl='36px'
            placeholder='Search scenarios…'
            _placeholder={{ color: 'gray.400' }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </InputGroup>
      </Flex>

      <Box bg='white' borderRadius='8px' overflow='hidden'>
        <Table>
          <Thead bg='#F5F7FA'>
            <Tr height='40px'>
              {[
                'ID',
                'Scenario Name',
                'Category',
                'Priority',
                'Impact',
                'Likelihood',
                'Status',
                'Owner',
              ].map((h) => (
                <Th
                  key={h}
                  textTransform='uppercase'
                  fontWeight='600'
                  fontSize='12px'
                  letterSpacing='0.02em'
                  color='gray.700'
                  paddingLeft='16px'
                >
                  {h}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((r) => {
              const d = r.original;
              return (
                <Tr
                  key={d.id}
                  height='52px'
                  borderBottom='1px solid #EDEDED'
                  _hover={{ bg: '#FAFAFC' }}
                >
                  <Td paddingLeft='16px'>
                    <Text
                      color='#367BF5'
                      _hover={{ color: '#2f6fe0' }}
                      fontWeight='500'
                      whiteSpace='nowrap'
                    >
                      {d.customerScenarioId || '-'}
                    </Text>
                  </Td>
                  <Td paddingLeft='16px'>
                    <ScenarioDetails
                      id={d.scenarioId}
                      title={d.scenarioTitle}
                      description={d.scenarioDescription}
                      disabled={false}
                    />
                  </Td>
                  <Td paddingLeft='16px' color='gray.800'>
                    {d.category || '-'}
                  </Td>
                  <Td paddingLeft='16px'>
                    <PriorityBadge value={d.priority} />
                  </Td>
                  <Td paddingLeft='16px'>
                    <ImpactBadge value={d.impact} />
                  </Td>
                  <Td paddingLeft='16px'>
                    <LikelihoodBadge value={d.likelihood} />
                  </Td>
                  <Td paddingLeft='16px'>
                    <StatusBadge status={String(d.status)} />
                  </Td>
                  <Td paddingLeft='16px' color='gray.700'>
                    {d.owner || '-'}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
      <Toaster />
    </Box>
  );
};

export default RiskRegisterTable;
