export type GroupUserSummary = {
  id: number;
  documentId?: string;
  username: string | null;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  isActive?: boolean;
  blocked?: boolean;
  confirmed?: boolean;
  locale?: string | null;
  publishedAt?: string | null;
};

export type Group = {
  id: number;
  documentId: string;
  name: string;
  superUser: boolean;
  status?: string;
  locale?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  owner?: GroupUserSummary;
  createdBy?: GroupUserSummary;
  updatedBy?: GroupUserSummary;
};

export type GroupListPagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type GroupListResponse = {
  results: Group[];
  pagination: GroupListPagination;
};

