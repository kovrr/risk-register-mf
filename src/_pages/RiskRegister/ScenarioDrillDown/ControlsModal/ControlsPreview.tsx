import { Card } from '@/components/atoms/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/atoms/collapsible';
import { Skeleton } from '@/components/atoms/skeleton';
import { DemoExperienceContext } from '@/contexts/DemoExperienceContext';
import { cn } from '@/lib/utils';
import { useCurrentRiskRegisterScenario } from '@/services/hooks';
import { Check, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useIsGuestUser } from 'permissions/use-permissions';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ControlsModal, { type FrameworkType } from '.';
import PencilIcon from '../../../../components/icons/pencil.svg';
import { convertFrameworkLevelsServerToFrameworkLevels } from '../../utils/controlsTransfomer';
import { useFrameworkControlsMapping } from './utils';

export default function ControlsPreview({
  includeHeader,
}: {
  includeHeader?: boolean;
}) {
  const { t } = useTranslation('riskRegister', {
    keyPrefix: 'scenarioDrillDown.controlsModal',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isGuestUser = useIsGuestUser();
  const { showDemoModal } = useContext(DemoExperienceContext);

  const handleEditControlsClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Dynamic collapsible state for all frameworks (hardcoded + API)
  const [collapsibleState, setCollapsibleState] = useState<
    Record<string, boolean>
  >({});
  const frameworkMap = useFrameworkControlsMapping();

  const { data: scenario, isLoading } = useCurrentRiskRegisterScenario();

  const formattedScenarioControls = useMemo(() => {
    if (!scenario?.scenario_data?.relevant_controls) {
      return null;
    }

    // Use generic conversion that handles ALL frameworks (hardcoded + API)
    return convertFrameworkLevelsServerToFrameworkLevels(
      scenario.scenario_data.relevant_controls,
    );
  }, [scenario]);

  // Creates a map that maps each framework to the number of relevant controls
  const relevantCounter = useMemo(() => {
    if (!formattedScenarioControls || !frameworkMap) return null;

    const counts = Object.entries(frameworkMap).reduce(
      (acc, [key, value]) => {
        const controls = (formattedScenarioControls as Record<string, unknown>)[
          value.controls
        ];
        // Handle both Array and Set for API frameworks
        let count = 0;
        if (Array.isArray(controls)) {
          count = controls.length;
        } else if (controls instanceof Set) {
          count = controls.size;
        }

        acc[key] = count;
        return acc;
      },
      {} as Record<string, number>,
    ) as Record<FrameworkType, number>;

    return counts;
  }, [frameworkMap, formattedScenarioControls]);

  const relevantControls = useMemo(() => {
    if (!relevantCounter) return [];

    return (
      Object.entries(relevantCounter) as [
        keyof typeof relevantCounter,
        number,
      ][]
    ).filter(([_, count]) => count > 0);
  }, [relevantCounter]);

  if (isLoading) {
    return (
      <div className='flex justify-center'>
        <Skeleton className='h-10 w-[70%]' />
      </div>
    );
  }

  if (!scenario?.scenario_data?.relevant_controls) {
    return (
      <Card>
        <div className='flex justify-center p-4 text-sm text-gray-500'>
          No controls data available
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        {includeHeader ? (
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-[17px] font-[700] text-text-base-primary'>
              Relevant Controls
            </h2>
            <button
              data-testid='edit-controls-button'
              className='text-gray-500 hover:text-gray-700'
              type='button'
              onClick={handleEditControlsClick}
            >
              <img alt='' src={PencilIcon} className='h-4 w-4' />
            </button>
          </div>
        ) : (
          <div className='flex justify-end pb-4'>
            <button
              data-testid='edit-controls-button'
              className='text-gray-500 hover:text-gray-700'
              type='button'
              onClick={handleEditControlsClick}
            >
              <img alt='' src={PencilIcon} className='h-4 w-4' />
            </button>
          </div>
        )}

        <div className='space-y-4'>
          {relevantControls.length > 0 ? (
            relevantControls.map(([framework, count]) => {
              const frameworkConfig = frameworkMap[framework];
              if (!frameworkConfig) {
                return null;
              }

              const rawRelevantControls = (
                scenario?.scenario_data?.relevant_controls as
                | Record<string, unknown>
                | undefined
              )?.[frameworkConfig.controls] as string[] | undefined;

              const implementationLevels =
                (
                  formattedScenarioControls as unknown as Record<
                    string,
                    Record<string, number> | undefined
                  >
                )[frameworkConfig.implementationLevel] || {};

              return (
                <Collapsible
                  key={framework}
                  open={collapsibleState[framework] || false}
                  onOpenChange={(open: boolean) =>
                    setCollapsibleState({
                      ...collapsibleState,
                      [framework]: open,
                    })
                  }
                >
                  <CollapsibleTrigger
                    data-testid={`framework-collapsible-${framework}`}
                    className='flex items-center justify-start gap-4'
                  >
                    <div className='flex items-center gap-2 rounded-full bg-slate-100 px-5 py-2'>
                      <span className='font-semibold text-slate-800'>
                        {frameworkConfig.title}
                      </span>
                      <div
                        data-testid={`framework-count-${framework}`}
                        className='flex items-center justify-center rounded-[4px] bg-fill-brand-primary px-[7px] py-[2px] text-[13px] font-[700] text-white'
                      >
                        {count}
                      </div>
                    </div>
                    {collapsibleState[framework] ? (
                      <ChevronUp className='h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200' />
                    ) : (
                      <ChevronDown className='h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200' />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className='pt-4'>
                    <div className='space-y-0'>
                      {(rawRelevantControls || []).map((control: string) => {
                        const codeToText = frameworkConfig.codeToText(control);
                        const implementationValue =
                          implementationLevels?.[control] ?? 0;
                        const implementationChecker =
                          frameworkConfig.isImplemented;
                        const isImplemented = implementationChecker
                          ? implementationChecker(implementationValue)
                          : implementationValue === 1;

                        return (
                          <ControlItem
                            key={control}
                            id={control}
                            title={codeToText?.title || control}
                            description={codeToText?.secondaryTitle || control}
                            completed={isImplemented}
                          />
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })
          ) : (
            <div
              data-testid='no-controls-message'
              className='flex justify-center text-xs font-light italic text-text-base-secondary'
            >
              {t('noControls')}
            </div>
          )}
        </div>
      </Card>
      <ControlsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        isGuestUser={isGuestUser}
        showDemoModal={showDemoModal}
      />
    </>
  );
}

interface ControlItemProps {
  id: string;
  title: string;
  completed: boolean;
  description: string;
}

function ControlItem({ id, title, completed, description }: ControlItemProps) {
  return (
    <div
      data-testid={`control-item-${id}`}
      className='border-b border-slate-200 py-4'
    >
      <div className='flex items-start gap-3'>
        <div
          className={cn(
            'mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full',
            completed ? 'text-emerald-500' : 'text-slate-300',
          )}
        >
          {completed ? (
            <Check className='h-5 w-5' />
          ) : (
            <X className='h-5 w-5' />
          )}
        </div>
        <div>
          <div
            data-testid={`control-title-${id}`}
            className='text-[12px] font-[700] text-text-base-primary'
          >
            {title}
          </div>
          <div
            data-testid={`control-description-${id}`}
            className='text-[14px] font-[400] text-text-base-primary'
          >
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}
