import { Box, Divider, Flex } from '@chakra-ui/react';
import { SmallText, SmallTextBold } from 'components/texts/CommonTexts';
import React, { Fragment } from 'react';

type SimpleTableProps = {
  headers: string[];
  values: string[];
};

export const SimpleTable: React.FC<SimpleTableProps> = ({
  headers,
  values,
}) => {
  if (headers.length !== values.length) return null;

  return (
    <Box backgroundColor='brand.ghostWhite' width='min-content'>
      {headers.map((header, index) => (
        <Fragment key={index}>
          <Flex
            flexDirection='row'
            justifyContent='start'
            gap='20px'
            padding='10px'
            width='min-content'
          >
            <SmallTextBold width='170px'>{header}</SmallTextBold>
            <SmallText width='280px'>{values[index]}</SmallText>
          </Flex>
          {index !== headers.length - 1 && (
            <Divider border='1px solid brand.gray[8]' />
          )}
        </Fragment>
      ))}
    </Box>
  );
};
