import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/atoms/tooltip';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import type React from 'react';
import type { FC } from 'react';

type Props = {
  triggerText?: string;
  content: string | string[];
  triggerIcon?: React.ReactNode;
  triggerIconClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
};
export const BasicTooltip: FC<Props> = ({
  triggerText,
  triggerIcon,
  triggerIconClassName,
  content,
  triggerClassName,
  contentClassName,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('flex items-center gap-1', triggerClassName)}>
            <span>{triggerText}</span>
            {triggerIcon || (
              <Info className={cn('h-3 w-3', triggerIconClassName)} />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          className={cn('p-3 text-sm', contentClassName)}
          side='top'
          align='center'
        >
          {Array.isArray(content) ? (
            <div className='flex flex-col'>
              {content.map((item, index) => (
                <span key={index}>{item}</span>
              ))}
            </div>
          ) : (
            content
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
