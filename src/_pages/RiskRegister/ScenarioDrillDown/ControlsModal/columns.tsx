'use client';

import { Checkbox } from '@/components/atoms/checkbox';
import type { ColumnDef } from '@tanstack/react-table';

export type Control = {
  name: string;
  relevant: boolean;
  implemented: number;
};

export const columns: ColumnDef<Control>[] = [
  {
    id: 'name',
    header: 'Control',
    cell: ({ row, table }) => {
      const control = row.original;
      const meta = table.options.meta as {
        codeToText: (code: string) => any;
      };
      const controlText = meta.codeToText(control.name);
      return (
        <div className='flex max-w-[300px] flex-col'>
          <div className='text-[12px] font-[700]'>{controlText.title}</div>
          <div className='text-[14px] font-[400]'>
            {controlText.secondaryTitle}
          </div>
        </div>
      );
    },
  },
  {
    id: 'relevant',
    header: 'Relevant',
    cell: ({ row, table }) => (
      <div className='text-center'>
        <Checkbox
          checked={row.original.relevant}
          onCheckedChange={(value) => {
            const meta = table.options.meta as {
              onRelevantChange: (id: string, value: boolean) => void;
              onImplementedChange: (id: string, value: number) => void;
              isImplemented: (implementedLevel: number) => boolean;
            };
            const control = row.original;
            if (!value) {
              // If the control is not relevant, then it is not implemented
              meta.onRelevantChange(control.name, !!value);
              if (meta.isImplemented(control.implemented)) {
                meta.onImplementedChange(control.name, control.implemented);
              }
            } else {
              meta.onRelevantChange(control.name, !!value);
            }
          }}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'implemented',
    header: () => <div className='text-right'>Implemented</div>,
    cell: ({ row, table }) => {
      const control = row.original;
      const meta = table.options.meta as {
        isImplemented: (implementedLevel: number) => boolean;
      };
      const isImplemented = meta.isImplemented;

      return (
        <div className='text-center'>
          <Checkbox
            checked={isImplemented(control.implemented)}
            disabled={!control.relevant}
            onCheckedChange={(value) => {
              const meta = table.options.meta as {
                onImplementedChange: (id: string, value: number) => void;
              };
              meta.onImplementedChange(row.original.name, control.implemented);
            }}
            aria-label='Mark as implemented'
          />
        </div>
      );
    },
  },
];
