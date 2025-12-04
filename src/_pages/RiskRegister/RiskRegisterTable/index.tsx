import { Toaster } from '@/components/atoms/sonner';
import ImpactBadge from '@/components/molecules/ImpactBadge';
import { LikelihoodBadge } from '@/components/molecules/LikelihoodBadge';
import { StatusBadge } from '@/components/ui/Badge/StatusBadge';
import { useMixpanel } from '@/hooks/useMixpanel';
import { useGroups } from '@/services/hooks';
import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { PriorityDropdownMutate } from '../components/PriorityDropdownMutate';
import { RiskOwnerDropdownMutate } from '../components/RiskOwner';
import { TagFilterDropdown } from '../components/TagFilterDropdown';
import { ScenarioDetails } from './Cells/ScenarioDetails';
import { TableActions } from './Cells/TableActions';
import { TagsCell } from './Cells/TagsCell';
import { useRiskRegisterTable } from './useRiskRegisterTable';

type RiskRegisterTableProps = {
  groupId?: string | null;
};

const RiskRegisterTable: React.FC<RiskRegisterTableProps> = ({ groupId }) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // Get user's groups for tag filtering
  const { data: groupsData } = useGroups({
    page: 1,
    pageSize: 100,
  });
  const groupIds =
    (groupsData?.results
      ?.map((g) => g.documentId)
      .filter(Boolean) as string[]) || [];

  useMemo(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const { table } = useRiskRegisterTable({
    search,
    groupId,
    tagIds: selectedTagIds,
  });

  const { track: trackEvent } = useMixpanel();

  useEffect(() => {
    trackEvent('risk_register.table_viewed');
  }, [trackEvent]);

  const rows = table.getRowModel().rows;

  // Extract all tag IDs from currently visible scenarios
  const availableTagIds = useMemo(() => {
    const tagIdSet = new Set<string>();
    rows.forEach((row) => {
      const tags = row.original.tags || [];
      tags.forEach((tag: { id: string }) => {
        if (tag?.id) {
          tagIdSet.add(tag.id);
        }
      });
    });
    return Array.from(tagIdSet);
  }, [rows]);

  return (
    <Box className='max-w-8xl mx-auto my-8' data-testid='risk-register-table'>
      <Flex mb='16px' gap='12px' flexWrap='wrap' alignItems='center'>
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
        {groupIds.length > 0 && (
          <TagFilterDropdown
            groupIds={groupIds}
            selectedTagIds={selectedTagIds}
            onSelectionChange={setSelectedTagIds}
            availableTagIds={availableTagIds}
          />
        )}
      </Flex>

      <Box bg='white' borderRadius='8px' overflow='hidden'>
        <Table>
          <Thead bg='#F5F7FA'>
            <Tr height='40px'>
              {[
                'ID',
                'Scenario Name',
                'Category',
                'Tags',
                'Priority',
                'Impact',
                'Likelihood',
                'Status',
                'Owner',
                '',
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
                    <TagsCell tags={d.tags || []} />
                  </Td>
                  <Td paddingLeft='16px'>
                    <PriorityDropdownMutate value={d.priority} rowData={d} />
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
                    <RiskOwnerDropdownMutate value={d.owner} rowData={d} />
                  </Td>
                  <Td paddingLeft='16px' isNumeric={false}>
                    <TableActions scenario={d} />
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
