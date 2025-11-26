import ScenarioTopBarNoSearch from '@/_pages/RiskRegister/components/ScenarioTopBarNoSearch';
import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import type React from 'react';
import KovrrInsights from './insights';
import RiskRegisterTable from './RiskRegisterTable';
import RiskRegisterVisualization from './visualization';

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
    <Box minH='100vh'>
      <Box {...LAYOUT_CONTAINER_PROPS} py={{ base: '24px', md: '32px' }}>
        <Flex direction='column' gap='24px'>
          <ScenarioTopBarNoSearch />
          <Tabs variant='unstyled'>
            <TabList w='100%'>
              <Tab
                flex='1'
                px='24px'
                py='16px'
                borderRadius='0'
                bg='#F2F4F7'
                color='gray.600'
                textAlign='center'
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
                flex='1'
                px='24px'
                py='16px'
                borderRadius='0'
                bg='#F2F4F7'
                color='gray.600'
                textAlign='center'
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
                flex='1'
                px='24px'
                py='16px'
                borderRadius='0'
                bg='#F2F4F7'
                color='gray.600'
                textAlign='center'
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
