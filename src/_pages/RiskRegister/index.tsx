import React from 'react';
import ScenarioTopBarNoSearch from '@/_pages/RiskRegister/components/ScenarioTopBarNoSearch';
import RiskRegisterTable from './RiskRegisterTable';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Flex } from '@chakra-ui/react';
import RiskRegisterVisualization from './visualization';
import KovrrInsights from './insights';

const LAYOUT_CONTAINER_PROPS = {
  maxW: '1440px',
  mx: 'auto',
  px: { base: '20px', md: '32px' },
  width: '100%',
};

const PANEL_CONTAINER_PROPS = {
  ...LAYOUT_CONTAINER_PROPS,
  py: { base: '24px', md: '32px' },
  minH: 'calc(100vh - 160px)',
};

const RiskRegister: React.FC = () => {
  return (
    <Box bg='#F7F8FA' minH='100vh'>
      <Box {...LAYOUT_CONTAINER_PROPS} py={{ base: '24px', md: '32px' }}>
        <Flex direction='column' gap='24px'>
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
            <TabPanels mt='24px'>
              <TabPanel padding='0'>
                <Box {...PANEL_CONTAINER_PROPS}>
                  <RiskRegisterTable />
                </Box>
              </TabPanel>
              <TabPanel padding='0'>
                <Box {...PANEL_CONTAINER_PROPS}>
                  <RiskRegisterVisualization />
                </Box>
              </TabPanel>
              <TabPanel padding='0'>
                <Box {...PANEL_CONTAINER_PROPS}>
                  <KovrrInsights />
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Box>
    </Box>
  );
};

export default RiskRegister;
