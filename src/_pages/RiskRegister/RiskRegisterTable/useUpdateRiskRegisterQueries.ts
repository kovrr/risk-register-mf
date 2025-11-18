import { QUERY_KEYS } from '@/services/hooks';
import type {
  RiskRegisterResponse,
  RiskRegisterScenarioPaginatedResponse,
} from '@/types/riskRegister';
import { type Query, useQueryClient } from '@tanstack/react-query';

const SCENARIO_TABLE_KEY_PREFIX = QUERY_KEYS.RISK_REGISTER_SCENARIOS_TABLE[0];

const _getRelevantQueries = (queries: Query[]) => {
  return queries.filter((query) => {
    const queryKey = query.queryKey;
    return (
      Array.isArray(queryKey) &&
      typeof queryKey[0] === 'string' &&
      queryKey[0].startsWith(SCENARIO_TABLE_KEY_PREFIX)
    );
  });
};

const _updateScenarioInQuery = (
  oldData: RiskRegisterScenarioPaginatedResponse | undefined,
  updatedScenario: RiskRegisterResponse,
) => {
  if (!oldData || !Array.isArray(oldData?.items))
    return oldData ?? { items: [], page: 1, total: 0, size: 10 };
  return {
    ...oldData,
    items: oldData.items.map((scenario) =>
      scenario.scenario_id === updatedScenario.scenario_id
        ? updatedScenario
        : scenario,
    ),
  };
};

const _deleteScenarioFromQuery = (
  oldData: RiskRegisterScenarioPaginatedResponse | undefined,
  deletedScenarioId: string,
) => {
  if (!oldData || !Array.isArray(oldData?.items))
    return oldData ?? { items: [], page: 1, total: 0, size: 10 };
  return {
    ...oldData,
    items: oldData.items.filter(
      (scenario) => scenario.scenario_id !== deletedScenarioId,
    ),
  };
};

export const useUpdateRiskRegisterQueries = () => {
  const queryClient = useQueryClient();

  const updateQueriesWithNewRow = (updatedScenario: RiskRegisterResponse) => {
    const queryCache = queryClient.getQueryCache();
    const queries = queryCache.getAll();
    const relevantQueries = _getRelevantQueries(queries);
    relevantQueries.forEach((query) => {
      const queryKey = query.queryKey;
      queryClient.setQueryData<
        RiskRegisterScenarioPaginatedResponse | undefined
      >(
        queryKey,
        (oldData: RiskRegisterScenarioPaginatedResponse | undefined) =>
          _updateScenarioInQuery(oldData, updatedScenario),
      );
    });
  };

  const updateQueriesWithDeletedRow = (deletedScenarioId: string) => {
    const queryCache = queryClient.getQueryCache();
    const queries = queryCache.getAll();

    const relevantQueries = queries.filter((query) => {
      const queryKey = query.queryKey;
      return (
        Array.isArray(queryKey) &&
        typeof queryKey[0] === 'string' &&
        queryKey[0].startsWith(SCENARIO_TABLE_KEY_PREFIX)
      );
    });
    relevantQueries.forEach((query) => {
      const queryKey = query.queryKey;
      queryClient.setQueryData<
        RiskRegisterScenarioPaginatedResponse | undefined
      >(
        queryKey,
        (oldData: RiskRegisterScenarioPaginatedResponse | undefined) =>
          _deleteScenarioFromQuery(oldData, deletedScenarioId),
      );
    });
  };

  const invalidateScenarioTableQueries = async () => {
    await queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.RISK_REGISTER_SCENARIOS_TABLE,
    });
  };

  const invalidateCurrentScenarioQuery = async (scenarioId: string) => {
    await queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.RISK_REGISTER_SCENARIOS, scenarioId],
    });
  };

  return {
    updateQueriesWithNewRow,
    updateQueriesWithDeletedRow,
    invalidateScenarioTableQueries,
    invalidateCurrentScenarioQuery,
  };
};
