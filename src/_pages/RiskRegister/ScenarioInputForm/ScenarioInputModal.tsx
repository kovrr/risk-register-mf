import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog';
import {
  type RiskRegisterResponse,
  type ScenarioType,
  scenarioTypes,
} from '@/types/riskRegister';
import { useTranslation } from 'react-i18next';
import { CRQRiskScenarioInputForm } from './CRQRiskScenarioInputForm';
import { InputFormSkeleton } from './InputFormSkeleton';
import { RiskScenarioInputForm } from './RiskScenarioInputForm';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scenario?: RiskRegisterResponse;
  mode?: 'create' | 'edit';
  isInitialDataLoading?: boolean;
  scenarioType: ScenarioType;
};

export default function ScenarioInputModal({
  open,
  onOpenChange,
  scenario,
  mode = 'create',
  isInitialDataLoading,
  scenarioType,
}: Props) {
  const { t } = useTranslation('riskRegister', { keyPrefix: 'modal' });
  const isEditMode = !!scenario;
  const closeModal = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='mb-[25px] mt-[75px] max-h-[739px] max-w-[522px] overflow-y-auto'
        overlayClassName='fixed inset-0 grid items-center '
      >
        <div className='space-y-[20px]'>
          <DialogHeader>
            <DialogTitle className='text-[26px] font-[700]'>
              {isEditMode ? t('title.edit') : t('title.create')}
            </DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {isInitialDataLoading && mode === 'edit' ? (
            <InputFormSkeleton />
          ) : scenarioType === scenarioTypes.CRQ ? (
            <CRQRiskScenarioInputForm
              scenario={scenario}
              onSuccess={closeModal}
            />
          ) : (
            <RiskScenarioInputForm scenario={scenario} onSuccess={closeModal} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
