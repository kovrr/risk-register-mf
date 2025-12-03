import { withStrapiApiPath, withStrapiCmsPath } from '@/services/strapi';
import type {
  Group,
  GroupListPagination,
  GroupListResponse,
} from '@/types/group';
import type { AxiosInstance } from 'axios';

export type FetchGroupsParams = {
  page?: number;
  pageSize?: number;
  sort?: string;
  search?: string;
};

export type FetchGroupsWithCreatePermissionParams = {
  page?: number;
  pageSize?: number;
  sort?: string;
  active_group_id?: string;
};

const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 10,
  pageCount: 0,
  total: 0,
};

type RawGroupsResponse = {
  success?: boolean;
  data?: {
    groups?: Group[];
  };
  error?: unknown;
};

const buildGroupsEndpoint = ({
  page = 1,
  pageSize = 10,
  sort = 'name:ASC',
  search,
}: FetchGroupsParams) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('pageSize', pageSize.toString());
  params.append('sort', sort);

  if (search?.trim()) {
    const value = search.trim();
    params.append('filters[name][$containsi]', value);
  }

  const basePath = withStrapiCmsPath(
    '/api/groups/with-risk-scenarios-permission',
  );
  return `${basePath}?${params.toString()}`;
};

type GroupsWithCreatePermissionResponse = {
  success?: boolean;
  data?: Group[];
  meta?: {
    pagination?: GroupListPagination;
  };
  error?: unknown;
};

const buildGroupsWithCreatePermissionEndpoint = ({
  page = 1,
  pageSize = 100,
  sort = 'name:ASC',
  active_group_id,
}: FetchGroupsWithCreatePermissionParams) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('pageSize', pageSize.toString());
  params.append('sort', sort);

  if (active_group_id) {
    params.append('active_group_id', active_group_id);
  }

  const basePath = withStrapiApiPath(
    '/groups/with-risk-scenarios-permission-create',
  );
  return `${basePath}?${params.toString()}`;
};

export const getGroupsWithCreatePermission = async (
  client: AxiosInstance,
  params: FetchGroupsWithCreatePermissionParams = {},
): Promise<GroupListResponse> => {
  const endpoint = buildGroupsWithCreatePermissionEndpoint(params);
  const { data } =
    await client.get<GroupsWithCreatePermissionResponse>(endpoint);

  const results = Array.isArray(data?.data) ? data.data : [];
  const pagination = data?.meta?.pagination ?? DEFAULT_PAGINATION;

  return {
    results,
    pagination,
  };
};

export const getGroups = async (
  client: AxiosInstance,
  params: FetchGroupsParams = {},
): Promise<GroupListResponse> => {
  const endpoint = buildGroupsEndpoint(params);
  const { data } = await client.get<RawGroupsResponse>(endpoint);

  const results = Array.isArray(data?.data?.groups)
    ? (data.data?.groups ?? [])
    : [];

  return {
    results,
    pagination: DEFAULT_PAGINATION,
  };
};
