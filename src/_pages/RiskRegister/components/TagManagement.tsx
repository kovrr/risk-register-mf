import { Button } from '@/components/atoms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card';
import {
  useCurrentRiskRegisterScenario,
  useCurrentRiskRegisterScenarioId,
  useUpdateRiskScenario,
} from '@/services/hooks';
import type { Tag } from '@/types/tag';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CreateTagModal } from './CreateTagModal';
import { TagList } from './TagDisplay';

export const TagManagement: React.FC = () => {
  const { data: scenario } = useCurrentRiskRegisterScenario();
  const scenarioId = useCurrentRiskRegisterScenarioId();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

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

  if (!scenario) {
    return null;
  }

  const tags: Tag[] = (scenario as any).tags || [];
  const currentTagIds = (scenario as any).tag_ids || [];

  const handleRemoveTag = async (tagId: string) => {
    const updatedTagIds = currentTagIds.filter((id: string) => id !== tagId);
    await updateScenario({
      tag_ids: updatedTagIds,
    } as any);
  };

  const handleTagCreated = async (newTagId: string) => {
    // Add the new tag to the scenario
    const updatedTagIds = [...currentTagIds, newTagId];
    await updateScenario({
      tag_ids: updatedTagIds,
    } as any);
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>Tags</CardTitle>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsCreateModalOpen(true)}
            disabled={isPending}
          >
            <Plus className='mr-2 h-4 w-4' />
            Add Tag
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <TagList
          tags={tags}
          onRemove={handleRemoveTag}
          showRemove={true}
        />
        {scenario.group_id && (
          <CreateTagModal
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            groupId={scenario.group_id}
            onTagCreated={handleTagCreated}
          />
        )}
      </CardContent>
    </Card>
  );
};
