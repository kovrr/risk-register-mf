import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TableProps,
  TableRowProps,
  TableColumnHeaderProps,
} from '@chakra-ui/react';
import { flexRender, Table as ReactTable } from '@tanstack/react-table';
import React from 'react';

type Props<T> = {
  table: ReactTable<T>;
  tableProps?: TableProps;
  headerRowProps?: TableRowProps;
  headerCellProps?: TableColumnHeaderProps;
  rowProps?: TableRowProps;
  cellProps?: TableColumnHeaderProps;
};

export const SimpleReactTable = <T,>({
  table,
  tableProps,
  headerCellProps,
  headerRowProps,
  cellProps,
  rowProps,
}: Props<T>) => {
  return (
    <Table {...tableProps}>
      <Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Tr
            key={headerGroup.id}
            backgroundColor='fill.base.4'
            height='56px'
            {...headerRowProps}
          >
            {headerGroup.headers.map((header) => (
              <Th
                key={header.id}
                textTransform='none'
                padding='12px 10px 12px 10px'
                color='text.base.primary'
                {...headerCellProps}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </Th>
            ))}
          </Tr>
        ))}
      </Thead>
      <Tbody>
        {table.getRowModel().rows.map((row, index) => (
          <Tr
            key={row.id}
            backgroundColor='fill.base.1'
            borderBottom={
              index === table.getRowModel().rows.length - 1
                ? 'none'
                : '2px solid'
            }
            borderColor='fill.specific.divider'
            {...rowProps}
          >
            {row.getVisibleCells().map((cell) => (
              <Td key={cell.id} padding='12px 10px' {...cellProps}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
