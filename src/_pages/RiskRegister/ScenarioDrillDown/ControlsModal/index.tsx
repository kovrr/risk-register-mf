import { Button } from '@/components/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import type {
  ControlsFrameworkLevels,
  RiskRegisterResponse,
} from '@/types/riskRegister';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  convertFrameworkLevelsServerToFrameworkLevels,
  convertFrameworkLevelsToFrameworkLevelsServer,
  getControlsFromFramework,
} from '../../utils/controlsTransfomer';
import { ControlsTable } from './ControlsTable';
import { columns } from './columns';
import { useFrameworkControlsMapping } from './utils';

export type FrameworkType = string;

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
  const { mutateAsync: updateScenarioField, status: updateStatus } =
    useUpdateRiskRegisterScenarioField({
      onSuccess: async (updatedScenario: RiskRegisterResponse) => {
        await queryClient.invalidateQueries({
          queryKey: [
            QUERY_KEYS.RISK_REGISTER_SCENARIOS,
            updatedScenario.scenario_id,
          ],
        });
        toast.success('Controls saved successfully');
      },
      onError: (_error) => {
        toast.error('Failed to save controls. Please try again.');
      },
    });

  const isSaving = updateStatus === 'pending';

  const frameworkMap = useFrameworkControlsMapping();

  // Generate frameworks list dynamically from frameworkMap
  const frameworks = useMemo(() => {
    if (!frameworkMap) return [];

    return Object.entries(frameworkMap).map(([key, value]) => ({
      name: value.title,
      value: key as FrameworkType,
    }));
  }, [frameworkMap]);

  const [activeFramework, setActiveFramework] = useState<FrameworkType | null>(
    null,
  );
  const [controls, setControls] = useState<ControlsFrameworkLevels | null>(
    null,
  );
  const { data: scenario } = useCurrentRiskRegisterScenario();

  useEffect(() => {
    const frameworkKeys = Object.keys(frameworkMap);
    if (frameworkKeys.length === 0) {
      setActiveFramework(null);
      return;
    }

    setActiveFramework((prev) => {
      if (prev && frameworkKeys.includes(prev)) {
        return prev;
      }
      return frameworkKeys[0] as FrameworkType;
    });
  }, [frameworkMap]);

  const handleSaveChanges = async () => {
    if (isGuestUser && showDemoModal) {
      onClose();
      showDemoModal({ title: t('editControls') });
      return;
    }

    if (!scenario || !controls) return;

    try {
      const convertedControls =
        convertFrameworkLevelsToFrameworkLevelsServer(controls);

      await updateScenarioField({
        ...scenario.scenario_data,
        relevant_controls: convertedControls,
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
    if (!activeFramework) return;
    const activeConfig = frameworkMap[activeFramework];
    if (!activeConfig) return;

    const invertImplemented = activeConfig.invertImplemented(implemented);
    setControls((prevControls) => {
      if (!prevControls) return null;
      const implKey = activeConfig.implementationLevel;
      const currentImplLevel = (prevControls as Record<string, unknown>)[
        implKey
      ];

      // Initialize empty object if doesn't exist (for new API frameworks)
      if (!currentImplLevel || typeof currentImplLevel !== 'object') {
        return {
          ...prevControls,
          [implKey]: {
            [controlId]: invertImplemented,
          },
        };
      }

      return {
        ...prevControls,
        [implKey]: {
          ...(currentImplLevel as Record<string, number>),
          [controlId]: invertImplemented,
        },
      };
    });
  };

  const handleRelevantChange = (controlId: string, relevant: boolean) => {
    if (!activeFramework) return;
    const activeConfig = frameworkMap[activeFramework];
    if (!activeConfig) return;

    setControls((prevControls) => {
      if (!prevControls) return null;
      const frameworkKey = activeConfig.controls;
      const currRelevantControls = (prevControls as Record<string, unknown>)[
        frameworkKey
      ];

      // Initialize empty Set if doesn't exist (for new API frameworks)
      let relevantSet: Set<string>;
      if (!currRelevantControls || !(currRelevantControls instanceof Set)) {
        relevantSet = new Set<string>();
      } else {
        relevantSet = new Set(currRelevantControls);
      }

      if (!relevant) {
        relevantSet.delete(controlId);
      } else {
        relevantSet.add(controlId);
      }

      return {
        ...prevControls,
        [frameworkKey]: relevantSet,
      };
    });
  };

  const handleFrameworkClick = (framework: FrameworkType) => {
    setActiveFramework(framework);
  };

  const controlsCount = useMemo(() => {
    if (!controls || !activeFramework) return 0;
    const activeConfig = frameworkMap[activeFramework];
    if (!activeConfig) return 0;
    const frameworkControlsKey = activeConfig.controls;
    const frameworkControls = (controls as Record<string, unknown>)[
      frameworkControlsKey
    ];

    if (frameworkControls instanceof Set) {
      return frameworkControls.size;
    }
    if (Array.isArray(frameworkControls)) {
      return frameworkControls.length;
    }
    return 0;
  }, [controls, activeFramework, frameworkMap]);

  const getControlsCount = (framework: FrameworkType) => {
    if (!controls) return 0;
    const frameworkConfig = frameworkMap[framework];
    if (!frameworkConfig) return 0;
    const frameworkControlsKey = frameworkConfig.controls;
    const frameworkControls = (controls as Record<string, unknown>)[
      frameworkControlsKey
    ];

    if (frameworkControls instanceof Set) {
      return frameworkControls.size;
    }
    if (Array.isArray(frameworkControls)) {
      return frameworkControls.length;
    }
    return 0;
  };

  const activeFrameworkConfig = activeFramework
    ? frameworkMap[activeFramework]
    : undefined;

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
          <DialogDescription className='sr-only'>
            Select and manage relevant controls for this scenario
          </DialogDescription>
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
                  const isActive = activeFramework === framework.value;

                  return (
                    <button
                      type='button'
                      data-testid={`modal-framework-${framework.value}`}
                      className={cn(
                        'flex w-full items-center justify-between pr-[10px] pl-[16px] text-left transition-colors',
                        'bg-transparent py-[6px]',
                        isActive
                          ? 'border-l-4 border-fill-brand-primary text-fill-brand-primary'
                          : 'border-l-4 border-transparent text-text-primary hover:text-fill-brand-primary',
                      )}
                      key={framework.name}
                      onClick={() => handleFrameworkClick(framework.value)}
                    >
                      <span className='w-auto rounded-none'>
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
                    </button>
                  );
                })}
                {frameworks.length === 0 && (
                  <span className='px-[16px] text-sm text-text-base-secondary'>
                    {t('noFrameworksAvailable', 'No frameworks available')}
                  </span>
                )}
              </div>
            </div>

            {/* Main content */}
            <div className='w-[680px] flex-1 overflow-auto bg-fill-base-0'>
              <div className='p-6'>
                {activeFrameworkConfig ? (
                  <>
                    <div className='mb-8 flex items-center justify-between'>
                      <h1
                        data-testid='modal-framework-title'
                        className='text-[17px] font-[700] text-text-base-primary'
                      >
                        {activeFrameworkConfig.title}
                      </h1>
                    </div>

                    {/* Controls table */}
                    {controls ? (
                      <ControlsTable
                        columns={columns}
                        data={getControlsFromFramework(
                          controls,
                          activeFrameworkConfig.controls,
                          activeFrameworkConfig.implementationLevel,
                          activeFrameworkConfig.allowedControlIds,
                        )}
                        onImplementedChange={handleImplementedChange}
                        onRelevantChange={handleRelevantChange}
                        isImplemented={activeFrameworkConfig.isImplemented}
                        codeToText={activeFrameworkConfig.codeToText}
                      />
                    ) : (
                      <div className='text-sm text-text-base-secondary'>
                        {t('noControlsData', 'No controls data available')}
                      </div>
                    )}
                  </>
                ) : (
                  <div className='text-sm text-text-base-secondary'>
                    {t('noFrameworksAvailable', 'No frameworks available')}
                  </div>
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
