import { withStrapiApiPath } from '@/services/strapi';
import type {
  NoteOutput,
  RiskRegisterResponse,
  RiskRegisterScenarioPaginatedApiResponse,
  RiskRegisterScenarioPaginatedResponse,
  ScenarioMetricsHistory,
  ScenarioType,
} from '@/types/riskRegister';
import type { AxiosInstance } from 'axios';

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
  groupId?: string;
  tag_ids?: string[];
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

  if (params.groupId) {
    searchParams.append('groupid', params.groupId);
  }

  if (params.tag_ids?.length) {
    params.tag_ids.forEach((tagId) => {
      searchParams.append('tag_ids', tagId);
    });
  }

  const endpoint = `${withStrapiApiPath('/risk-scenarios')}?${searchParams.toString()}`;
  const { data } =
    await client.get<RiskRegisterScenarioPaginatedApiResponse>(endpoint);

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
  const endpoint = withStrapiApiPath(
    `/risk-scenarios/${sanitizeId(scenarioId)}`,
  );
  const { data } = await client.get<RiskRegisterResponse>(endpoint);
  return (data as any)?.data ?? data;
};

export const createRiskScenario = async (
  client: AxiosInstance,
  payload: ScenarioPayload,
): Promise<RiskRegisterResponse> => {
  const endpoint = withStrapiApiPath('/risk-scenarios');
  const { data } = await client.post<RiskRegisterResponse>(endpoint, payload);
  return (data as any)?.data ?? data;
};

export const updateRiskScenario = async (
  client: AxiosInstance,
  scenarioId: string,
  payload: ScenarioPayload,
): Promise<RiskRegisterResponse> => {
  const endpoint = withStrapiApiPath(
    `/risk-scenarios/${sanitizeId(scenarioId)}`,
  );
  const { data } = await client.patch<RiskRegisterResponse>(endpoint, payload);
  return (data as any)?.data ?? data;
};

export const deleteRiskScenario = async (
  client: AxiosInstance,
  scenarioId: string,
): Promise<void> => {
  const endpoint = withStrapiApiPath(
    `/risk-scenarios/${sanitizeId(scenarioId)}`,
  );
  await client.delete(endpoint);
};

export type CreateNoteResponse = {
  success: boolean;
  message: string;
  data: {
    scenario_id: string;
    user_email: string;
  };
};

export const createNote = async (
  client: AxiosInstance,
  scenarioId: string,
  content: string,
): Promise<CreateNoteResponse> => {
  const endpoint = withStrapiApiPath(
    `/risk-scenarios/${sanitizeId(scenarioId)}/notes`,
  );

  const { data } = await client.post<CreateNoteResponse>(endpoint, {
    content,
  });

  return data;
};

export const createNoteWithAttachment = async (
  client: AxiosInstance,
  scenarioId: string,
  formData: FormData,
): Promise<CreateNoteResponse> => {
  const endpoint = withStrapiApiPath(
    `/risk-scenarios/${sanitizeId(scenarioId)}/notes-with-attachment`,
  );
  const { data } = await client.post<CreateNoteResponse>(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const downloadAttachment = async (
  client: AxiosInstance,
  scenarioId: string,
  attachmentId: string,
): Promise<Blob> => {
  const endpoint = withStrapiApiPath(
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
  const endpoint = withStrapiApiPath(
    '/risk-scenarios/request-pre-defined-scenario',
  );
  const { data } = await client.post<{ message: string }>(endpoint, payload);
  return (data as any)?.data ?? data;
};

export const getRiskScenarioMetricsHistory = async (
  client: AxiosInstance,
  scenarioId: string,
): Promise<ScenarioMetricsHistory> => {
  const endpoint = withStrapiApiPath(
    `/risk-scenarios/${sanitizeId(scenarioId)}/metrics-history`,
  );
  const { data } = await client.get<ScenarioMetricsHistory>(endpoint);
  return (data as any)?.data ?? data;
};

export const getRiskScenarioControls = async (
  client: AxiosInstance,
  scenarioId: string,
): Promise<unknown> => {
  const endpoint = withStrapiApiPath(
    `/risk-scenarios/${sanitizeId(scenarioId)}/controls`,
  );
  const { data } = await client.get(endpoint);
  return (data as any)?.data ?? data;
};

export const exportRiskScenarios = async (client: AxiosInstance) => {
  const endpoint = withStrapiApiPath('/risk-scenarios/export');
  const response = await client.get(endpoint, {
    responseType: 'blob',
  });
  return response.data;
};

export const updateCrqScenario = async (
  client: AxiosInstance,
  scenarioId: string,
): Promise<RiskRegisterResponse> => {
  const endpoint = withStrapiApiPath(
    `/risk-scenarios/crq/${sanitizeId(scenarioId)}/update-crq`,
  );
  const { data } = await client.post<RiskRegisterResponse>(endpoint);
  return (data as any)?.data ?? data;
};
