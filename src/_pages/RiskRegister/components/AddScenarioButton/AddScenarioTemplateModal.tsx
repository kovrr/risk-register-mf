import { Button } from '@/components/atoms/button';
import { Dialog, DialogContent } from '@/components/atoms/dialog';
import { DemoExperienceContext } from '@/contexts/DemoExperienceContext';
import { useToast } from '@/hooks/use-toast';
import { useIsGuestUser } from '@/permissions/use-permissions';
import { useRequestPredefinedScenario } from '@/services/hooks';
import { Loader2 } from 'lucide-react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import CheckCircleVIcon from '../icons/CheckCircle-VIcon';
import XModalcloseIcon from '../icons/XModalcloseIcon';

const URL =
  'https://www.kovrr.com/cybersecurity-grc/risk-register-template-request-form?utm_medium=email&_hsenc=p2ANqtz-_h57dEmDEdaUunTdtYPqqDXy5aSsqBhemPxyOozaO2FJx-W5r5ZtR30MdsAQB9LKIEu7w7ZoI6Qk8NWNWZwXWzdAlrpw&_hsmi=369661959&utm_content=369661959&utm_source=hs_email';
export const AddScenarioTemplateModal = ({
  setShowTemplateModal,
  showTemplateModal,
}: {
  setShowTemplateModal: (open: boolean) => void;
  showTemplateModal: boolean;
}) => {
  const { t } = useTranslation('riskRegister', { keyPrefix: 'templateModal' });
  const { toast } = useToast();
  const isGuestUser = useIsGuestUser();
  const { showDemoModal } = useContext(DemoExperienceContext);
  const { mutateAsync: requestPredefinedScenario, isPending } =
    useRequestPredefinedScenario({
      onSuccess: () => {
        toast({
          title: t('emailSent'),
        });
        setShowTemplateModal(false);
        setTimeout(() => {
          window.open(URL, '_blank', 'noopener,noreferrer');
        }, 2500);
      },
      onError: (error) => {
        const errorMessage =
          (error.response?.data as any)?.detail || t('error');
        toast({
          title: errorMessage,
          variant: 'destructive',
        });
      },
    });

  const handleBookMeeting = async () => {
    if (isGuestUser) {
      setShowTemplateModal(false);
      showDemoModal({ title: t('demo.bookMeeting') });
      return;
    }
    await requestPredefinedScenario();
  };

  return (
    <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
      <DialogContent
        data-testid='template-modal'
        className='max-w-md overflow-hidden border-none p-0'
      >
        <div className='flex flex-col items-center p-8'>
          <div className='flex w-full justify-end'>
            <button
              type='button'
              onClick={() => setShowTemplateModal(false)}
              className='text-gray-400 hover:text-gray-500 focus:outline-none'
              aria-label='Close'
            >
              <XModalcloseIcon />
            </button>
          </div>

          <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
            <CheckCircleVIcon />
          </div>

          <h2 className='mb-2 text-center text-xl font-bold '>{t('title')}</h2>

          <p className='mb-6 text-center px-1'>{t('description')}</p>

          <div className='flex gap-6'>
            <Button
              variant='outline'
              onClick={() => setShowTemplateModal(false)}
              className='rounded-2xl px-6'
              disabled={isPending}
            >
              {t('cancel')}
            </Button>

            <Button
              data-testid='book-meeting-button'
              onClick={handleBookMeeting}
              className='bg-fill-brand-primary text-fill-base-0 rounded-2xl px-6'
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                t('book')
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
