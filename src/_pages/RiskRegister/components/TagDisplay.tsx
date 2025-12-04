import type { Tag } from '@/types/tag';
import { X } from 'lucide-react';
import React from 'react';

interface TagDisplayProps {
  tag: Tag;
  onRemove?: (tagId: string) => void;
  showRemove?: boolean;
}

export const TagDisplay: React.FC<TagDisplayProps> = ({
  tag,
  onRemove,
  showRemove = false,
}) => {
  return (
    <div
      className='group relative flex flex-col rounded-lg px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md'
      style={{ backgroundColor: tag.color }}
    >
      {showRemove && onRemove && (
        <button
          onClick={() => onRemove(tag.id)}
          className='absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-white opacity-0 transition-opacity hover:bg-gray-900 group-hover:opacity-100'
          aria-label={`Remove tag ${tag.name}`}
        >
          <X className='h-3 w-3' />
        </button>
      )}
      <div className='font-bold text-gray-900'>{tag.name}</div>
      {tag.description && (
        <div className='mt-1 text-sm text-gray-700'>{tag.description}</div>
      )}
    </div>
  );
};

interface TagListProps {
  tags: Tag[];
  onRemove?: (tagId: string) => void;
  showRemove?: boolean;
  className?: string;
}

export const TagList: React.FC<TagListProps> = ({
  tags,
  onRemove,
  showRemove = false,
  className = '',
}) => {
  if (tags.length === 0) {
    return (
      <div className='text-sm text-gray-500'>
        No tags assigned to this scenario
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {tags.map((tag) => (
        <TagDisplay
          key={tag.id}
          tag={tag}
          onRemove={onRemove}
          showRemove={showRemove}
        />
      ))}
    </div>
  );
};
