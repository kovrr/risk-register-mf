import { useQuery } from '@tanstack/react-query';
import { fetchScenarioFieldEnums } from '@/services/scenarioFieldEnums';

export function useScenarioFieldEnums() {
  return useQuery({
    queryKey: ['scenario-field-enums'],
    queryFn: fetchScenarioFieldEnums,
    staleTime: 60 * 60 * 1000, // 1h cache
  });
}
