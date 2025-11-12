import {
  useCurrentRiskRegisterScenario,
  useFrameworks,
} from '@/services/hooks';
import type { FrameworkResponseList } from '@/types/frameworkType';
import { useMemo } from 'react';
import { processAllFrameworks } from './frameworkHelper';

export interface FrameworkMapping {
  controls: string;
  implementationLevel: string; // Discovered or generated implementation key
  title: string;
  isImplemented: (implementedLevel: number) => boolean;
  invertImplemented: (implementedLevel: number) => number;
  codeToText: (
    key: string,
  ) => { title: string; secondaryTitle?: string; desc?: string } | null;
  allowedControlIds?: Set<string>; // Filter for which controls to display
}

// No longer needed - implementation keys are now generated in frameworkHelper.ts

export const useFrameworkControlsMapping = (): Record<
  string,
  FrameworkMapping
> => {
  const { data: frameworksData } = useFrameworks();
  const { data: scenario } = useCurrentRiskRegisterScenario();

  const frameworkMap = useMemo(() => {
    // Helper to get allowedControlIds from scenario data
    const getControlIdsFromScenario = (
      implementationKey: string,
    ): Set<string> => {
      const implData = (
        scenario?.scenario_data?.relevant_controls as
        | Record<string, unknown>
        | undefined
      )?.[implementationKey];
      if (!implData || typeof implData !== 'object') return new Set();

      // Flatten nested structures
      const keys = new Set<string>();
      const extractKeys = (obj: unknown) => {
        if (obj && typeof obj === 'object') {
          Object.entries(obj).forEach(([key, value]) => {
            if (typeof value === 'number') {
              keys.add(key);
            } else if (typeof value === 'object') {
              extractKeys(value);
            }
          });
        }
      };
      extractKeys(implData);
      return keys;
    };

    if (!frameworksData) {
      return {};
    }

    const processedFrameworks = processAllFrameworks(
      frameworksData as FrameworkResponseList,
    );
    const apiFrameworks: Record<string, FrameworkMapping> = {};

    processedFrameworks.forEach((framework, key) => {
      const scenarioControlIds = getControlIdsFromScenario(
        framework.implementationLevelKey,
      );
      const mergedAllowedIds = new Set<string>([
        ...Array.from(framework.allowedControlIds ?? new Set<string>()),
        ...Array.from(scenarioControlIds),
      ]);

      apiFrameworks[key] = {
        controls: framework.controlsKey,
        implementationLevel: framework.implementationLevelKey,
        title: framework.title,
        allowedControlIds: mergedAllowedIds,
        isImplemented: (implementedLevel: number) => implementedLevel === 1,
        invertImplemented: (implementedLevel: number) =>
          implementedLevel === 1 ? 0 : 1,
        codeToText: (controlKey: string) => {
          const control = framework.controls.get(controlKey);
          if (!control) {
            return {
              title: controlKey,
              secondaryTitle: controlKey,
              desc: controlKey,
            };
          }

          return {
            title: control.reference
              ? `${control.reference} ${control.title}`
              : control.title,
            secondaryTitle: control.description,
            desc: control.description,
          };
        },
      };
    });

    return apiFrameworks;
  }, [frameworksData, scenario]);

  return frameworkMap;
};
