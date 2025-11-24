import { Badge } from '@/components/atoms/badge';
import { Card } from '@/components/atoms/card';
import { Checkbox } from '@/components/atoms/checkbox';
import { Skeleton } from '@/components/atoms/skeleton';
import { DemoExperienceContext } from '@/contexts/DemoExperienceContext';
import { cn } from '@/lib/utils';
import { useCurrentRiskRegisterScenario } from '@/services/hooks';
import { Check, X } from 'lucide-react';
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
      <div className='space-y-4'>
        {includeHeader ? (
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-bold text-text-base-primary'>
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
          <div className='flex justify-end'>
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
              <div key={framework} className='space-y-3'>
                {/* Framework Badge */}
                <div className='flex items-center gap-2'>
                  <Badge
                    variant='secondary'
                    className='rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700'
                  >
                    {frameworkConfig.title} · {count}
                  </Badge>
                      </div>

                {/* Controls List */}
                <div className='space-y-2 pl-2'>
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
              </div>
              );
            })
          ) : (
            <div
              data-testid='no-controls-message'
            className='flex justify-center py-8 text-sm italic text-text-base-secondary'
            >
              {t('noControls')}
            </div>
          )}
        </div>
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
  // Extract control ID - typically in format like "GOVERN 1.1" or just use the id
  const controlId = id.includes(' ') ? id.split(' ').slice(0, 2).join(' ') : id;

  return (
    <div
      data-testid={`control-item-${id}`}
      className='flex items-start gap-3 rounded-md border border-gray-100 p-3'
    >
      <Checkbox
        checked={true}
        disabled
        className='mt-0.5'
        data-testid={`control-checkbox-${id}`}
      />
      <div className='flex-1 space-y-1'>
        <div className='flex items-center gap-2'>
          <span
            data-testid={`control-id-${id}`}
            className='text-xs font-semibold text-text-base-primary'
          >
            {controlId}
          </span>
        <div
          className={cn(
              'flex h-4 w-4 items-center justify-center rounded-full',
              completed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600',
          )}
        >
          {completed ? (
              <Check className='h-3 w-3' />
          ) : (
              <X className='h-3 w-3' />
          )}
          </div>
        </div>
          <div
            data-testid={`control-title-${id}`}
          className='text-sm font-medium text-text-base-primary'
          >
            {title}
          </div>
        {description && (
          <div
            data-testid={`control-description-${id}`}
            className='text-xs text-text-base-secondary'
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
