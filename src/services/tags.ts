import type {
  CreateTagRequest,
  Tag,
  TagListParams,
  TagListResponse,
  UpdateTagRequest,
} from '@/types/tag';
import type { AxiosInstance } from 'axios';

const sanitizeId = (value: string): string => value?.replace(/\/+$/, '') ?? '';

/**
 * Fetch tags list with optional filtering
 */
export const getTags = async (
  client: AxiosInstance,
  params: TagListParams,
): Promise<TagListResponse> => {
  const searchParams = new URLSearchParams();

  // Add group_ids as array
  params.group_ids.forEach((groupId) => {
    searchParams.append('group_ids', groupId);
  });

  if (params.name) {
    searchParams.append('name', params.name);
  }
  if (params.skip !== undefined) {
    searchParams.append('skip', params.skip.toString());
  }
  if (params.limit !== undefined) {
    searchParams.append('limit', params.limit.toString());
  }

  const endpoint = `/v1/tags?${searchParams.toString()}`;
  const { data } = await client.get<{
    success: boolean;
    data: TagListResponse;
    error: null;
  }>(endpoint);
  // Extract data from the API response structure: { success, data: { tags, total_count, group_ids }, error }
  return data?.data ?? { tags: [], total_count: 0, group_ids: [] };
};

/**
 * Create a new tag
 */
export const createTag = async (
  client: AxiosInstance,
  payload: CreateTagRequest,
): Promise<Tag> => {
  const endpoint = '/v1/tags';
  const response = await client.post<{
    success: boolean;
    data: Tag;
    error: null;
  }>(endpoint, payload);
  const responseData = response.data as { success?: boolean; data?: Tag };
  return responseData?.data ?? (response.data as unknown as Tag);
};

/**
 * Update an existing tag
 */
export const updateTag = async (
  client: AxiosInstance,
  tagId: string,
  payload: UpdateTagRequest,
): Promise<Tag> => {
  const endpoint = `/v1/tags/${sanitizeId(tagId)}`;
  const response = await client.patch<{
    success: boolean;
    data: Tag;
    error: null;
  }>(endpoint, payload);
  const responseData = response.data as { success?: boolean; data?: Tag };
  return responseData?.data ?? (response.data as unknown as Tag);
};

/**
 * Delete a tag
 */
export const deleteTag = async (
  client: AxiosInstance,
  tagId: string,
): Promise<void> => {
  const endpoint = `/v1/tags/${sanitizeId(tagId)}`;
  await client.delete(endpoint);
};
