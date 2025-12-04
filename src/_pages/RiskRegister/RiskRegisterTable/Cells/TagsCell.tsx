import type { Tag } from '@/types/tag';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu';
import { useState } from 'react';

type Props = {
  tags: Tag[];
};

export const TagsCell: React.FC<Props> = ({ tags }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!tags || tags.length === 0) {
    return <span className='text-text-base-secondary'>-</span>;
  }

  const firstTag = tags[0];
  const remainingTags = tags.slice(1);

  return (
    <div className='flex items-center gap-1'>
      {/* First tag */}
      <div
        className='rounded-md px-2 py-0.5 text-xs font-medium text-gray-900'
        style={{ backgroundColor: firstTag.color }}
      >
        {firstTag.name}
      </div>

      {/* Dropdown for remaining tags */}
      {remainingTags.length > 0 && (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className='flex h-5 w-5 items-center justify-center rounded-md border border-gray-300 bg-white text-xs text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400'
              aria-label={`Show ${remainingTags.length} more tags`}
            >
              <span className='text-[10px] font-semibold'>+{remainingTags.length}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='max-w-[300px]'>
            <div className='max-h-[200px] overflow-y-auto p-1'>
              {remainingTags.map((tag) => (
                <div
                  key={tag.id}
                  className='mb-1 rounded-md px-2 py-1.5 text-xs'
                  style={{ backgroundColor: tag.color }}
                >
                  <div className='font-medium text-gray-900'>{tag.name}</div>
                  {tag.description && (
                    <div className='mt-0.5 text-[10px] text-gray-700'>
                      {tag.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
