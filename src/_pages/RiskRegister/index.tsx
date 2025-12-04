import ScenarioTopBarNoSearch from '@/_pages/RiskRegister/components/ScenarioTopBarNoSearch';
import { useGroups } from '@/services/hooks';
import type { Group } from '@/types/group';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import KovrrInsights from './insights';
import RiskRegisterTable from './RiskRegisterTable';
import RiskRegisterVisualization from './visualization';

const RiskRegister = () => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: groupsData, isFetching: isFetchingGroups } = useGroups({
    page: 1,
    pageSize: 25,
    sort: 'name:ASC',
  });

  const groups = groupsData?.results ?? [];
  const selectedGroupId = selectedGroup?.documentId ?? null;
  const selectedGroupLabel = selectedGroup?.name ?? 'All groups';

  // Load saved group ID from localStorage on mount
  useEffect(() => {
    try {
      const savedGroupId = localStorage.getItem('active_group_id');
      if (savedGroupId && groups.length > 0) {
        const foundGroup = groups.find((g) => g.documentId === savedGroupId);
        if (foundGroup) {
          setSelectedGroup(foundGroup);
        }
      }
    } catch (error) {
      console.warn('Failed to load active group from localStorage:', error);
    }
  }, [groups]);

  const handleSelectGroup = (group: Group | null) => {
    setSelectedGroup(group);
    onClose();

    // Save to localStorage
    try {
      if (group?.documentId) {
        localStorage.setItem('active_group_id', group.documentId);
      } else {
        localStorage.removeItem('active_group_id');
      }
    } catch (error) {
      console.warn('Failed to save active group to localStorage:', error);
    }
  };

  return (
    <div className='min-h-screen'>
      <div className='mx-auto w-full max-w-[1440px] px-5 py-6 md:px-8 md:py-8'>
        <div className='flex flex-col gap-6'>
          <ScenarioTopBarNoSearch />
          <Flex justifyContent='flex-start'>
            <Flex alignItems='center' gap='12px'>
              <Text fontWeight='600'>Group</Text>
              <Popover
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                placement='bottom-start'
              >
                <PopoverTrigger>
                  <Button
                    variant='outline'
                    rightIcon={<ChevronDownIcon />}
                    minW='220px'
                  >
                    {selectedGroupLabel}
                  </Button>
                </PopoverTrigger>
                <PopoverContent w='320px'>
                  <PopoverBody>
                    <Box maxH='240px' overflowY='auto'>
                      <Button
                        variant={selectedGroupId ? 'ghost' : 'solid'}
                        colorScheme={selectedGroupId ? 'gray' : 'blue'}
                        width='100%'
                        justifyContent='flex-start'
                        onClick={() => handleSelectGroup(null)}
                      >
                        All groups
                      </Button>
                      {groups.map((group) => {
                        const isSelected =
                          selectedGroup?.documentId === group.documentId;
                        return (
                          <Button
                            key={group.documentId ?? `group-${group.id}`}
                            variant={isSelected ? 'solid' : 'ghost'}
                            colorScheme={isSelected ? 'blue' : 'gray'}
                            width='100%'
                            justifyContent='flex-start'
                            onClick={() => handleSelectGroup(group)}
                            mt='4px'
                          >
                            {group.name}
                          </Button>
                        );
                      })}
                      {isFetchingGroups && (
                        <Flex py='12px' justifyContent='center'>
                          <Spinner size='sm' />
                        </Flex>
                      )}
                      {!isFetchingGroups && groups.length === 0 && (
                        <Text
                          color='gray.500'
                          textAlign='center'
                          py='8px'
                          fontSize='sm'
                        >
                          No groups found
                        </Text>
                      )}
                    </Box>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
          </Flex>
          <Box bg='white' borderRadius='lg' p='24px'>
            <Tabs variant='unstyled'>
              <TabList justifyContent='center' gap='16px'>
                <Tab
                  px='24px'
                  py='16px'
                  borderRadius='0'
                  bg='white'
                  color='gray.600'
                  _selected={{
                    bg: '#F2F4F7',
                    color: 'gray.800',
                    fontWeight: 700,
                    borderBottom: '2px solid #6E56CF',
                  }}
                >
                  Risk Register Table
                </Tab>
                <Tab
                  px='24px'
                  py='16px'
                  borderRadius='0'
                  bg='white'
                  color='gray.600'
                  _selected={{
                    bg: '#F2F4F7',
                    color: 'gray.800',
                    fontWeight: 700,
                    borderBottom: '2px solid #6E56CF',
                  }}
                >
                  Risk Register Visualization
                </Tab>
                <Tab
                  px='24px'
                  py='16px'
                  borderRadius='0'
                  bg='white'
                  color='gray.600'
                  _selected={{
                    bg: '#F2F4F7',
                    color: 'gray.800',
                    fontWeight: 700,
                    borderBottom: '2px solid #6E56CF',
                  }}
                >
                  Kovrr Insights
                </Tab>
              </TabList>
              <TabPanels mt='24px'>
                <TabPanel padding='0'>
                  <Box>
                    <RiskRegisterTable groupId={selectedGroupId} />
                  </Box>
                </TabPanel>
                <TabPanel padding='0'>
                  <Box>
                    <RiskRegisterVisualization groupId={selectedGroupId} />
                  </Box>
                </TabPanel>
                <TabPanel padding='0'>
                  <Box>
                    <KovrrInsights groupId={selectedGroupId} />
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default RiskRegister;
