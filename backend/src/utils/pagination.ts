export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}

export interface PaginationResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getPaginationOptions = (query: Record<string, string>) => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
  const sort = query.sort || '-createdAt';
  const search = query.search || '';
  const offset = (page - 1) * limit;
  return { page, limit, sort, search, offset };
};
