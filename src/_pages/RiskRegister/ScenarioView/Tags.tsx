import { TagDropdownMutate } from '../components/TagDropdownMutate';
import { useCurrentRiskRegisterScenario } from '@/services/hooks';
import type { Tag } from '@/types/tag';
import { X } from 'lucide-react';
import { useCurrentRiskRegisterScenarioId, useUpdateRiskScenario } from '@/services/hooks';
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

const TagCard = ({ tag, onRemove }: { tag: Tag; onRemove: () => void }) => {
  return (
    <div
      className='group relative flex flex-col rounded-xl px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md'
      style={{ backgroundColor: tag.color }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className='absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800/80 text-white opacity-0 transition-opacity hover:bg-gray-900/90 group-hover:opacity-100'
        aria-label={`Remove tag ${tag.name}`}
      >
        <X className='h-3.5 w-3.5' />
      </button>
      <div className='pr-8'>
        <div className='mb-2 font-bold text-gray-900 text-lg'>{tag.name}</div>
        {tag.description && (
          <div className='text-sm text-gray-700 leading-relaxed'>{tag.description}</div>
        )}
      </div>
    </div>
  );
};

export const Tags: React.FC = () => {
  const { data: scenario } = useCurrentRiskRegisterScenario();
  const scenarioId = useCurrentRiskRegisterScenarioId();
  const { toast } = useToast();

  const { mutate: updateScenario, isPending } = useUpdateRiskScenario(scenarioId, {
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to remove tag',
        variant: 'destructive',
      });
    },
  });

  if (!scenario) {
    return null;
  }

  const tags: Tag[] = (scenario as any).tags || [];
  const currentTagIds = (scenario as any).tag_ids || [];

  const handleRemoveTag = useCallback(
    (tagId: string) => {
      const updatedTagIds = currentTagIds.filter((id: string) => id !== tagId);
      // Optimistic update - UI updates immediately
      updateScenario({
        tag_ids: updatedTagIds,
      } as any);
    },
    [currentTagIds, updateScenario],
  );

  return (
    <div className='flex flex-col gap-6'>
      {/* Tag Selection Dropdown */}
      <div className='flex items-center gap-4'>
        <label className='text-sm font-bold text-text-base-primary min-w-[140px]'>
          Tags
        </label>
        <div className='flex-1'>
          <TagDropdownMutate disabled={isPending} />
        </div>
      </div>

      {/* Tag Cards Display */}
      {tags.length > 0 ? (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {tags.map((tag) => (
            <TagCard key={tag.id} tag={tag} onRemove={() => handleRemoveTag(tag.id)} />
          ))}
        </div>
      ) : (
        <div className='flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-12'>
          <div className='text-center'>
            <p className='text-sm font-medium text-gray-500'>No tags assigned</p>
            <p className='mt-1 text-xs text-gray-400'>
              Use the dropdown above to add tags to this scenario
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
