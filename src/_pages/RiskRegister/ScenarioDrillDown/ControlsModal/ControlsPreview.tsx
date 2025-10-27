import { Check, ChevronDown, ChevronUp, X } from 'lucide-react';
// Replaced next/image with regular img tag
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
import { useIsGuestUser } from 'permissions/use-permissions';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ControlsModal, { type FrameworkType } from '.';
import PencilIcon from '../../../../components/icons/pencil.svg';
import {
  convertCisV7SafeguardsImplementationToImplementationLevel,
  convertCisV8SafeguardsImplementationToImplementationLevel,
  convertIsoToImplementationLevel,
  convertTisaxToImplementationLevel,
} from '../../utils/controlsTransfomer';
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

  const [collapsibleState, setCollapsibleState] = useState({
    cis: false,
    cis_v7_safeguards: false,
    nist: false,
    iso: false,
    cis_v8: false,
    cis_v8_safeguards: false,
    tisax: false,
  });
  const frameworksMappings = useFrameworkControlsMapping();

  const { data: scenario, isLoading } = useCurrentRiskRegisterScenario();

  const frameworkMap = useFrameworkControlsMapping();

  const formattedScenarioControls = useMemo(() => {
    if (!scenario?.scenario_data?.relevant_controls) {
      return null;
    }

    return {
      ...scenario.scenario_data.relevant_controls,
      iso27001_implementation_level: convertIsoToImplementationLevel(
        scenario.scenario_data.relevant_controls.iso27001_implementation_level,
      ),
      cis_v8_safeguards:
        convertCisV8SafeguardsImplementationToImplementationLevel(
          scenario.scenario_data.relevant_controls.cis_v8_safeguards,
        ),
      cis_v7_safeguards:
        convertCisV7SafeguardsImplementationToImplementationLevel(
          scenario.scenario_data.relevant_controls.cis_v7_safeguards,
        ),
      tisax_implementation_level: convertTisaxToImplementationLevel(
        scenario.scenario_data.relevant_controls.tisax_implementation_level,
      ),
    };
  }, [scenario]);

  // Creates a map that maps each framework to the number of relevant controls
  const relevantCounter = useMemo(() => {
    if (!formattedScenarioControls || !frameworkMap) return null;

    return Object.entries(frameworkMap).reduce((acc, [key, value]) => {
      const controls = formattedScenarioControls[value.controls];
      acc[key] = Array.isArray(controls) ? controls.length : 0;
      return acc;
    }, {} as any) as Record<FrameworkType, number>;
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
              onClick={handleEditControlsClick}
              type='button'
            >
              <img alt='' src={PencilIcon} className='h-4 w-4' />
            </button>
          </div>
        ) : (
          <div className='flex justify-end pb-4'>
            <button
              data-testid='edit-controls-button'
              className='text-gray-500 hover:text-gray-700'
              onClick={handleEditControlsClick}
              type='button'
            >
              <img alt='' src={PencilIcon} className='h-4 w-4' />
            </button>
          </div>
        )}

        <div className='space-y-4'>
          {relevantControls.length > 0 ? (
            relevantControls.map(([framework, count]) => (
              <Collapsible
                key={framework}
                open={collapsibleState[framework]}
                onOpenChange={(open) =>
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
                      {frameworkMap[framework].title}
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
                    {scenario?.scenario_data?.relevant_controls?.[
                      frameworkMap[framework].controls
                    ]?.map((control) => (
                      <ControlItem
                        key={control}
                        id={control}
                        title={
                          frameworkMap[framework].codeToText(control)?.title ||
                          control
                        }
                        description={
                          frameworkMap[framework].codeToText(control)
                            ?.secondaryTitle || control
                        }
                        completed={
                          formattedScenarioControls &&
                            formattedScenarioControls[
                            frameworkMap[framework].implementationLevel
                            ]?.[control] !== undefined
                            ? frameworksMappings[framework].isImplemented(
                              formattedScenarioControls[
                              frameworkMap[framework].implementationLevel
                              ][control],
                            )
                            : false
                        }
                      />
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))
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
