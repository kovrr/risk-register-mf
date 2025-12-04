import { Button } from '@/components/atoms/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/atoms/popover';
import { useTags } from '@/services/hooks';
import type { Tag } from '@/types/tag';
import { Check, ChevronDown, X } from 'lucide-react';
import { useMemo, useState } from 'react';

export interface TagFilterDropdownProps {
  groupIds: string[];
  selectedTagIds: string[];
  onSelectionChange: (tagIds: string[]) => void;
  availableTagIds?: string[];
}

export const TagFilterDropdown: React.FC<TagFilterDropdownProps> = ({
  groupIds,
  selectedTagIds,
  onSelectionChange,
  availableTagIds = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useTags(
    {
      group_ids: groupIds,
      limit: 200,
    },
    {
      enabled: groupIds.length > 0,
    },
  );

  // Filter tags to only show those that appear in current scenarios
  // Also include any selected tags (in case they're filtered out but still selected)
  const tags = useMemo(() => {
    const allTags = data?.tags || [];
    if (availableTagIds.length === 0) {
      // If no available tag IDs provided, show all tags (fallback for initial load)
      return allTags;
    }
    // Only show tags that exist in at least one scenario OR are currently selected
    const availableTagIdSet = new Set(availableTagIds);
    const selectedTagIdSet = new Set(selectedTagIds);
    return allTags.filter(
      (tag) => availableTagIdSet.has(tag.id) || selectedTagIdSet.has(tag.id),
    );
  }, [data?.tags, availableTagIds, selectedTagIds]);

  const handleTagToggle = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      onSelectionChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onSelectionChange([...selectedTagIds, tagId]);
    }
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const selectedTags = useMemo(() => {
    return tags.filter((tag) => selectedTagIds.includes(tag.id));
  }, [tags, selectedTagIds]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='min-w-[220px] justify-between'
          disabled={isLoading}
        >
          <span className='truncate'>
            {selectedTagIds.length === 0
              ? 'Filter by Tags'
              : `${selectedTagIds.length} tag${selectedTagIds.length > 1 ? 's' : ''} selected`}
          </span>
          <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[320px] p-0' align='start'>
        <div className='flex flex-col'>
          <div className='flex items-center justify-between border-b px-4 py-3'>
            <h4 className='font-semibold'>Filter by Tags</h4>
            {selectedTagIds.length > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={handleClearAll}
                className='h-7 text-xs'
              >
                Clear all
              </Button>
            )}
          </div>
          <div className='max-h-[300px] overflow-y-auto p-2'>
            {isLoading ? (
              <div className='py-4 text-center text-sm text-gray-500'>
                Loading tags...
              </div>
            ) : tags.length === 0 ? (
              <div className='py-4 text-center text-sm text-gray-500'>
                No tags available
              </div>
            ) : (
              <div className='space-y-1'>
                {tags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => handleTagToggle(tag.id)}
                      className='flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100'
                    >
                      <div
                        className='h-4 w-4 rounded border-2 flex items-center justify-center'
                        style={{
                          backgroundColor: isSelected ? tag.color : 'transparent',
                          borderColor: tag.color,
                        }}
                      >
                        {isSelected && (
                          <Check className='h-3 w-3 text-gray-900' />
                        )}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='font-medium text-gray-900 truncate'>
                          {tag.name}
                        </div>
                        {tag.description && (
                          <div className='text-xs text-gray-500 truncate'>
                            {tag.description}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {selectedTags.length > 0 && (
            <div className='border-t p-3'>
              <div className='mb-2 text-xs font-medium text-gray-700'>
                Selected tags:
              </div>
              <div className='flex flex-wrap gap-2'>
                {selectedTags.map((tag) => (
                  <div
                    key={tag.id}
                    className='flex items-center gap-1 rounded-full px-2 py-1 text-xs'
                    style={{ backgroundColor: tag.color }}
                  >
                    <span className='font-medium text-gray-900'>{tag.name}</span>
                    <button
                      onClick={() => handleTagToggle(tag.id)}
                      className='ml-1 rounded-full hover:bg-gray-800/20'
                      aria-label={`Remove ${tag.name}`}
                    >
                      <X className='h-3 w-3 text-gray-900' />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
