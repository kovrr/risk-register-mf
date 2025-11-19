import type { InvitationFormValues } from '@/components/molecules/form-config';
import { useAxiosInstance } from '@/state/HttpClientContext';
import type { CompanyApiResponseItem, CompanyData } from '@/types/companyForm';
import type { FrameworkResponseList } from '@/types/frameworkType';
import type { QuantificationData } from '@/types/quantificationData';
import {
  type CRQScenarioCreateRequest,
  type CRQScenarioUpdateRequest,
  type RiskOwner,
  type RiskRegisterResponse,
  type RiskRegisterRow,
  type RiskRegisterScenarioPaginatedResponse,
  type ScenarioCreateRequest,
  type ScenarioMetricsHistory,
  type ScenarioType,
  type SimpleScenarioUpdateRequest,
  scenarioTypes,
} from '@/types/riskRegister';
import {
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';

// Query Keys - Risk Register specific
export const QUERY_KEYS = {
  COMPANIES: ['COMPANIES'],
  RISK_REGISTER_SCENARIOS: ['RISK_REGISTER_SCENARIOS'],
  NOTES: ['NOTES'],
  RISK_REGISTER_SCENARIOS_TABLE: ['RISK_REGISTER_SCENARIOS_TABLE'],
  RISK_OWNER: ['RISK_REGISTER_RISK_OWNER'],
  DOCUMENTS: ['DOCUMENTS'],
  FQ: ['FQ'], // Financial Quantification
  FRAMEWORKS: `FRAMEWORKS`,
};

// Resolve API base depending on mock mode:
// - When mocks are ON, use relative URLs so MSW can intercept
// - When mocks are OFF, use the configured absolute backend base with proper resolution
const resolveApiBaseUrl = (): string => {
  // Priority order: VITE_API_BASE_URL > NEXT_PUBLIC_API_BASE_URL > VITE_API_URL > NEXT_PUBLIC_API_URL
  const envBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.NEXT_PUBLIC_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    import.meta.env.NEXT_PUBLIC_API_URL;

  // If mocks are enabled, use relative path for MSW interception
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return '/api/v1';
  }

  // If env var exists and contains http:// or https://, append /api/v1
  if (envBaseUrl && (envBaseUrl.startsWith('http://') || envBaseUrl.startsWith('https://'))) {
    // Remove trailing slash if present, then append /api/v1
    const cleaned = envBaseUrl.replace(/\/+$/, '');
    return `${cleaned}/api/v1`;
  }

  // If env var exists but doesn't have protocol, add http://
  if (envBaseUrl) {
    const cleaned = envBaseUrl.replace(/^\/+|\/+$/g, '');
    return `http://${cleaned}/api/v1`;
  }

  // Default fallback - never use window.location.origin for API calls
  return 'http://localhost:8000/api/v1';
};

const apiBasePath = resolveApiBaseUrl();

const DEFAULT_GROUP_ID = '00000000-0000-0456-0001-000000000001';

type ScenarioPayload =
  | ScenarioCreateRequest
  | CRQScenarioCreateRequest
  | SimpleScenarioUpdateRequest
  | CRQScenarioUpdateRequest;

const buildScenarioRequestBody = (
  payload: ScenarioPayload,
  fallbackScenarioType: ScenarioType,
) => {
  const {
    customer_scenario_id,
    name,
    description,
    group_id,
    ...scenarioData
  } = payload;

  const scenarioType =
    'scenario_type' in payload && payload.scenario_type
      ? payload.scenario_type
      : fallbackScenarioType;

  const { scenario_type: _ignored, ...sanitizedScenarioData } = scenarioData as typeof scenarioData & {
    scenario_type?: ScenarioType;
  };

  return {
    group_id: group_id ?? DEFAULT_GROUP_ID,
    customer_scenario_id,
    name,
    description,
    scenario_type: scenarioType,
    scenario_data: sanitizedScenarioData,
  };
};

// API URLs - Risk Register specific
export const API_URL = {
  COMPANIES: `${apiBasePath}/companies`,
  RISK_REGISTER: `${apiBasePath}/risk-register`,
  RISK_SCENARIOS: `${apiBasePath}/risk-scenarios/`,
  NOTES: `${apiBasePath}/notes`,
  DOCUMENTS: `${apiBasePath}/documents`,
  FQ: `${apiBasePath}/fq`, // Financial Quantification
  FRAMEWORKS: `${apiBasePath}/self-assessment/frameworks`,
};

// ============================================================================
// NOTES TYPES
// ============================================================================

export interface Document {
  id: string;
  filename: string;
}

export interface Note {
  id: string;
  parent_type: 'quantification' | 'scenario';
  parent_id: string;
  content: string;
  user: string;
  created_at: string;
  documents?: Document[];
}

export interface NotesPage {
  items: Note[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface CreateGenericNoteParams {
  parentType: 'quantification' | 'scenario';
  parentId: string;
  content: string;
  user: string;
  uploaded_file?: File;
}

// ============================================================================
// SUPPORTING HOOKS (Dependencies for Risk Register)
// ============================================================================

type StrippedQueryOptions<TQueryFnData, TError = AxiosError, TData = TQueryFnData> =
  Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey' | 'queryFn'> & {
    /**
     * React Query v5 removed `keepPreviousData`, but we allow it for backward compatibility.
     * It is ignored at runtime by the underlying library.
     */
    keepPreviousData?: boolean;
  };

/**
 * Fetch paginated list of companies
 * DISABLED: This endpoint does not exist in the backend and is not used by the Scenario Details page.
 * Returns a no-op hook that doesn't make API calls.
 */
export const useCompanies = (
  _params: {
    page: number;
    size: number;
    name?: string;
    fields?: string[];
    id?: string;
  },
  _options?: StrippedQueryOptions<{ items: CompanyApiResponseItem[]; total: number }>,
) => {
  // No-op implementation - returns empty data without making API calls
  return {
    data: { items: [], total: 0 } as { items: CompanyApiResponseItem[]; total: number },
    isLoading: false,
    isPending: false,
    isError: false,
    error: null,
    refetch: async () => {
      return {
        data: { items: [], total: 0 } as { items: CompanyApiResponseItem[]; total: number },
      };
    },
  };
};

/**
 * Fetch a single company by ID
 * DISABLED: This endpoint does not exist in the backend and is not used by the Scenario Details page.
 * Returns a no-op hook that doesn't make API calls.
 */
export const useCompany = (
  _id: string,
  _options?: StrippedQueryOptions<CompanyData, AxiosError>,
) => {
  // No-op implementation - returns undefined without making API calls
  return {
    data: undefined as CompanyData | undefined,
    isLoading: false,
    isPending: false,
    isError: false,
    error: null,
    refetch: async () => {
      return {
        data: undefined as CompanyData | undefined,
      };
    },
  };
};

/**
 * Get current company ID from URL params (if exists)
 */
export const useCurrentCompanyIdIfExists = () => {
  const { companyId } = useParams<{ companyId: string }>();
  if (!companyId) {
    return null;
  }
  return companyId;
};

// ============================================================================
// QUANTIFICATION HOOKS (for Financial Quantification integration)
// ============================================================================

/**
 * Get current quantification ID from URL params (throws if not found)
 */
export const useCurrentQuantificationId = () => {
  const { quantificationId } = useParams<{ quantificationId: string }>();
  if (!quantificationId) {
    throw Error(
      'When using this hook, you must have quantificationId in the path',
    );
  }
  return quantificationId;
};

/**
 * Get current quantification ID from URL params (if exists)
 */
export const useCurrentQuantificationIdIfExists = () => {
  const { quantificationId } = useParams<{ quantificationId: string }>();
  if (!quantificationId) {
    return null;
  }
  return quantificationId;
};

/**
 * Fetch a single quantification by ID
 */
export const useQuantification = (id: string) => {
  const client = useAxiosInstance();
  return useQuery<QuantificationData, AxiosError>({
    queryKey: [QUERY_KEYS.FQ, { id }],
    queryFn: () => client.get(`${API_URL.FQ}/${id}`).then(({ data }) => data),
  });
};

/**
 * Fetch the current quantification (from URL params)
 * Use this when you're on a page with :quantificationId in the route
 */
export const useCurrentQuantification = () => {
  const quantificationId = useCurrentQuantificationId();
  return useQuantification(quantificationId);
};

// ============================================================================
// RISK REGISTER SCENARIO HOOKS
// ============================================================================

/**
 * Create a simple (non-CRQ) risk register scenario
 */
export const useCreateRiskRegisterScenario = (
  options?: Omit<
    UseMutationOptions<
      RiskRegisterResponse,
      AxiosError<{ detail: string }>,
      ScenarioCreateRequest,
      unknown
    >,
    'mutationFn'
  >,
) => {
  const client = useAxiosInstance();
  return useMutation<
    RiskRegisterResponse,
    AxiosError<{ detail: string }>,
    ScenarioCreateRequest
  >({
    mutationFn: async (scenario) => {
      const scenarioWithDefaultGroup = {
        ...scenario,
        group_id: DEFAULT_GROUP_ID,
      };
      return client
        .post(
          API_URL.RISK_SCENARIOS,
          buildScenarioRequestBody(
            scenarioWithDefaultGroup,
            scenarioTypes.MANUAL,
          ),
        )
        .then(({ data }) => data);
    },
    ...options,
  });
};

/**
 * Create a CRQ-powered risk register scenario
 */
export const useCreateCRQRiskRegisterScenario = (
  options?: Omit<
    UseMutationOptions<
      RiskRegisterResponse,
      AxiosError<{ detail: string }>,
      CRQScenarioCreateRequest,
      unknown
    >,
    'mutationFn'
  >,
) => {
  const client = useAxiosInstance();
  return useMutation<
    RiskRegisterResponse,
    AxiosError<{ detail: string }>,
    CRQScenarioCreateRequest
  >({
    mutationFn: async (scenario) => {
      const { group_id: _ignored, ...scenarioWithoutGroup } = scenario;
      const body = buildScenarioRequestBody(
        scenarioWithoutGroup,
        scenarioTypes.CRQ,
      );
      return client
        .post(`${API_URL.RISK_SCENARIOS}crq`, body)
        .then(({ data }) => data);
    },
    ...options,
  });
};

/**
 * Fetch paginated list of risk register scenarios with optional filtering and sorting
 */
export const useRiskRegisterScenarios = (
  params: {
    page: number;
    size: number;
    name?: string;
    fields?: string[];
    sort_by?: string;
    sort_order?: string;
  },
  options?: StrippedQueryOptions<RiskRegisterScenarioPaginatedResponse>,
) => {
  const client = useAxiosInstance();

  const {
    page,
    size,
    name,
    fields,
    sort_by: sortByParam,
    sort_order: sortOrderParam,
  } = params;
  const normalizedSortBy = sortByParam ?? 'updated_at';
  const normalizedSortOrder = sortOrderParam ?? 'desc';
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('size', size.toString());
  if (name) {
    queryParams.append('name', name);
  }
  if (fields) {
    fields.forEach((field) => queryParams.append('fields', field));
  }
  queryParams.append('sort_by', normalizedSortBy);
  queryParams.append('sort_order', normalizedSortOrder);
  const urlWithParams = `${API_URL.RISK_SCENARIOS}?${queryParams.toString()}`;
  return useQuery<RiskRegisterScenarioPaginatedResponse, AxiosError>({
    queryKey: [
      ...QUERY_KEYS.RISK_REGISTER_SCENARIOS_TABLE,
      page,
      size,
      name,
      fields,
      normalizedSortBy,
      normalizedSortOrder,
    ],
    queryFn: () =>
      client.get(urlWithParams).then(({ data }) => {
        // eslint-disable-next-line no-console
        console.log('Scenarios API response', data);
        // Normalize backend variants into RiskRegisterScenarioPaginatedResponse
        const items =
          data?.items ??
          data?.scenarios ??
          data?.results ??
          data?.data ??
          [];
        const total =
          data?.total ?? data?.total_count ?? data?.count ?? items.length ?? 0;
        return {
          items,
          total,
          page,
          size,
        } as RiskRegisterScenarioPaginatedResponse;
      }),
    ...options,
  });
};

/**
 * Fetch a single risk register scenario by ID
 */
export const useRiskRegisterScenario = (
  scenarioId: string,
  options?: StrippedQueryOptions<RiskRegisterResponse, AxiosError>,
  customQueryKey: readonly unknown[] = [],
) => {
  const client = useAxiosInstance();
  return useQuery<RiskRegisterResponse, AxiosError>({
    queryKey: [
      QUERY_KEYS.RISK_REGISTER_SCENARIOS,
      scenarioId,
      ...customQueryKey,
    ],
    queryFn: () =>
      client
        .get(`${API_URL.RISK_SCENARIOS}${scenarioId}`)
        .then(({ data }) => data),
    ...options,
  });
};

/**
 * Fetch metrics history for a scenario
 */
export const useMetricHistory = (
  scenarioId: string,
  options?: StrippedQueryOptions<ScenarioMetricsHistory, AxiosError>,
) => {
  const client = useAxiosInstance();

  return useQuery<ScenarioMetricsHistory, AxiosError>({
    queryKey: [
      QUERY_KEYS.RISK_REGISTER_SCENARIOS,
      scenarioId,
      'metrics-history',
    ],
    queryFn: () =>
      client
        .get(`${API_URL.RISK_SCENARIOS}${scenarioId}/metrics-history`)
        .then(({ data }) => data),
    ...options,
  });
};

/**
 * Get current scenario ID from URL params (if exists)
 */
export const useCurrentRiskRegisterScenarioIdIfExists = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  return scenarioId;
};

/**
 * Get current scenario ID from URL params (throws if not found)
 */
export const useCurrentRiskRegisterScenarioId = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  if (!scenarioId) {
    throw Error('When using this hook, you must have scenarioId in the path');
  }
  return scenarioId;
};

/**
 * Fetch the current scenario (from URL params)
 */
export const useCurrentRiskRegisterScenario = () => {
  const scenarioId = useCurrentRiskRegisterScenarioId();
  return useRiskRegisterScenario(scenarioId);
};

/**
 * Update a risk register scenario row (from table inline editing)
 */
export const useUpdateRiskRegisterScenarioRow = (
  scenarioId: string,
  options: UseMutationOptions<
    RiskRegisterResponse,
    AxiosError,
    RiskRegisterRow
  >,
) => {
  const client = useAxiosInstance();
  const { refetch } = useRiskRegisterScenario(scenarioId, {
    enabled: false,
  });

  return useMutation<RiskRegisterResponse, AxiosError, RiskRegisterRow>({
    mutationKey: [QUERY_KEYS.RISK_REGISTER_SCENARIOS, scenarioId],
    mutationFn: async (data) => {
      const { data: scenario, isError } = await refetch();
      if (!scenario || isError) throw new Error('Scenario not loaded');
      const updatePayload:
        | SimpleScenarioUpdateRequest
        | CRQScenarioUpdateRequest = {
        customer_scenario_id: data.customerScenarioId,
        name: data.scenarioTitle,
        description: data.scenarioDescription,
        likelihood: data.likelihood,
        impact: data.impact,
        company_id: data.company_id,
        annual_likelihood: data.annualLikelihood,
        average_loss: data.averageLoss,
        average_loss_currency: data.averageLossCurrency,
        response_plan: data.responsePlan,
        risk_owner: data.owner,
        risk_priority: data.priority,
        impact_distribution: scenario.scenario_data.impact_distribution,
        methodology_insights: scenario.scenario_data.methodology_insights,
        peer_base_rate: scenario.scenario_data.peer_base_rate,
        relevant_controls: scenario.scenario_data.relevant_controls,
        ticket: scenario.scenario_data.ticket,
        scenario_type: scenario.scenario_type,
        crq_data: (() => {
          const baseCrqData = scenario.scenario_data.crq_data;
          if (!baseCrqData) return baseCrqData;
          const { results: _, ...rest } = baseCrqData;
          return rest;
        })(),
      };

      const requestBody = buildScenarioRequestBody(
        updatePayload,
        scenario.scenario_type,
      );

      return client
        .patch(`${API_URL.RISK_SCENARIOS}${scenarioId}`, requestBody)
        .then(({ data }) => data);
    },
    ...options,
  });
};

type UpdateFieldParams = Partial<
  CRQScenarioUpdateRequest | SimpleScenarioUpdateRequest
>;

const isCRQScenarioUpdateRequest = (
  updatePayload: UpdateFieldParams,
): updatePayload is CRQScenarioUpdateRequest => {
  return updatePayload.scenario_type === scenarioTypes.CRQ;
};

/**
 * Update specific fields of a risk register scenario
 */
export const useUpdateRiskRegisterScenarioField = (
  options: UseMutationOptions<
    RiskRegisterResponse,
    AxiosError,
    UpdateFieldParams
  >,
) => {
  const client = useAxiosInstance();
  const scenarioId = useCurrentRiskRegisterScenarioId();
  const { data: scenario, isError } = useRiskRegisterScenario(scenarioId);

  return useMutation<RiskRegisterResponse, AxiosError, UpdateFieldParams>({
    mutationKey: [
      QUERY_KEYS.RISK_REGISTER_SCENARIOS,
      'updateField',
      scenarioId,
    ],
    mutationFn: async (data) => {
      if (!scenario || isError) throw new Error('Scenario not loaded');

      const updatePayload:
        | SimpleScenarioUpdateRequest
        | CRQScenarioUpdateRequest = {
        customer_scenario_id: scenario.customer_scenario_id,
        name: scenario.name,
        description: scenario.description,
        likelihood: scenario.scenario_data.likelihood,
        impact: scenario.scenario_data.impact,
        company_id: data.company_id || scenario.scenario_data.company_id,
        annual_likelihood: scenario.scenario_data.annual_likelihood,
        average_loss: scenario.scenario_data.average_loss,
        average_loss_currency: scenario.scenario_data.average_loss_currency,
        response_plan: scenario.scenario_data.response_plan,
        risk_owner: scenario.scenario_data.risk_owner,
        risk_priority: scenario.scenario_data.risk_priority,
        impact_distribution: scenario.scenario_data.impact_distribution,
        methodology_insights: scenario.scenario_data.methodology_insights,
        peer_base_rate: scenario.scenario_data.peer_base_rate,
        relevant_controls: scenario.scenario_data.relevant_controls,
        ticket: scenario.scenario_data.ticket,
        crq_data: (() => {
          const baseCrqData = scenario.scenario_data.crq_data;
          if (!baseCrqData) return baseCrqData;
          const { results: _, ...rest } = baseCrqData;
          return rest;
        })(),
        scenario_type: scenario.scenario_type,
        sub_category: scenario.scenario_data.sub_category,
        review_date: scenario.scenario_data.review_date,
        mitigation_cost: scenario.scenario_data.mitigation_cost,
        ...data,
      };

      const requestBody = buildScenarioRequestBody(
        updatePayload,
        scenario.scenario_type,
      );

      return client
        .patch(`${API_URL.RISK_SCENARIOS}${scenarioId}`, requestBody)
        .then(({ data }) => data);
    },
    ...options,
  });
};

/**
 * Update a risk register scenario (general purpose)
 */
export const useUpdateRiskRegisterScenario = (
  scenarioId: string,
  options: UseMutationOptions<
    RiskRegisterResponse,
    AxiosError<{ detail: string }>,
    UpdateFieldParams
  >,
) => {
  const client = useAxiosInstance();
  const { refetch } = useRiskRegisterScenario(scenarioId, { enabled: false });

  return useMutation<
    RiskRegisterResponse,
    AxiosError<{ detail: string }>,
    UpdateFieldParams
  >({
    mutationKey: [
      QUERY_KEYS.RISK_REGISTER_SCENARIOS,
      'updateField',
      scenarioId,
    ],
    mutationFn: async (data) => {
      const { data: scenario, isError } = await refetch();
      if (!scenario || isError) throw new Error('Scenario not loaded');
      const restOfPayload = isCRQScenarioUpdateRequest(data)
        ? (() => {
          const baseCrqData =
            data.crq_data || scenario.scenario_data.crq_data;
          if (!baseCrqData) return {};
          const { results: _, ...crqDataWithoutResults } = baseCrqData;
          return { crq_data: crqDataWithoutResults };
        })()
        : {};
      const updatePayload:
        | SimpleScenarioUpdateRequest
        | CRQScenarioUpdateRequest = {
        customer_scenario_id:
          data.customer_scenario_id || scenario.customer_scenario_id,
        name: data.name || scenario.name,
        description: data.description || scenario.description,
        likelihood: data.likelihood || scenario.scenario_data.likelihood,
        impact: data.impact || scenario.scenario_data.impact,
        company_id: data.company_id || scenario.scenario_data.company_id,
        annual_likelihood:
          data.annual_likelihood || scenario.scenario_data.annual_likelihood,
        average_loss: data.average_loss || scenario.scenario_data.average_loss,
        average_loss_currency:
          data.average_loss_currency ||
          scenario.scenario_data.average_loss_currency,
        response_plan:
          data.response_plan || scenario.scenario_data.response_plan,
        risk_owner: data.risk_owner || scenario.scenario_data.risk_owner,
        risk_priority:
          data.risk_priority || scenario.scenario_data.risk_priority,
        scenario_category:
          data.scenario_category || scenario.scenario_data.scenario_category,
        ai_assets: data.ai_assets || scenario.scenario_data.ai_assets,
        tactics: data.tactics || scenario.scenario_data.tactics,
        event_types: data.event_types || scenario.scenario_data.event_types,
        impact_types:
          data.impact_types || scenario.scenario_data.impact_types,
        data_exposure:
          data.data_exposure || scenario.scenario_data.data_exposure,
        impact_distribution:
          data.impact_distribution ||
          scenario.scenario_data.impact_distribution,
        methodology_insights:
          data.methodology_insights ||
          scenario.scenario_data.methodology_insights,
        peer_base_rate:
          data.peer_base_rate || scenario.scenario_data.peer_base_rate,
        relevant_controls:
          data.relevant_controls || scenario.scenario_data.relevant_controls,
        ticket: data.ticket || scenario.scenario_data.ticket,
        scenario_type: scenario.scenario_type,
        ...restOfPayload,
      };

      const requestBody = buildScenarioRequestBody(
        updatePayload,
        scenario.scenario_type,
      );

      return client
        .patch(`${API_URL.RISK_SCENARIOS}${scenarioId}`, requestBody)
        .then(({ data }) => data);
    },
    ...options,
  });
};

/**
 * Delete a risk register scenario
 */
export const useDeleteRiskRegisterScenario = (
  options?: Omit<UseMutationOptions<null, AxiosError, string>, 'mutationFn'>,
) => {
  const client = useAxiosInstance();
  return useMutation({
    mutationFn: (scenarioId) =>
      client.delete(`${API_URL.RISK_SCENARIOS}${scenarioId}`),
    ...options,
  });
};

/**
 * Export risk register scenarios to Excel
 */
export const useExportRiskRegisterScenario = (
  options?: Omit<
    UseMutationOptions<unknown, AxiosError, void, unknown>,
    'mutationFn'
  >,
) => {
  const client = useAxiosInstance();
  return useMutation<unknown, AxiosError, void>({
    mutationFn: () =>
      client
        .get(`${API_URL.RISK_SCENARIOS}export`, {
          responseType: 'blob',
        })
        .then((response) => {
          // Create a URL for the blob
          const url = window.URL.createObjectURL(
            new Blob([response.data], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }),
          );
          // Create a temporary link element
          const link = document.createElement('a');
          link.href = url;
          // Set the filename for download
          link.setAttribute('download', `risk-register-scenarios.xlsx`);
          // Append to document, click, and cleanup
          document.body.appendChild(link);
          link.click();
          link.remove();
          // Cleanup the URL object
          window.URL.revokeObjectURL(url);
          return response;
        }),
    ...options,
  });
};

/**
 * Fetch security controls for a scenario
 */
export const useRiskRegisterScenarioControls = (
  scenarioId: string,
  options?: StrippedQueryOptions<unknown, AxiosError>,
) => {
  const client = useAxiosInstance();
  return useQuery<unknown, AxiosError>({
    queryKey: [QUERY_KEYS.RISK_REGISTER_SCENARIOS, scenarioId],
    queryFn: () =>
      client
        .get(`${API_URL.RISK_SCENARIOS}${scenarioId}/controls`)
        .then(({ data }) => data),
    ...options,
  });
};

/**
 * Rerun/update a CRQ scenario with latest data
 */
export const useUpdateCRQScenario = (
  options?: Omit<
    UseMutationOptions<
      RiskRegisterResponse,
      AxiosError,
      { scenarioId: string }
    >,
    'mutationFn'
  >,
) => {
  const client = useAxiosInstance();
  return useMutation<RiskRegisterResponse, AxiosError, { scenarioId: string }>({
    mutationFn: ({ scenarioId }) =>
      client
        .post(`${API_URL.RISK_SCENARIOS}crq/${scenarioId}/update-crq`)
        .then(({ data }) => data),
    ...options,
  });
};

/**
 * Request a pre-defined scenario template
 */
export const useRequestPreDefinedScenario = (
  options?: Omit<
    UseMutationOptions<{ message: string }, AxiosError, void>,
    'mutationFn'
  >,
) => {
  const client = useAxiosInstance();
  return useMutation<{ message: string }, AxiosError, void>({
    mutationFn: () =>
      client
        .post(`${API_URL.RISK_SCENARIOS}request-pre-defined-scenario`)
        .then(({ data }) => data),
    ...options,
  });
};

// ============================================================================
// RISK OWNER HOOKS
// ============================================================================

/**
 * Fetch list of risk owners (users who can be assigned to scenarios)
 */
let mockRiskOwners: RiskOwner[] = [
  {
    id: 'mock-owner-1',
    email: 'risk.owner@example.com',
    active_tenant: '',
    tenant_ids: [],
  },
  {
    id: 'mock-owner-2',
    email: 'security.lead@example.com',
    active_tenant: '',
    tenant_ids: [],
  },
  {
    id: 'mock-owner-3',
    email: 'compliance.manager@example.com',
    active_tenant: '',
    tenant_ids: [],
  },
];

export const useRiskOwners = (
  options?: StrippedQueryOptions<RiskOwner[], AxiosError>,
) => {
  return useQuery<RiskOwner[], AxiosError>({
    queryKey: [QUERY_KEYS.RISK_OWNER],
    queryFn: async () => mockRiskOwners,
    ...options,
  });
};

/**
 * Create/invite a new risk owner
 */
export const useCreateRiskOwner = (
  options?: Omit<
    UseMutationOptions<RiskOwner, AxiosError, InvitationFormValues>,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userDetails: InvitationFormValues) => {
      const id =
        typeof globalThis.crypto?.randomUUID === 'function'
          ? globalThis.crypto.randomUUID()
          : `mock-owner-${Date.now()}`;
      const newOwner: RiskOwner = {
        id,
        email: userDetails.email,
        active_tenant: '',
        tenant_ids: [],
      };
      mockRiskOwners = [...mockRiskOwners, newOwner];
      return newOwner;
    },
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      // Invalidate the risk owners query
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RISK_OWNER] });

      // Call the original onSuccess if it exists
      if (options?.onSuccess) {
        void options.onSuccess(data, variables, onMutateResult, context);
      }
    },
  });
};

// ============================================================================
// NOTES HOOKS
// ============================================================================

/**
 * Fetch notes for a scenario
 * Uses scenario-based endpoint: GET /api/v1/risk-scenarios/{scenario_id}/notes
 */
export const useNotes = (
  scenarioId: string,
  options?: StrippedQueryOptions<Note[], AxiosError>,
) => {
  const client = useAxiosInstance();

  return useQuery<Note[], AxiosError>({
    queryKey: [QUERY_KEYS.NOTES, 'scenario', scenarioId],
    queryFn: () => {
      // Remove trailing slash if present
      const cleanScenarioId = scenarioId.replace(/\/+$/, '');
      const endpoint = `${API_URL.RISK_SCENARIOS}${cleanScenarioId}/notes`;

      return client
        .get(endpoint)
        .then((res) => {
          // Backend returns data in res.data.data format
          const notes = res.data?.data || res.data?.items || [];
          return Array.isArray(notes) ? notes : [];
        })
        .catch((error) => {
          console.error('❌ Error fetching Notes:', error);
          console.error('❌ Error response:', error.response?.data);
          console.error('❌ Error status:', error.response?.status);
          throw error;
        });
    },
    enabled: Boolean(scenarioId),
    ...options,
  });
};

/**
 * Create a new note (with optional file attachment)
 * Uses scenario-based endpoints:
 * - POST /api/v1/risk-scenarios/{scenario_id}/notes (for notes without attachment)
 * - POST /api/v1/risk-scenarios/{scenario_id}/notes-with-attachment (for notes with attachment)
 */
export const useCreateNote = (
  options?: Omit<
    UseMutationOptions<
      Note,
      AxiosError,
      { scenarioId: string; content: string; uploaded_file?: File },
      unknown
    >,
    'mutationFn'
  >,
) => {
  const client = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation<
    Note,
    AxiosError,
    { scenarioId: string; content: string; uploaded_file?: File },
    unknown
  >({
    mutationFn: ({ scenarioId, content, uploaded_file }) => {
      // Validate scenarioId before making API call
      if (!scenarioId || scenarioId.trim() === '') {
        console.error('❌ useCreateNote: Invalid scenarioId:', scenarioId);
        return Promise.reject(new Error('Invalid scenario ID'));
      }

      // Remove trailing slash if present
      const cleanScenarioId = scenarioId.replace(/\/+$/, '');

      // If file is present, use notes-with-attachment endpoint with FormData
      if (uploaded_file) {
      const formData = new FormData();
      formData.append('content', content);
        formData.append('file', uploaded_file);
        formData.append('filename', uploaded_file.name);
        formData.append('content_type', uploaded_file.type || 'application/octet-stream');

        const endpoint = `${API_URL.RISK_SCENARIOS}${cleanScenarioId}/notes-with-attachment`;

        return client
          .post(endpoint, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(({ data }) => {
            return data?.data || data;
          })
          .catch((error) => {
            throw error;
          });
      }

      // For notes without attachment, use notes endpoint with content as query param
      const endpoint = `${API_URL.RISK_SCENARIOS}${cleanScenarioId}/notes`;

      return client
        .post(endpoint, null, {
          params: {
            content,
          },
        })
        .then(({ data }) => {
          return data?.data || data;
        })
        .catch((error) => {
          throw error;
        });
    },
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      // Invalidate and refetch the notes for this scenario
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTES, 'scenario', variables.scenarioId],
      });
      if (options?.onSuccess) {
        void options.onSuccess(data, variables, onMutateResult, context);
      }
    },
  });
};

// ============================================================================
// DOCUMENT HOOKS
// ============================================================================

/**
 * Download a document/attachment by ID
 * For scenario attachments, uses: GET /api/v1/risk-scenarios/{scenario_id}/attachments/download?attachment_id={id}
 * For other documents, uses: /api/v1/documents/{documentId}
 */
export const useGetDocument = (
  options?: Omit<
    UseMutationOptions<
      Blob | { download_url: string },
      AxiosError,
      { documentId: string; scenarioId?: string },
      unknown
    >,
    'mutationFn'
  >,
) => {
  const client = useAxiosInstance();
  return useMutation({
    mutationFn: async ({ documentId, scenarioId }: { documentId: string; scenarioId?: string }) => {
      // If scenarioId is provided, use scenario-based attachment endpoint with blob response
      if (scenarioId) {
        const cleanScenarioId = scenarioId.replace(/\/+$/, '');
        const response = await client.get<Blob>(
          `${API_URL.RISK_SCENARIOS}${cleanScenarioId}/attachments/download`,
          {
            params: {
              attachment_id: documentId,
            },
            responseType: 'blob',
          },
        );
        return response.data;
      }

      // Otherwise, use standard document endpoint
      const response = await client.get<{ download_url: string }>(`${API_URL.DOCUMENTS}/${documentId}`);
      return response.data;
    },
    ...options,
  });
};

// ============================================================================
// UPGRADE HOOKS
// ============================================================================

/**
 * Upgrade from limited to full plan (for limited users)
 */
export const useUpgradeToFullPlan = (
  options?: Omit<
    UseMutationOptions<{ message: string }, AxiosError>,
    'mutationFn'
  >,
) => {
  return useMutation<{ message: string }, AxiosError>({
    mutationFn: async () => ({
      message: 'Upgrade is unavailable in this environment.',
    }),
    ...options,
  });
};

export const useFrameworks = (
  options?: UseQueryOptions<FrameworkResponseList, AxiosError>,
) => {
  const client = useAxiosInstance();
  return useQuery<FrameworkResponseList, AxiosError>({
    queryKey: [QUERY_KEYS.FRAMEWORKS],
    queryFn: () => client.get(`${API_URL.FRAMEWORKS}`).then(({ data }) => data),
    ...options,
  });
};
