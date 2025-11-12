import { Tab, TabList, TabListProps, TabProps } from '@chakra-ui/react';
import { FC } from 'react';

const selectedTabStyles = {
  bg: 'brand.white',
  borderRadius: '6px',
  color: 'brand.black',
  margin: '3px',
};

export const ToggleTabList: FC<TabListProps> = ({ children, ...restProps }) => {
  return (
    <TabList
      backgroundColor='brand.ghostWhite'
      borderRadius='6px'
      height='30px'
      fontFamily='fonts.heading'
      {...restProps}
    >
      {children}
    </TabList>
  );
};

export const ToggleTab: FC<TabProps> = ({ children, ...restProps }) => {
  return (
    <Tab
      fontSize='12px'
      margin='3px'
      _selected={{
        ...selectedTabStyles,
      }}
      {...restProps}
    >
      {children}
    </Tab>
  );
};
