import type { AxiosInstance } from 'axios';
import type {
  NoteOutput,
  RiskRegisterResponse,
  RiskRegisterScenarioPaginatedApiResponse,
  RiskRegisterScenarioPaginatedResponse,
  ScenarioMetricsHistory,
  ScenarioType,
} from '@/types/riskRegister';

type ScenarioPayload = {
  group_id?: string;
  customer_scenario_id?: string;
  name?: string;
  description?: string | null;
  scenario_type: ScenarioType;
  scenario_data: Record<string, unknown>;
};

export type RiskScenarioListParams = {
  page: number;
  size: number;
  name?: string;
  fields?: string[];
  sort_by: string;
  sort_order: string;
};

const resolveStrapiBaseUrl = (): string => {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    return '/api';
  }
  const envBaseUrl =
    import.meta.env.NEXT_PUBLIC_STRAPI_API_URL ||
    import.meta.env.VITE_STRAPI_API_URL;

  if (!envBaseUrl) {
    throw new Error(
      'NEXT_PUBLIC_STRAPI_API_URL (or VITE_STRAPI_API_URL) must be defined to call Strapi APIs.',
    );
  }

  const normalizedBase = envBaseUrl.replace(/\/+$/, '');
  return normalizedBase.endsWith('/api') ? normalizedBase : `${normalizedBase}/api`;
};

const STRAPI_API_BASE_URL = resolveStrapiBaseUrl();

const withStrapiBasePath = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${STRAPI_API_BASE_URL}${normalizedPath}`;
};

const sanitizeId = (value: string): string => value?.replace(/\/+$/, '') ?? '';

export const getRiskScenarios = async (
  client: AxiosInstance,
  params: RiskScenarioListParams,
): Promise<RiskRegisterScenarioPaginatedResponse> => {
  const searchParams = new URLSearchParams();
  searchParams.append('page', params.page.toString());
  searchParams.append('size', params.size.toString());
  if (params.name) {
    searchParams.append('name', params.name);
  }
  if (params.fields?.length) {
    params.fields.forEach((field) => searchParams.append('fields', field));
  }
  searchParams.append('sort_by', params.sort_by);
  searchParams.append('sort_order', params.sort_order);

  const endpoint = `${withStrapiBasePath('/risk-scenarios')}?${searchParams.toString()}`;
  const { data } = await client.get<RiskRegisterScenarioPaginatedApiResponse>(endpoint);

  // Extract data from the API response structure: { success, data: { scenarios, total_count }, error }
  const apiData = data?.data;
  const items = Array.isArray(apiData?.scenarios) ? apiData.scenarios : [];
  const total = apiData?.total_count ?? items.length ?? 0;

  return {
    items,
    total,
    page: params.page,
    size: params.size,
  } as RiskRegisterScenarioPaginatedResponse;
};

export const getRiskScenarioById = async (
  client: AxiosInstance,
  scenarioId: string,
): Promise<RiskRegisterResponse> => {
  const endpoint = withStrapiBasePath(`/risk-scenarios/${sanitizeId(scenarioId)}`);
  const { data } = await client.get<RiskRegisterResponse>(endpoint);
  return (data as any)?.data ?? data;
};

export const createRiskScenario = async (
  client: AxiosInstance,
  payload: ScenarioPayload,
): Promise<RiskRegisterResponse> => {
  const endpoint = withStrapiBasePath('/risk-scenarios');
  const { data } = await client.post<RiskRegisterResponse>(endpoint, payload);
  return (data as any)?.data ?? data;
};

export const updateRiskScenario = async (
  client: AxiosInstance,
  scenarioId: string,
  payload: ScenarioPayload,
): Promise<RiskRegisterResponse> => {
  const endpoint = withStrapiBasePath(`/risk-scenarios/${sanitizeId(scenarioId)}`);
  const { data } = await client.patch<RiskRegisterResponse>(endpoint, payload);
  return (data as any)?.data ?? data;
};

export const deleteRiskScenario = async (
  client: AxiosInstance,
  scenarioId: string,
): Promise<void> => {
  const endpoint = withStrapiBasePath(`/risk-scenarios/${sanitizeId(scenarioId)}`);
  await client.delete(endpoint);
};

export const createNote = async (
  client: AxiosInstance,
  scenarioId: string,
  content: string,
): Promise<NoteOutput> => {
  const endpoint = withStrapiBasePath(
    `/risk-scenarios/${sanitizeId(scenarioId)}/notes`,
  );

  const { data } = await client.post<NoteOutput>(endpoint, {}, {
    params: { content },
  });

  return (data as any)?.data ?? data;
};

export const createNoteWithAttachment = async (
  client: AxiosInstance,
  scenarioId: string,
  formData: FormData,
): Promise<NoteOutput> => {
  const endpoint = withStrapiBasePath(
    `/risk-scenarios/${sanitizeId(scenarioId)}/notes-with-attachment`,
  );
  const { data } = await client.post<NoteOutput>(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return (data as any)?.data ?? data;
};

export const downloadAttachment = async (
  client: AxiosInstance,
  scenarioId: string,
  attachmentId: string,
): Promise<Blob> => {
  const endpoint = withStrapiBasePath(
    `/risk-scenarios/${sanitizeId(scenarioId)}/attachments/download`,
  );
  const { data } = await client.get<Blob>(endpoint, {
    params: { attachment_id: attachmentId },
    responseType: 'blob',
  });
  return data;
};

export const requestPredefinedScenario = async (
  client: AxiosInstance,
  payload: Record<string, unknown> = {},
): Promise<{ message: string }> => {
  const endpoint = withStrapiBasePath('/risk-scenarios/request-pre-defined-scenario');
  const { data } = await client.post<{ message: string }>(endpoint, payload);
  return (data as any)?.data ?? data;
};

export const getRiskScenarioMetricsHistory = async (
  client: AxiosInstance,
  scenarioId: string,
): Promise<ScenarioMetricsHistory> => {
  const endpoint = withStrapiBasePath(
    `/risk-scenarios/${sanitizeId(scenarioId)}/metrics-history`,
  );
  const { data } = await client.get<ScenarioMetricsHistory>(endpoint);
  return (data as any)?.data ?? data;
};

export const getRiskScenarioControls = async (
  client: AxiosInstance,
  scenarioId: string,
): Promise<unknown> => {
  const endpoint = withStrapiBasePath(`/risk-scenarios/${sanitizeId(scenarioId)}/controls`);
  const { data } = await client.get(endpoint);
  return (data as any)?.data ?? data;
};

export const exportRiskScenarios = async (client: AxiosInstance) => {
  const endpoint = withStrapiBasePath('/risk-scenarios/export');
  const response = await client.get(endpoint, {
    responseType: 'blob',
  });
  return response.data;
};

export const updateCrqScenario = async (
  client: AxiosInstance,
  scenarioId: string,
): Promise<RiskRegisterResponse> => {
  const endpoint = withStrapiBasePath(
    `/risk-scenarios/crq/${sanitizeId(scenarioId)}/update-crq`,
  );
  const { data } = await client.post<RiskRegisterResponse>(endpoint);
  return (data as any)?.data ?? data;
};
