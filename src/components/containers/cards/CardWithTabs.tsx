import { TransWithComponent } from '@/components/texts/TransWithComponent';
import {
  Divider,
  Flex,
  type FlexProps,
  Link,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import Card from 'components/containers/cards/Card';
import type React from 'react';
import type { FC } from 'react';
import {
  ToggleTab,
  ToggleTabList,
} from '../../../_pages/ResultsNarrative/tabs';

interface Props {
  title: string | React.ReactNode;
  description: string;
  tabList: string[];
  tabPanels: React.ReactNode[];
  hideTitleDivider?: boolean;
  defaultIndex?: number;
  minTitleHeight?: string;
}

export const CardWithTabs: FC<Props & Omit<FlexProps, 'title'>> = ({
  title,
  description,
  tabList,
  tabPanels,
  hideTitleDivider,
  defaultIndex,
  minTitleHeight,
  ...restProps
}) => {
  return (
    <Card
      height='503px'
      minWidth='400px'
      maxWidth='495px'
      flexBasis='0'
      width='50%'
      flex='1'
      padding='20px'
      {...restProps}
    >
      <Tabs variant='unstyled' height='100%' defaultIndex={defaultIndex || 0}>
        <Flex direction='column' gap='10px' height='100%'>
          <Flex direction='column' gap='16px' height='100%'>
            <Flex direction='column' gap='19px' minHeight={minTitleHeight}>
              <Flex justifyContent='space-between'>
                <Text fontSize='17px' fontWeight='700'>
                  {title}
                </Text>
                <ToggleTabList>
                  {tabList.map((tab, index) => (
                    <ToggleTab key={index}>{tab}</ToggleTab>
                  ))}
                </ToggleTabList>
              </Flex>
              <Text variant='cardDesc3' flexGrow={1}>
                <TransWithComponent
                  components={{
                    SpanTag: <Link fontWeight='400' />,
                    ATag: <a />,
                  }}
                >
                  {description}
                </TransWithComponent>
              </Text>
            </Flex>
            {!hideTitleDivider && <Divider />}
            <TabPanels width='100%' height='100%'>
              {tabPanels.map((panel, index) => (
                <TabPanel padding='0' height='100%' key={index}>
                  {panel}
                </TabPanel>
              ))}
            </TabPanels>
          </Flex>
        </Flex>
      </Tabs>
    </Card>
  );
};
