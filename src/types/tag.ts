export interface Tag {
  id: string;
  name: string;
  group_id: string;
  description?: string;
  color: string;
  tag_type?: string;
  creator: {
    documentId?: string;
    email: string;
    firstname?: string;
    id: number;
    lastname?: string;
  };
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface TagListResponse {
  tags: Tag[];
  total_count: number;
  group_ids: string[];
}

export interface CreateTagRequest {
  name: string;
  group_id: string;
  description?: string;
  color: string;
  tag_type?: string;
}

export interface UpdateTagRequest {
  name?: string;
  description?: string;
  color?: string;
  tag_type?: string;
}

export interface TagListParams {
  group_ids: string[];
  name?: string;
  skip?: number;
  limit?: number;
}
