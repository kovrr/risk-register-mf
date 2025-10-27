'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/atoms/tooltip';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import InfoIcon from '../../components/icons/info.svg';

interface InfoPopoverProps {
  content: string | ReactNode;
}

export default function InfoPopover({ content }: InfoPopoverProps) {
  const { t } = useTranslation('common', { keyPrefix: 'informationPopover' });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <img alt='' src={InfoIcon} className='h-3 w-3' />
            <span className='sr-only'>{t('content')}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className='w-80 p-3 text-sm' side='top' align='center'>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
