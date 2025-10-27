import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu';
import { cn } from '@/lib/utils';
import { EllipsisVertical } from 'lucide-react';
import type React from 'react';
import type { FC } from 'react';

export type DropMenuItem = {
  label: string;
  labelStyles?: string;
  action: () => void;
  disabled?: boolean;
};

type Props = {
  menuItems: DropMenuItem[];
  menuTrigger?: React.ReactNode;
};

export const DropMenu: FC<Props> = ({ menuItems, menuTrigger }) => {
  // Ensure menuItems is always an array
  const safeMenuItems = Array.isArray(menuItems) ? menuItems : [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus-visible:outline-none'>
        {menuTrigger || <EllipsisVertical className='h-[14px]' />}
      </DropdownMenuTrigger>
      <DropdownMenuContent data-testid='dropdown-menu-content'>
        {safeMenuItems.map((item, index) => (
          <DropdownMenuItem
            key={item.label}
            className={cn(
              'focus:bg-fill-base-4 focus:text-text-base-primary',
              item.labelStyles,
            )}
            onClick={item.action}
            disabled={item.disabled}
            data-testid={`dropdown-menu-item-${index}`}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
