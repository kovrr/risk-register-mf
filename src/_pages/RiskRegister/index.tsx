import React from 'react';
import ScenarioTopBarNoSearch from '@/_pages/RiskRegister/components/ScenarioTopBarNoSearch';
import RiskRegisterTable from './RiskRegisterTable';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Flex } from '@chakra-ui/react';
import RiskRegisterVisualization from './visualization';
import KovrrInsights from './insights';

const RiskRegister: React.FC = () => {
  return (
    <Box bg='#F7F8FA' minH='100%'>
      <Flex direction='column' gap='16px'>
        <ScenarioTopBarNoSearch />
        <Tabs variant='unstyled'>
          <TabList justifyContent='center' gap='16px'>
            <Tab
              px='24px'
              py='16px'
              borderRadius='0'
              bg='#F2F4F7'
              color='gray.600'
              _selected={{
                bg: 'white',
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
              bg='#F2F4F7'
              color='gray.600'
              _selected={{
                bg: 'white',
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
              bg='#F2F4F7'
              color='gray.600'
              _selected={{
                bg: 'white',
                color: 'gray.800',
                fontWeight: 700,
                borderBottom: '2px solid #6E56CF',
              }}
            >
              Kovrr Insights
            </Tab>
          </TabList>
          <TabPanels mt='16px'>
            <TabPanel padding='0'>
              <RiskRegisterTable />
            </TabPanel>
            <TabPanel padding='0'>
              <RiskRegisterVisualization />
            </TabPanel>
            <TabPanel padding='0'>
              <KovrrInsights />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Box>
  );
};

export default RiskRegister;
