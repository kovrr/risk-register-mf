import { Button } from '@/components/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog';
import { Toaster } from '@/components/atoms/sonner';
import { cn } from '@/lib/utils';
import {
  QUERY_KEYS,
  useCurrentRiskRegisterScenario,
  useUpdateRiskRegisterScenarioField,
} from '@/services/hooks';
import type { ControlsFrameworkLevels } from '@/types/riskRegister';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  convertFrameworkLevelsServerToFrameworkLevels,
  convertFrameworkLevelsToFrameworkLevelsServer,
  getControlsFromFramework,
} from '../../utils/controlsTransfomer';
import { ControlsTable } from './ControlsTable';
import { columns } from './columns';
import { useFrameworkControlsMapping } from './utils';

export type FrameworkType =
  | 'cis'
  | 'nist'
  | 'iso'
  | 'cis_v8'
  | 'cis_v8_safeguards'
  | 'cis_v7_safeguards'
  | 'tisax';

export default function ControlsModal({
  isOpen,
  onClose,
  isGuestUser,
  showDemoModal,
}: {
  isOpen: boolean;
  onClose: () => void;
  isGuestUser?: boolean;
  showDemoModal?: (modalContents: { title: string }) => void;
}) {
  const queryClient = useQueryClient();
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.controlsModal',
  });
  const { mutateAsync: updateScenarioField, isLoading: isSaving } =
    useUpdateRiskRegisterScenarioField({
      onSuccess: async (updatedScenario) => {
        await queryClient.invalidateQueries([
          QUERY_KEYS.RISK_REGISTER_SCENARIOS,
          updatedScenario.scenario_id,
        ]);
        toast.success('Controls saved successfully');
      },
      onError: (error) => {
        toast.error('Failed to save controls. Please try again.');
      },
    });

  const frameworks = useMemo(
    () =>
      [
        { name: t('frameworks.cisV8Safeguards'), value: 'cis_v8_safeguards' },
        { name: t('frameworks.cisV8'), value: 'cis_v8' },
        { name: t('frameworks.cisV7'), value: 'cis' },
        { name: t('frameworks.cisV7Safeguards'), value: 'cis_v7_safeguards' },
        { name: t('frameworks.nist'), value: 'nist' },
        { name: t('frameworks.iso'), value: 'iso' },
        { name: t('frameworks.tisax'), value: 'tisax' },
      ] as const,
    [t],
  );

  const frameworkMap = useFrameworkControlsMapping();

  const [activeFramework, setActiveFramework] = useState<FrameworkType>('cis');
  const [controls, setControls] = useState<ControlsFrameworkLevels | null>(
    null,
  );
  const { data: scenario } = useCurrentRiskRegisterScenario();

  const handleSaveChanges = async () => {
    if (isGuestUser && showDemoModal) {
      onClose();
      showDemoModal({ title: t('editControls') });
      return;
    }

    if (!scenario || !controls) return;

    try {
      await updateScenarioField({
        ...scenario.scenario_data,
        relevant_controls:
          convertFrameworkLevelsToFrameworkLevelsServer(controls),
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      scenario &&
      controls === null &&
      scenario.scenario_data?.relevant_controls
    ) {
      setControls(
        convertFrameworkLevelsServerToFrameworkLevels(
          scenario.scenario_data.relevant_controls,
        ),
      );
    }
  }, [scenario, controls]);

  const handleImplementedChange = (controlId: string, implemented: number) => {
    const invertImplemented =
      frameworkMap[activeFramework].invertImplemented(implemented);
    setControls((prevControls) => {
      if (!prevControls) return null;
      const implKey = frameworkMap[activeFramework].implementationLevel;
      const currentImplLevel = prevControls[implKey];

      if (!currentImplLevel) {
        return prevControls;
      }

      return {
        ...prevControls,
        [implKey]: {
          ...currentImplLevel,
          [controlId]: invertImplemented,
        },
      };
    });
  };

  const handleRelevantChange = (controlId: string, relevant: boolean) => {
    setControls((prevControls) => {
      if (!prevControls) return null;
      const frameworkKey = frameworkMap[activeFramework].controls;
      const currRelevantControls = prevControls[frameworkKey];

      if (!currRelevantControls) {
        return prevControls;
      }

      if (!relevant) {
        currRelevantControls.delete(controlId);
      } else {
        currRelevantControls.add(controlId);
      }
      return {
        ...prevControls,
        [frameworkKey]: currRelevantControls,
      };
    });
  };

  const handleFrameworkClick = (framework: FrameworkType) => {
    setActiveFramework(framework);
  };

  const controlsCount = useMemo(() => {
    return controls && controls[frameworkMap[activeFramework].controls]
      ? Array.from(controls[frameworkMap[activeFramework].controls]).length
      : 0;
  }, [controls, activeFramework, frameworkMap]);

  const getControlsCount = (framework: FrameworkType) => {
    return controls && controls[frameworkMap[framework].controls]
      ? Array.from(controls[frameworkMap[framework].controls]).length
      : 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className='mb-[25px] mt-[75px] border-none'
        overlayClassName='fixed inset-0 grid items-center overflow-y-auto'
      >
        <DialogHeader className='mb-[30px]'>
          <DialogTitle className='text-[20px] font-[700] leading-none'>
            {t('title')}
          </DialogTitle>
        </DialogHeader>

        <div className='flex flex-col'>
          {controls && (
            <span className='text-text-primary mb-[10px] ml-auto text-[14px] font-[700]'>
              {t('selectedCount', {
                count: controlsCount,
              })}
            </span>
          )}
          <div className='flex rounded-lg border bg-[#f8fafd]'>
            {/* Sidebar */}
            <div className='flex flex-row'>
              <div className='flex w-[293px] flex-col items-start gap-[15px] bg-fill-base-1 py-[27px]'>
                {frameworks.map((framework) => {
                  const currControlsCount = getControlsCount(framework.value);
                  return (
                    <div
                      data-testid={`modal-framework-${framework.value}`}
                      className='flex w-full flex-row items-center justify-between pr-[10px]'
                      key={framework.name}
                      onClick={() => handleFrameworkClick(framework.value)}
                    >
                      <span
                        className={cn(
                          'text-text-primary w-auto cursor-pointer rounded-none py-0 pl-[16px] hover:no-underline',
                          activeFramework === framework.value &&
                          'border-l-4 border-fill-brand-primary text-fill-brand-primary',
                        )}
                      >
                        {framework.name}
                      </span>
                      {controls && currControlsCount > 0 && (
                        <div
                          data-testid={`modal-framework-count-${framework.value}`}
                          className='flex items-center justify-center rounded-[4px] bg-fill-brand-primary px-[7px] py-[2px] text-[13px] font-[700] text-white'
                        >
                          {currControlsCount}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Main content */}
            <div className='w-[680px] flex-1 overflow-auto bg-fill-base-0'>
              <div className='p-6'>
                <div className='mb-8 flex items-center justify-between'>
                  <h1
                    data-testid='modal-framework-title'
                    className='text-[17px] font-[700] text-text-base-primary'
                  >
                    {frameworkMap[activeFramework].title}
                  </h1>
                </div>

                {/* Controls table */}
                {controls && (
                  <ControlsTable
                    columns={columns}
                    data={getControlsFromFramework(activeFramework, controls)}
                    onImplementedChange={handleImplementedChange}
                    onRelevantChange={handleRelevantChange}
                    isImplemented={frameworkMap[activeFramework].isImplemented}
                    codeToText={frameworkMap[activeFramework].codeToText}
                  />
                )}
              </div>
            </div>
          </div>
          <div className='mt-[30px] flex justify-end'>
            <Button
              data-testid='save-changes-button'
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className='animate-spin' />
                  {t('buttons.saving')}
                </>
              ) : (
                t('buttons.saveChanges')
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
      <Toaster />
    </Dialog>
  );
}
