import {
  Box,
  Table,
  type TableCellProps,
  type TableColumnHeaderProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  flexRender,
  type PaginationState,
  type Table as ReactTable,
  type RowSelectionState,
} from '@tanstack/react-table';
import Pagination from '@/components/wrappers/Pagination';
import type { FC } from 'react';

const styles = {
  th: {
    textTransform: 'capitalize',
    fontSize: '14px',
    fontWeight: 'bold',
    paddingInlineStart: '3px',
    paddingInlineEnd: '3px',
  } as TableColumnHeaderProps,
  td: {
    fontSize: 'sm',
    alignItems: 'center',
    paddingInlineStart: '3px',
    paddingInlineEnd: '3px',
  } as TableCellProps,
  badge: {
    fontSize: '14px',
    padding: '5px 10px 5px 10px',
    borderRadius: '14px',
    ml: '5px',
  },
};

interface Props {
  table: ReactTable<any>;
  selectedRows: RowSelectionState;
  containedComponent?: boolean;
  maxHeight?: string;
  disableSorting?: boolean;
  paginationState?: PaginationState;
  setPaginationState?: (state: PaginationState) => void;
}

const MitigationTable: FC<Props> = ({
  selectedRows: _selectedRows,
  table,
  containedComponent,
  maxHeight: _maxHeight,
  disableSorting,
  paginationState,
  setPaginationState,
}) => {
  return (
    <Box>
      <Table
        variant='simple'
        maxW='100%'
        size='sm'
        data-testid='cis-mitigation-table'
      >
        <Thead
          top='0'
          zIndex={100}
          height='50px'
          backgroundColor={!containedComponent ? 'brand.ghostWhite' : ''}
        >
          <Tr>
            {table.getFlatHeaders().map((header, index) => {
              const meta: any = header.column.columnDef.meta;
              const sortingHandler = !disableSorting
                ? header.column.getToggleSortingHandler()
                : () => { };
              const isFirstRow = index === 0;
              const isLastRow = index === table.getFlatHeaders().length - 1;
              return (
                <Th
                  pl={isFirstRow ? '18px' : ' 0px'}
                  borderTopLeftRadius={isFirstRow ? '15px' : '0px'}
                  pr={isLastRow ? '18px' : '0px'}
                  borderTopRightRadius={isLastRow ? '15px' : '0px'}
                  key={header.id}
                  onClick={sortingHandler}
                  isNumeric={meta?.isNumeric}
                  {...styles.th}
                  _active={{
                    backgroundColor: disableSorting ? '' : 'brand.gray.1',
                  }}
                  minWidth={`${header.column.columnDef.minSize}px`}
                  data-testid='what-if-table-header'
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          <Tr height='2px' />
          {table.getRowModel().rows.map((row) => (
            <Tr
              key={row.id}
              backgroundColor={
                row.getIsSelected()
                  ? 'brand.misc.5'
                  : row.depth !== 0
                    ? 'brand.misc.16'
                    : ''
              }
              _hover={{
                backgroundColor: 'brand.misc.5',
              }}
            >
              {row.getVisibleCells().map((cell, index) => {
                const isFirstColumn = index === 0;
                const isLastColumn =
                  index === table.getFlatHeaders().length - 1;
                return (
                  <Td
                    key={cell.id}
                    pl={isFirstColumn ? '18px' : ' 0px'}
                    pr={isLastColumn ? '18px' : '0px'}
                    {...styles.td}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
      {paginationState && setPaginationState && (
        <Pagination
          paginationState={paginationState}
          setPaginationState={setPaginationState}
          totalCount={table.getFilteredRowModel().rows.length}
          currentPageItemCount={table.getRowModel().rows.length}
          entriesLabel='entries'
          height='63px'
        />
      )}
    </Box>
  );
};

export default MitigationTable;
