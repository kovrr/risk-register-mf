import { Button } from '@/components/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { Textarea } from '@/components/atoms/textarea';
import { useCreateTag } from '@/services/hooks';
import { generateRandomBrightColor } from '@/utils/tagColors';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CreateTagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTagCreated: (tagId: string) => void;
  initialName?: string;
}

export const CreateTagModal: React.FC<CreateTagModalProps> = ({
  open,
  onOpenChange,
  onTagCreated,
  initialName = '',
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  // Get active group ID from localStorage
  const getActiveGroupId = (): string | null => {
    try {
      return localStorage.getItem('active_group_id');
    } catch {
      return null;
    }
  };

  // Update name when initialName changes (when modal opens with a value)
  useEffect(() => {
    if (open && initialName) {
      setName(initialName);
    }
  }, [open, initialName]);

  const { mutateAsync: createTag, isPending } = useCreateTag({
    onSuccess: (tag) => {
      toast({
        title: 'Success',
        description: 'Tag created successfully',
      });
      onTagCreated(tag.id);
      handleClose();
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.detail || 'Failed to create tag';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const handleClose = () => {
    setName('');
    setDescription('');
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Tag name is required',
        variant: 'destructive',
      });
      return;
    }

    const activeGroupId = getActiveGroupId();
    if (!activeGroupId) {
      toast({
        title: 'Error',
        description: 'No active group selected. Please select a group first.',
        variant: 'destructive',
      });
      return;
    }

    const color = generateRandomBrightColor();
    const payload: {
      name: string;
      group_id: string;
      color: string;
      description?: string;
    } = {
      name: name.trim(),
      group_id: activeGroupId,
      color,
    };

    // Only add optional fields if they have values
    if (description.trim()) {
      payload.description = description.trim();
    }

    await createTag(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Create New Tag</DialogTitle>
          <DialogDescription>
            Create a new tag to categorize scenarios. The tag color will be
            automatically generated.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>
                Name <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='e.g., High Priority'
                maxLength={100}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Optional description for this tag'
                maxLength={500}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Tag'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
