import { Avatar } from '@/components/atoms/avatar';
import PaperClip from '@/components/icons/PaperClip';
import { useToast } from '@/hooks/use-toast';
import { useCurrentRiskRegisterScenario, useDownloadAttachment } from '@/services/hooks';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getInitials } from '../utils/textManipulation';

interface NoteItemProps {
  noteId: string;
  avatar: string;
  email: string;
  date: string;
  content: string;
  attachment?: {
    id: string;
    name: string;
  };
}

export const NoteItem: React.FC<NoteItemProps> = ({
  noteId,
  email,
  date,
  content,
  attachment,
  avatar,
}) => {
  const { toast } = useToast();
  const { data: scenario } = useCurrentRiskRegisterScenario();
  const scenarioId = scenario?.scenario_id;

  const { mutateAsync: downloadScenarioAttachment } = useDownloadAttachment({
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to download file. Please try again later.',
      });
    },
  });
  const { t } = useTranslation('riskRegister');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const hasOverflow =
          contentRef.current.scrollHeight > contentRef.current.clientHeight;
        setIsOverflowing(hasOverflow);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [content]);

  const handleDownloadFile = async () => {
    if (!attachment?.id) return;

    if (!scenarioId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Scenario not loaded. Cannot download attachment.',
      });
      return;
    }

    try {
      const blob = await downloadScenarioAttachment({
        attachmentId: attachment.id,
        scenarioId,
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.name || 'attachment';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to download attachment. Please try again.',
      });
    }
  };

  return (
    <div className='flex gap-3'>
      <Avatar className='flex h-10 w-10 items-center justify-center rounded-full bg-fill-base-5 text-base font-[600] leading-[20px] text-white'>
        {getInitials(avatar || '')}
      </Avatar>
      <div className='flex-1 space-y-2'>
        <div className='flex items-center gap-2 font-[700] text-[#A9B4BC]'>
          <span className='text-sm'>{email}</span>
          <span className='text-sm'>|</span>
          <span className='text-sm'>
            {new Date(date)
              .toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
              .replace(/\//g, '-')}
          </span>
        </div>
        <div>
          <div
            id={`content-${noteId}`}
            ref={contentRef}
            className={`whitespace-pre-wrap ${isExpanded ? '' : 'line-clamp-3'} max-w-[430px]`}
          >
            {content}
          </div>
          {isOverflowing && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='text-[14px] font-[600] text-text-brand-primary underline'
            >
              {isExpanded
                ? t('scenarioDrillDown.notes.notItem.collapse')
                : t('scenarioDrillDown.notes.notItem.expand')}
            </button>
          )}
        </div>
        {attachment && attachment.id && (
          <div
            onClick={() => handleDownloadFile()}
            className='flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-fill-base-1 px-3 py-1 text-gray-600 transition-colors hover:bg-[#E8EBFF]'
          >
            <PaperClip width={11} height={13} />
            <span className='text-sm'>{attachment.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};
