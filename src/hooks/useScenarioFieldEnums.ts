import { useMemo } from 'react';
import { scenarioFieldEnumValues } from '@/constants/scenarioEnums';

export function useScenarioFieldEnums() {
  const data = useMemo(() => scenarioFieldEnumValues, []);

  return {
    data,
    isLoading: false,
  };
}
