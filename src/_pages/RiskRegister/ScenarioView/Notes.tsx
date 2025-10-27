import { Avatar } from '@/components/atoms/avatar';
import { Button } from '@/components/atoms/button';
import { Card, CardTitle } from '@/components/atoms/card';
import { Textarea } from '@/components/atoms/textarea';
import PaperClip from '@/components/icons/PaperClip';
import { Spinner } from '@/components/ui/Spinner';
import { DemoExperienceContext } from '@/contexts/DemoExperienceContext';
import { useToast } from '@/hooks/use-toast';
import { useIsGuestUser } from '@/permissions/use-permissions';
import { QUERY_KEYS, useCreateNote, useNotes } from '@/services/hooks';
import { useAuthUser } from '@frontegg/react';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { getInitials } from '../utils/textManipulation';
import { NoteItem } from './NoteItem';

export const Notes: React.FC<{
  includeHeader?: boolean;
}> = ({ includeHeader }) => {
  const user = useAuthUser();
  const [noteText, setNoteText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { scenarioId } = useParams();
  const { t } = useTranslation('riskRegister');
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isGuestUser = useIsGuestUser();
  const { showDemoModal } = useContext(DemoExperienceContext);

  // Fetch notes using unified API
  const { data: notes = [], isLoading: isLoadingNotes } = useNotes(
    'scenario',
    scenarioId || '',
  );

  const { mutateAsync: createNote, isLoading } = useCreateNote({
    onError: (err: any) => {
      console.error('Error creating note:', err.response);
      const errorMsg = err.response?.data;

      if (Array.isArray(errorMsg?.detail) && errorMsg?.detail?.length > 0) {
        // Handle validation errors (422)
        errorMsg.detail.forEach((error: { msg: string }) => {
          error?.msg &&
            toast({
              variant: 'destructive',
              title: 'Error creating note',
              description: error.msg,
            });
        });
      } else {
        // Handle other errors
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to create note. Please try again later.',
        });
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries(QUERY_KEYS.RISK_REGISTER_SCENARIOS);
      // Clear form after successful save
      setNoteText('');
      setSelectedFile(null);
      toast({
        description: 'Note created successfully',
        duration: 3000,
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
    // Clear the input
    event.target.value = '';
  };

  const handleSave = async () => {
    if (isGuestUser) {
      showDemoModal({ title: t('demo.addNote') });
      return;
    }

    if (!noteText.trim() && !selectedFile) return;

    try {
      await createNote({
        parentType: 'scenario',
        parentId: scenarioId || '',
        content: noteText,
        user: user?.name || 'Unknown User',
        uploaded_file: selectedFile || undefined,
      });
    } catch (error) {
      // Error handling is done in the mutation options
    }
  };

  return (
    <Card className='max-h-[652px] overflow-y-auto'>
      {includeHeader && (
        <CardTitle className='mb-5 text-[17px] font-[700] text-slate-800'>
          {t('scenarioDrillDown.notes.title')}
        </CardTitle>
      )}

      <div className='mb-[30px] space-y-4'>
        <div className='flex gap-3'>
          <Avatar className='flex h-10 w-10 items-center justify-center rounded-full bg-fill-base-5 text-base font-[600] leading-[20px] text-white'>
            {getInitials(user?.name || '')}
          </Avatar>
          <div className='flex-1'>
            <div className='relative'>
              <Textarea
                placeholder={t('scenarioDrillDown.notes.notePlaceholder')}
                className='mb-4 min-h-[120px] resize-none border-gray-200'
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <input
                type='file'
                id='file-upload'
                className='hidden'
                onChange={handleFileSelect}
              />
              <Button
                variant='ghost'
                size='icon'
                className='absolute bottom-1 left-1 text-gray-400 transition-colors hover:bg-gray-100'
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <PaperClip width={13.6} height={15.96} />
              </Button>
            </div>
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                {selectedFile && (
                  <div className='text-sm text-gray-600'>
                    `${t('scenarioDrillDown.notes.selectedFile')} $
                    {selectedFile.name}`
                  </div>
                )}
              </div>
              <Button
                className='ml-auto h-[34px] w-[61px] bg-[#7C89FF] px-8 text-white hover:bg-[#6574ff]'
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      className='-ml-1 mr-3 text-white'
                      data-testid='note-spinner'
                    />
                    {t('scenarioDrillDown.notes.saving')}
                  </>
                ) : (
                  t('scenarioDrillDown.notes.save')
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Notes */}
      <div className='space-y-6'>
        {isLoadingNotes ? (
          <div className='flex justify-center py-8'>
            <Spinner className='text-gray-400' />
          </div>
        ) : notes.length > 0 ? (
          notes.map((note) => (
            <NoteItem
              key={note.id}
              noteId={note.id}
              avatar={note.user}
              email={note.user}
              date={note.created_at}
              content={note.content}
              attachment={{
                id: '',
                name: '',
              }}
            />
          ))
        ) : (
          <div className='py-8 text-center text-sm text-gray-500'>
            No notes yet. Add the first note above.
          </div>
        )}
      </div>
    </Card>
  );
};
