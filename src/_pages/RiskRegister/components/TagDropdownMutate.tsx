import { Button } from '@/components/atoms/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/atoms/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/atoms/popover';
import { cn } from '@/lib/utils';
import {
  useCurrentRiskRegisterScenario,
  useCurrentRiskRegisterScenarioId,
  useTags,
  useUpdateRiskScenario,
} from '@/services/hooks';
import type { Tag } from '@/types/tag';
import { Check, ChevronDown, Loader2, Plus, X } from 'lucide-react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DemoExperienceContext } from '@/contexts/DemoExperienceContext';
import { useIsGuestUser } from 'permissions/use-permissions';
import { CreateTagModal } from './CreateTagModal';
import { useToast } from '@/hooks/use-toast';

const TagChip = ({ tag, onRemove }: { tag: Tag; onRemove: () => void }) => {
  return (
    <div
      className='group flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors'
      style={{ backgroundColor: tag.color }}
    >
      <span className='text-gray-900'>{tag.name}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className='opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100'
        aria-label={`Remove ${tag.name}`}
      >
        <X className='h-3 w-3 text-gray-900' />
      </button>
    </div>
  );
};

type Props = {
  disabled?: boolean;
};

export const TagDropdownMutate: React.FC<Props> = ({ disabled }) => {
  const { data: scenario } = useCurrentRiskRegisterScenario();
  const scenarioId = useCurrentRiskRegisterScenarioId();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalInitialValue, setCreateModalInitialValue] = useState('');
  const { toast } = useToast();
  const isGuestUser = useIsGuestUser();
  const { showDemoModal } = useContext(DemoExperienceContext);
  const { t } = useTranslation('riskRegister');

  if (!scenario) {
    return null;
  }

  const currentTagIds = (scenario as any).tag_ids || [];
  const currentTags: Tag[] = (scenario as any).tags || [];
  const groupId = scenario.group_id;

  // Get user's groups for fetching tags
  const groupIds = groupId ? [groupId] : [];

  const { data: tagsData, isLoading: isLoadingTags } = useTags(
    {
      group_ids: groupIds,
      limit: 200,
    },
    {
      enabled: groupIds.length > 0,
    },
  );

  const allTags = tagsData?.tags || [];

  const { mutateAsync: updateScenario, isPending } = useUpdateRiskScenario(
    scenarioId,
    {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Tags updated successfully',
        });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to update tags',
          variant: 'destructive',
        });
      },
    },
  );

  const handleTagToggle = useCallback(
    async (tagId: string) => {
      if (isGuestUser) {
        showDemoModal({ title: t('demo.editScenario') });
        return;
      }

      const isSelected = currentTagIds.includes(tagId);
      let updatedTagIds: string[];

      if (isSelected) {
        // Remove tag
        updatedTagIds = currentTagIds.filter((id: string) => id !== tagId);
      } else {
        // Add tag
        updatedTagIds = [...currentTagIds, tagId];
      }

      await updateScenario({
        tag_ids: updatedTagIds,
      } as any);
    },
    [currentTagIds, isGuestUser, showDemoModal, t, updateScenario],
  );

  const handleCreateTag = useCallback(
    (inputValue: string) => {
      setCreateModalInitialValue(inputValue);
      setIsCreateModalOpen(true);
    },
    [],
  );

  const handleTagCreated = useCallback(
    (newTagId: string) => {
      // Add the new tag to the scenario - optimistic update
      const updatedTagIds = [...currentTagIds, newTagId];
      updateScenario({
        tag_ids: updatedTagIds,
      } as any);
      setIsCreateModalOpen(false);
      setOpen(false);
    },
    [currentTagIds, updateScenario],
  );

  // Filter tags based on search term
  const filteredTags = allTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const hasSelectedTags = currentTags.length > 0;
  const isUpdating = isPending;

  if (isGuestUser) {
    return (
      <div
        className={cn(
          'flex items-center justify-around rounded-2xl px-1 py-1 text-xs font-bold text-text-base-invert focus-visible:outline-none cursor-pointer min-h-[30px]',
          hasSelectedTags
            ? 'h-auto'
            : 'h-[30px] text-text-base-secondary font-bold border-2 border-stroke-base-1',
        )}
        onClick={() => showDemoModal({ title: t('demo.editScenario') })}
      >
        {hasSelectedTags ? (
          <div className='flex flex-wrap gap-1.5'>
            {currentTags.map((tag) => (
              <div
                key={tag.id}
                className='rounded-md px-2.5 py-1 text-xs font-medium'
                style={{ backgroundColor: tag.color }}
              >
                <span className='text-gray-900'>{tag.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex items-center'>Assign Tags</div>
        )}
      </div>
    );
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={hasSelectedTags ? 'ghost' : 'outline'}
            role='combobox'
            aria-expanded={open}
            className={cn(
              'justify-between text-xs hover:bg-transparent hover:text-text-base-primary rounded-3xl min-h-[30px] h-auto',
              disabled && 'cursor-not-allowed opacity-50',
              !hasSelectedTags &&
                'text-text-base-secondary font-bold border-2 border-stroke-base-1',
            )}
            disabled={disabled || isUpdating}
          >
            <div className='flex flex-wrap items-center gap-1.5 flex-1'>
              {isUpdating ? (
                <Loader2 className='h-3 w-3 animate-spin' />
              ) : hasSelectedTags ? (
                currentTags.map((tag) => (
                  <TagChip
                    key={tag.id}
                    tag={tag}
                    onRemove={() => handleTagToggle(tag.id)}
                  />
                ))
              ) : (
                <span>Assign Tags</span>
              )}
            </div>
            <ChevronDown className='h-4 w-4 ml-2 shrink-0' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[320px] p-0' align='start'>
          <Command shouldFilter={false}>
            <div className='relative w-full border-b'>
              <CommandInput
                placeholder='Search tags...'
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              {isLoadingTags && (
                <div className='absolute right-2 top-1/2 flex -translate-y-1/2 transform items-center'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                </div>
              )}
            </div>
            <CommandList>
              {isLoadingTags && filteredTags.length === 0 && (
                <div className='p-4 text-center text-sm text-gray-500'>
                  Loading tags...
                </div>
              )}
              {!isLoadingTags && filteredTags.length === 0 && (
                <CommandEmpty>
                  {searchTerm
                    ? `No tags found matching "${searchTerm}"`
                    : 'No tags available'}
                </CommandEmpty>
              )}
              <CommandGroup>
                {filteredTags.map((tag) => {
                  const isSelected = currentTagIds.includes(tag.id);
                  return (
                    <CommandItem
                      key={tag.id}
                      value={tag.id}
                      onSelect={() => handleTagToggle(tag.id)}
                      className='!text-text-base-primary data-[selected=true]:bg-fill-base-4'
                    >
                      <div
                        className='mr-2 h-3 w-3 rounded border-2 flex items-center justify-center'
                        style={{
                          backgroundColor: isSelected ? tag.color : 'transparent',
                          borderColor: tag.color,
                        }}
                      >
                        {isSelected && (
                          <Check className='h-2 w-2 text-gray-900' />
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
                    </CommandItem>
                  );
                })}
                {searchTerm && (
                  <CommandItem
                    value='create-new'
                    onSelect={() => handleCreateTag(searchTerm)}
                    className='!text-text-base-primary data-[selected=true]:bg-fill-base-4'
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    {`Add "${searchTerm}" as a new tag`}
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <CreateTagModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onTagCreated={handleTagCreated}
        initialName={createModalInitialValue}
      />
    </>
  );
};
