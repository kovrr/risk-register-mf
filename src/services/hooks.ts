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
  type SimpleScenarioUpdateRequest,
  scenarioTypes,
} from '@/types/riskRegister';
import type { FeatureToggle, TenantData } from '@/types/tenantData';
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
  TENANT_DATA: ['TENANT_DATA'],
  RISK_REGISTER_SCENARIOS: ['RISK_REGISTER_SCENARIOS'],
  NOTES: ['NOTES'],
  RISK_REGISTER_SCENARIOS_TABLE: ['RISK_REGISTER_SCENARIOS_TABLE'],
  RISK_OWNER: ['RISK_REGISTER_RISK_OWNER'],
  DOCUMENTS: ['DOCUMENTS'],
  FQ: ['FQ'], // Financial Quantification
  FRAMEWORKS: `FRAMEWORKS`,
};

const baseURL: string =
  import.meta.env.VITE_API_URL ||
  import.meta.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000';

// API URLs - Risk Register specific
export const API_URL = {
  COMPANIES: `${baseURL}/api/companies`,
  RISK_REGISTER: `${baseURL}/api/risk-register`,
  NOTES: `/api/notes`,
  TENANT: `${baseURL}/api/tenant`,
  DOCUMENTS: `${baseURL}/api/documents`,
  FQ: `${baseURL}/api/fq`, // Financial Quantification
  FRAMEWORKS: `${baseURL}/api/self-assessment/frameworks`,
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

/**
 * Fetch tenant data including feature toggles
 */
type StrippedQueryOptions<TQueryFnData, TError = AxiosError, TData = TQueryFnData> =
  Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey' | 'queryFn'> & {
    /**
     * React Query v5 removed `keepPreviousData`, but we allow it for backward compatibility.
     * It is ignored at runtime by the underlying library.
     */
    keepPreviousData?: boolean;
  };

export const useTenantData = (
  options?: StrippedQueryOptions<TenantData>,
) => {
  const client = useAxiosInstance();
  return useQuery<TenantData, AxiosError>({
    queryKey: QUERY_KEYS.TENANT_DATA,
    queryFn: () => client.get(API_URL.TENANT).then(({ data }) => data),
    ...options,
  });
};

/**
 * Fetch paginated list of companies
 */
export const useCompanies = (
  params: {
    page: number;
    size: number;
    name?: string;
    fields?: string[];
    id?: string;
  },
  options?: StrippedQueryOptions<{ items: CompanyApiResponseItem[]; total: number }>,
) => {
  const client = useAxiosInstance();

  const { page, size, name, fields, id } = params;
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('size', size.toString());
  if (name) {
    queryParams.append('name', name);
  }
  if (fields) {
    fields.forEach((field) => queryParams.append('fields', field));
  }
  if (id) {
    queryParams.append('id', id);
  }
  const urlWithParams = `${API_URL.COMPANIES}?${queryParams.toString()}`;
  return useQuery<{ items: CompanyApiResponseItem[]; total: number }, AxiosError>({
    queryKey: [...QUERY_KEYS.COMPANIES, page, size, fields, id],
    queryFn: () => client.get(urlWithParams).then(({ data }) => data),
    ...options,
  });
};

/**
 * Fetch a single company by ID
 */
export const useCompany = (
  id: string,
  options?: StrippedQueryOptions<CompanyData, AxiosError>,
) => {
  const client = useAxiosInstance();
  return useQuery<CompanyData, AxiosError>({
    queryKey: [...QUERY_KEYS.COMPANIES, { id }],
    queryFn: () => {
      return client.get(`${API_URL.COMPANIES}/${id}`).then(({ data }) => {
        return data;
      });
    },
    ...options,
  });
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

/**
 * Feature toggle hook
 */
const useFeatureToggle = (
  name: string,
): { featureToggle: FeatureToggle | undefined; isLoading: boolean } => {
  const { data: tenantData, isPending } = useTenantData();
  return {
    featureToggle: tenantData?.feature_toggles.find(
      (toggle) => toggle.name === name,
    ),
    isLoading: isPending,
  };
};

/**
 * Check if CRQ scenarios are enabled
 */
export const useFeatureRiskRegisterCRQ = () => {
  const { featureToggle } = useFeatureToggle('enable.riskRegister.crq');
  return !!featureToggle?.value;
};

/**
 * Check if Risk Register templates are enabled
 */
export const useFeatureRiskRegisterTemplate = () => {
  const { featureToggle } = useFeatureToggle('enable.RiskRegisterTemplate');
  return !!featureToggle?.value;
};

/**
 * Check if Risk Register export is enabled
 */
export const useFeatureRiskRegisterExport = () => {
  const { featureToggle } = useFeatureToggle('enable.riskRegister.export');
  return !!featureToggle?.value;
};

/**
 * Check if Risk Register reorganize is enabled
 */
export const useFeatureRiskRegisterReorganize = () => {
  const { featureToggle } = useFeatureToggle('enable.riskRegister.reorganize');
  return !!featureToggle?.value;
};

/**
 * Get remaining CRQ scenario licenses
 */
export const useCRQScenarioRemainingLicenses = () => {
  const client = useAxiosInstance();
  return useQuery<number, AxiosError>({
    queryKey: [QUERY_KEYS.TENANT_DATA, 'remaining_crq_scenarios_licenses'],
    queryFn: () =>
      client
        .get(`${API_URL.TENANT}/remaining_crq_scenarios_licenses`)
        .then(({ data }) => data['remaining_crq_scenarios_licenses']),
  });
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
    UseMutationOptions<unknown, unknown, unknown, unknown>,
    'mutationFn'
  >,
) => {
  const client = useAxiosInstance();
  return useMutation({
    mutationFn: (scenario: ScenarioCreateRequest) =>
      client.post(`${API_URL.RISK_REGISTER}/scenarios`, scenario),
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
    mutationFn: (scenario) =>
      client
        .post(`${API_URL.RISK_REGISTER}/scenarios/crq`, scenario)
        .then(({ data }) => data),
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

  const { page, size, name, fields, sort_by, sort_order } = params;
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('size', size.toString());
  if (name) {
    queryParams.append('name', name);
  }
  if (fields) {
    fields.forEach((field) => queryParams.append('fields', field));
  }
  if (sort_by) {
    queryParams.append('sort_by', sort_by);
  }
  if (sort_order) {
    queryParams.append('sort_order', sort_order);
  }
  const urlWithParams = `${API_URL.RISK_REGISTER}/scenarios?${queryParams.toString()}`;
  return useQuery<RiskRegisterScenarioPaginatedResponse, AxiosError>({
    queryKey: [
      ...QUERY_KEYS.RISK_REGISTER_SCENARIOS_TABLE,
      page,
      size,
      name,
      fields,
      sort_by,
      sort_order,
    ],
    queryFn: () => client.get(urlWithParams).then(({ data }) => data),
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
        .get(`${API_URL.RISK_REGISTER}/scenarios/${scenarioId}`)
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
        .get(`${API_URL.RISK_REGISTER}/scenarios/${scenarioId}/metrics-history`)
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

      return client
        .patch(
          `${API_URL.RISK_REGISTER}/scenarios/${scenarioId}`,
          updatePayload,
        )
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

      return client
        .patch(
          `${API_URL.RISK_REGISTER}/scenarios/${scenarioId}`,
          updatePayload,
        )
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

      return client
        .patch(
          `${API_URL.RISK_REGISTER}/scenarios/${scenarioId}`,
          updatePayload,
        )
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
      client.delete(`${API_URL.RISK_REGISTER}/scenarios/${scenarioId}`),
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
        .get(`${API_URL.RISK_REGISTER}/scenarios/export`, {
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
        .get(`${API_URL.RISK_REGISTER}/scenarios/${scenarioId}/controls`)
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
        .post(`${API_URL.RISK_REGISTER}/scenarios/crq/${scenarioId}/update-crq`)
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
        .post(`${API_URL.RISK_REGISTER}/request-pre-defined-scenario`)
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
export const useRiskOwners = (
  options?: StrippedQueryOptions<RiskOwner[], AxiosError>,
) => {
  const client = useAxiosInstance();
  return useQuery<RiskOwner[], AxiosError>({
    queryKey: [QUERY_KEYS.RISK_OWNER],
    queryFn: () =>
      client.get(`${API_URL.TENANT}/users`).then(({ data }) => data),
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
  const client = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userDetails: InvitationFormValues) =>
      client
        .post(`${API_URL.TENANT}/invite`, userDetails)
        .then(({ data }) => data),
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
 */
export const useNotes = (
  parentType: 'quantification' | 'scenario',
  parentId: string,
  options?: StrippedQueryOptions<Note[], AxiosError>,
) => {
  const client = useAxiosInstance();

  // Validate parentId before making API calls
  const isValidParentId =
    parentId &&
    parentId !== 'undefined' &&
    parentId.trim() !== '' &&
    parentId.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );

  if (!isValidParentId) {
    console.error('❌ useNotes: Invalid parentId:', parentId);
  }

  return useQuery<Note[], AxiosError>({
    queryKey: [QUERY_KEYS.NOTES, parentType, parentId],
    queryFn: () => {
      const params = {
        parent_type: parentType,
        parent_id: parentId,
      };

      return client
        .get<NotesPage>(API_URL.NOTES, { params })
        .then(({ data }) => {
          // Extract notes from paginated response
          const notes = data.items || [];
          return notes;
        })
        .catch((error) => {
          console.error('❌ Error fetching Notes:', error);
          console.error('❌ Error response:', error.response?.data);
          console.error('❌ Error status:', error.response?.status);
          throw error;
        });
    },
    enabled: !!isValidParentId,
    ...options,
  });
};

/**
 * Create a new note (with optional file attachment)
 */
export const useCreateNote = (
  options?: Omit<
    UseMutationOptions<Note, AxiosError, CreateGenericNoteParams>,
    'mutationFn'
  >,
) => {
  const client = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation<Note, AxiosError, CreateGenericNoteParams>({
    mutationFn: ({ parentType, parentId, content, user, uploaded_file }) => {
      // Validate parentId before making API call
      const isValidParentId =
        parentId &&
        parentId !== 'undefined' &&
        parentId.trim() !== '' &&
        parentId.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
        );

      if (!isValidParentId) {
        console.error('❌ useCreateNote: Invalid parentId:', parentId);
        return Promise.reject(new Error('Invalid parent ID'));
      }

      // Create FormData
      const formData = new FormData();
      formData.append('parent_type', parentType);
      formData.append('parent_id', parentId);
      formData.append('content', content);
      formData.append('user', user);

      if (uploaded_file) {
        formData.append('uploaded_file', uploaded_file);
      }

      return client
        .post(API_URL.NOTES, formData)
        .then(({ data }) => {
          return data;
        })
        .catch((error) => {
          throw error;
        });
    },
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      // Invalidate and refetch the notes for this parent
      void queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.NOTES, variables.parentType, variables.parentId],
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
 * Download a document by ID
 */
export const useGetDocument = (
  options?: Omit<
    UseMutationOptions<unknown, unknown, unknown, unknown>,
    'mutationFn'
  >,
) => {
  const client = useAxiosInstance();
  return useMutation({
    mutationFn: (documentId: string) =>
      client.get(`${API_URL.DOCUMENTS}/${documentId}`),
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
  const client = useAxiosInstance();
  return useMutation<{ message: string }, AxiosError>({
    mutationFn: () =>
      client
        .post(`${API_URL.TENANT}/upgrade-to-full-plan`)
        .then(({ data }) => data),
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
