import PopoverComponent from '@/components/molecules/info-popover';
import { Box, HStack, Text } from '@chakra-ui/react';
import type { Column } from '@tanstack/react-table';
import AssendingUpDownIcon from 'components/icons/arrow_ascending.svg';
import DescendingUpDownIcon from 'components/icons/arrow_descending.svg';
import ArrowUpDownIcon from 'components/icons/arrow_up_down_default.svg';
import type React from 'react';

interface Props {
  title: string;
  info?: string;
  disableSorting?: boolean;
  columnData?: Column<any, any>;
  spacing?: string;
}

const TableHeader: React.FC<Props> = ({
  title,
  info,
  disableSorting,
  columnData,
  spacing = '7px',
}) => {
  const sortIconVal = columnData
    ? columnData.getIsSorted() === 'asc'
      ? 'asc'
      : columnData.getIsSorted() === 'desc'
        ? 'desc'
        : undefined
    : undefined;
  const sortIcon = sortIconVal
    ? sortIconVal === 'asc'
      ? AssendingUpDownIcon
      : sortIconVal === 'desc'
        ? DescendingUpDownIcon
        : ArrowUpDownIcon
    : ArrowUpDownIcon;

  return (
    <HStack spacing={spacing}>
      <Box>
        <Text userSelect='none' letterSpacing='normal' whiteSpace='nowrap'>
          {title}
        </Text>
      </Box>
      {info && (
        <Box>
          <PopoverComponent content={info} />
        </Box>
      )}
      {!disableSorting && (
        <Box>
          <img alt='' src={sortIcon} />
        </Box>
      )}
    </HStack>
  );
};

export default TableHeader;
