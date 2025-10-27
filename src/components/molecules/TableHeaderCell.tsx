import React, { FC } from 'react';
import { cn } from '@/lib/utils';
import { ChevronsUpDown } from 'lucide-react';
import { BasicTooltip } from './BasicTooltip';

type Props = {
  title: React.ReactNode;
  containerClassName?: string;
  info?: string;
};
export const TableHeaderCell: FC<Props> = ({
  title,
  containerClassName,
  info,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-start gap-1 font-bold text-text-base-primary',
        containerClassName,
      )}
    >
      <span className="whitespace-pre-line">{title}</span>
      <ChevronsUpDown className='h-3 w-3' />
      {info && <BasicTooltip content={info} />}
    </div>
  );
};
