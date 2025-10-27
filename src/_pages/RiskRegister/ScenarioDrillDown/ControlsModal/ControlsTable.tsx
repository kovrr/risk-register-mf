import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/table';
import type { Control as ControlType } from './columns';

interface DataTableProps<TValue> {
  columns: ColumnDef<ControlType, TValue>[];
  data: ControlType[];
  onImplementedChange: (id: string, value: number) => void;
  onRelevantChange: (id: string, value: boolean) => void;
  codeToText: (code: string) => any;
  isImplemented: (implementedLevel: number) => boolean;
}

export function ControlsTable<TValue>({
  columns,
  data,
  onImplementedChange,
  onRelevantChange,
  codeToText,
  isImplemented,
}: DataTableProps<TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    meta: {
      onImplementedChange,
      onRelevantChange,
      codeToText,
      isImplemented,
    },
  });

  return (
    <div className='bg-white'>
      <div className='max-h-[50vh] overflow-auto'>
        <Table className='[&_tr:last-child]:border-0'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='border-0'>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className='h-[25px] border-0 bg-white text-[14px] font-[700] text-text-base-secondary'
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='border-0 border-b'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='border-0'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className='border-0'>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 border-0 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
