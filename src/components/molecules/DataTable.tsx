import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/table';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';
import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';
import { Pagination, type PaginationProps } from './Pagination';

type Props<TData> = {
  table: TanstackTable<TData>;
  pagination: PaginationProps;
  isLoading?: boolean;
  isFetching?: boolean;
};

export const DataTable = <TData,>({
  table,
  pagination,
  isLoading,
  isFetching,
}: Props<TData>) => {
  const {
    pageCount,
    pageSize,
    pageIndex,
    setPageIndex,
    setPageSize,
    totalCount,
    currentPageSize,
  } = pagination;

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className={cn(
                    header.column.getCanSort()
                      ? 'cursor-pointer select-none'
                      : '',
                    header.column.getCanSort() && 'active:bg-gray-100',
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading || isFetching ? (
          <TableRow>
            <TableCell
              colSpan={table.getAllColumns().length}
              className='h-24 text-center'
            >
              <Spinner className='mx-auto' />
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={table.getAllColumns().length}
              className='h-24 text-center'
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell
            colSpan={table.getAllColumns().length}
            className='rounded-b-2xl'
          >
            <Pagination
              pageCount={pageCount}
              pageIndex={pageIndex}
              pageSize={pageSize}
              totalCount={totalCount}
              setPageIndex={setPageIndex}
              setPageSize={setPageSize}
              currentPageSize={currentPageSize}
            />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
