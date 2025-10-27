import { Divider, Flex, FlexProps, Link, Text } from '@chakra-ui/react';
import Card from 'components/containers/cards/Card';
import React, { FC } from 'react';

interface Props {
  title?: string;
  description: string;
  moreInfo?: string;
  moreInfoLink?: string;
  children?: React.ReactNode;
  hideTitleDivider?: boolean;
  minTitleHeight?: string;
  panel?: React.ReactNode;
}

export const CardWithDescription: FC<Props & FlexProps> = ({
  title,
  description,
  moreInfo,
  moreInfoLink,
  children,
  hideTitleDivider,
  minTitleHeight,
  panel,
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
      <Flex direction='column' gap='16px' height='100%'>
        <Flex direction='column' gap='19px' minHeight={minTitleHeight}>
          {title && (
            <Text fontSize='17px' fontWeight='700'>
              {title}
            </Text>
          )}
          <Text variant='cardDesc3' flexGrow={1}>
            {description}
            {moreInfo && (
              <>
                <br />
                <Link fontWeight='400' href={moreInfoLink} target='_blank'>
                  {moreInfo}
                </Link>
              </>
            )}
          </Text>
        </Flex>
        {!hideTitleDivider && <Divider />}
        {panel}
      </Flex>
    </Card>
  );
};
