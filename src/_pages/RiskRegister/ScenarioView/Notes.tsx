import { Avatar } from '@/components/atoms/avatar';
import { Button } from '@/components/atoms/button';
import { Skeleton } from '@/components/atoms/skeleton';
import { Textarea } from '@/components/atoms/textarea';
import PaperClip from '@/components/icons/PaperClip';
import { Spinner } from '@/components/ui/Spinner';
import { DemoExperienceContext } from '@/contexts/DemoExperienceContext';
import { useToast } from '@/hooks/use-toast';
import { useIsGuestUser } from '@/permissions/use-permissions';
import {
  useCreateNote,
  useCreateNoteWithAttachment,
  useCurrentRiskRegisterScenario,
  useNotes,
} from '@/services/hooks';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getInitials } from '../utils/textManipulation';
import { NoteItem } from './NoteItem';

export const Notes: React.FC<{ includeHeader?: boolean }> = ({ includeHeader }) => {
  // Mock user for microfrontend since Frontegg context is not available
  const user = {
    id: 'mock-user-id',
    email: 'mock@example.com',
    name: 'Mock User',
    firstName: 'Mock',
    lastName: 'User',
  };

  const [noteText, setNoteText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: scenario, isLoading: isLoadingScenario } =
    useCurrentRiskRegisterScenario();

  // Always define scenarioId to maintain hook order
  const scenarioId = scenario?.scenario_id ?? '';

  const { t } = useTranslation('riskRegister');
  const { toast } = useToast();
  const isGuestUser = useIsGuestUser();
  const { showDemoModal } = useContext(DemoExperienceContext);

  // ❗ CALL HOOKS UNCONDITIONALLY
  const {
    data: notes = [],
    isPending: isLoadingNotes,
  } = useNotes(scenarioId);

  const handleMutationError = (err: any) => {
    console.error('Error creating note:', err.response);
    const errorMsg = err.response?.data;

    if (Array.isArray(errorMsg?.detail) && errorMsg?.detail?.length > 0) {
      errorMsg.detail.forEach((error: { msg: string }) => {
        error?.msg &&
          toast({
            variant: 'destructive',
            title: 'Error creating note',
            description: error.msg,
          });
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create note. Please try again later.',
      });
    }
  };

  const handleMutationSuccess = () => {
    setNoteText('');
    setSelectedFile(null);
    toast({
      description: 'Note created successfully',
      duration: 3000,
    });
  };

  const {
    mutateAsync: createNote,
    isPending: isSavingNote,
  } = useCreateNote({
    onError: handleMutationError,
    onSuccess: () => handleMutationSuccess(),
  });

  const {
    mutateAsync: createNoteWithAttachment,
    isPending: isUploadingAttachment,
  } = useCreateNoteWithAttachment({
    onError: handleMutationError,
    onSuccess: () => handleMutationSuccess(),
  });

  const isSaving = isSavingNote || isUploadingAttachment;

  // ❗ Only NOW we can early-return the skeleton safely
  if (isLoadingScenario || !scenario?.scenario_id) {
    return (
      <div className="space-y-6">
        {includeHeader && (
          <h2 className="text-lg font-bold text-text-base-primary">
            {t('scenarioDrillDown.notes.title')}
          </h2>
        )}
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
    event.target.value = ''; // Reset input
  };

  const handleSave = async () => {
    if (isGuestUser) {
      showDemoModal({ title: t('demo.addNote') });
      return;
    }

    if (!noteText.trim() && !selectedFile) return;

    if (!scenarioId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Scenario not loaded. Please try again.',
      });
      return;
    }

    try {
      if (selectedFile) {
        await createNoteWithAttachment({
          scenarioId,
          file: selectedFile,
          content: noteText,
        });
      } else {
        await createNote({
          scenarioId,
          content: noteText,
        });
      }
    } catch {
      // Error handling already done inside the mutation
    }
  };

  return (
    <div className="space-y-6">
      {includeHeader && (
        <h2 className="text-lg font-bold text-text-base-primary">
          {t('scenarioDrillDown.notes.title')}
        </h2>
      )}

      {/* Add Note Section */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <Avatar className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fill-base-5 text-base font-[600] leading-[20px] text-white">
            {getInitials(user?.name || '')}
          </Avatar>

          <div className="flex-1 space-y-3">
            <div className="relative">
              <Textarea
                placeholder={t('scenarioDrillDown.notes.notePlaceholder')}
                className="min-h-[120px] resize-none border-gray-200 pr-10"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />

              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileSelect}
              />

              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-2 right-2 h-8 w-8 text-gray-400 transition-colors hover:bg-gray-100"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <PaperClip width={13.6} height={15.96} />
              </Button>
            </div>

            {selectedFile && (
              <div className="text-sm text-gray-600">
                {t('scenarioDrillDown.notes.selectedFile')} {selectedFile.name}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                className="h-9 bg-[#7C89FF] px-6 text-white hover:bg-[#6574ff]"
                onClick={handleSave}
                disabled={isSaving || (!noteText.trim() && !selectedFile)}
              >
                {isSaving ? (
                  <>
                    <Spinner className="-ml-1 mr-2 h-4 w-4 text-white" data-testid="note-spinner" />
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

      {/* Notes List */}
      <div className="space-y-6">
        {isLoadingNotes ? (
          <div className="flex justify-center py-8">
            <Spinner className="text-gray-400" />
          </div>
        ) : notes.length > 0 ? (
          notes.map((note) => {
            const attachment =
              note.documents && note.documents.length > 0
                ? {
                    id: note.documents[0].id,
                    name: note.documents[0].filename || note.documents[0].id,
                  }
                : undefined;

            return (
              <NoteItem
                key={note.id}
                noteId={note.id}
                avatar={note.user}
                email={note.user}
                date={note.created_at}
                content={note.content}
                attachment={attachment}
              />
            );
          })
        ) : (
          <div className="py-12 text-center text-sm italic text-gray-500">
            {t('scenarioDrillDown.notes.noNotesYet')}
          </div>
        )}
      </div>
    </div>
  );
};
